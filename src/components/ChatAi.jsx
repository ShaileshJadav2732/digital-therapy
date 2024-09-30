import { useState, useEffect, useRef } from "react";
import "./ChatAi.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Avatar } from "@chatscope/chat-ui-kit-react";
import chaticon from "../assets/chaticon.png";
import usericon from "../assets/usericon.png";
import { useNavigate } from "react-router-dom";

const API_KEY =
    "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"; // Replace with your actual API key

const systemMessage = {
    role: "system",
    content: `You are a friendly, empathetic assistant focused on mental health support. 
  Your tone should be professional yet warm, speaking like a mental health professional who listens carefully and provides clear, actionable guidance. 
  When users express their feelings or emotions, respond in a caring, clinical way by acknowledging their emotions and asking direct, targeted questions to understand their situation thoroughly. 
  Follow up with questions like "Can you share more details?", "When did you first start feeling this way?", or "Has anything specific triggered these feelings?"

  Your goal is to make the conversation feel like a supportive and constructive therapy session, where users feel listened to, understood, and guided with helpful solutions. 
  When appropriate, provide solutions or coping strategies grounded in mental health practices such as mindfulness, therapy techniques, and cognitive-behavioral strategies.
  
  When users ask for specific steps, advice, or guidance (e.g., "steps to reduce anxiety" or "ways to improve emotional well-being"), respond with practical, solution-based advice such as:
  - "Try grounding techniques like focusing on your breathing or surroundings."
  - "Consider journaling your thoughts."
  - "Set a regular sleep schedule and engage in physical activity."
  
  Provide advice succinctly and point to clear next steps without unnecessary follow-up unless further clarification is needed.
  
  If a parent approaches to discuss their child's issues, take a clinical approach to assess the situation by asking thoughtful, diagnostic questions like "What specific behaviors or changes have you noticed in your child?", 
  "Has your child shared any concerns or anxieties with you?", and "How has this affected their daily life or relationships?" Offer empathetic and professional advice, and if the issue seems complex or beyond the assistant's scope, suggest seeking professional psychological help, such as a therapist or counselor. 
  Focus on understanding and providing actionable insights for the child's well-being.
  
  If a user's message is unrelated to mental health, respond with: "Sorry, I can’t help with that. I'm here only for your mental health."`,
};

const sensitiveKeywords = [
    "suicide",
    "end my life",
    "kill myself",
    "self-harm",
    "want to die",
];
const responseCache = new Map();

const retryFetch = async (url, options, retries = 3, delay = 1000) => {
    while (retries > 0) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response.json();
            } else if (response.status === 429) {
                console.log(
                    `429 Error: Retrying in ${delay}ms... (${
                        retries - 1
                    } retries left)`
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
                retries--;
                delay *= 2;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            if (retries <= 0) {
                throw error;
            }
            retries--;
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

const dynamicSplit = (response, stepwise = false) => {
    const stepwisePattern = /^\d+(\)|\.)\s/;
    const containsNumberedSteps = response
        .split("\n")
        .some((line) => stepwisePattern.test(line.trim()));
    if (containsNumberedSteps) {
        return [response];
    }
    const splitPattern = /(?<=[.?!])\s+(?=[A-Z])/;
    const splitMessages = response.split(splitPattern);

    if (stepwise) {
        return splitMessages.map((sentence, index) => {
            if (!stepwisePattern.test(sentence)) {
                return `${index + 1}. ${sentence.trim()}`;
            }
            return sentence.trim();
        });
    }

    return splitMessages.map((sentence) => sentence.trim());
};

function ChatAi() {
    const [messages, setMessages] = useState([
        {
            message:
                "Welcome to Digital Therapy – Your Space for Mental Health Support! We’re here to provide you with tools, guidance, and a supportive environment to help you navigate through your mental health challenges. How can we help?",
            sentTime: "just now",
            sender: "ChatGPT",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messageListRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop =
                messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const processMessageToChatGPT = async (chatMessages) => {
        const apiMessages = chatMessages.map((messageObject) => {
            const role =
                messageObject.sender === "ChatGPT" ? "assistant" : "user";
            return { role, content: messageObject.message };
        });

        const userMessage =
            chatMessages[chatMessages.length - 1].message.toLowerCase();

        if (
            sensitiveKeywords.some((keyword) => userMessage.includes(keyword))
        ) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message:
                        "I'm really sorry you're feeling this way. It's important to talk to someone who can provide you with the support you need. Please reach out to a trusted person or professional right away.",
                    sender: "ChatGPT",
                },
            ]);
            return;
        }

        if (responseCache.has(userMessage)) {
            const cachedResponse = responseCache.get(userMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: cachedResponse,
                    sender: "ChatGPT",
                },
            ]);
            return;
        }

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [systemMessage, ...apiMessages],
        };

        try {
            const data = await retryFetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(apiRequestBody),
                }
            );

            if (data && data.choices && data.choices.length > 0) {
                const fullResponse = data.choices[0].message.content;
                responseCache.set(userMessage, fullResponse);

                if (
                    fullResponse.includes(
                        "Sorry, I can’t help with that. I'm here only for your mental health."
                    )
                ) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { message: fullResponse, sender: "ChatGPT" },
                    ]);
                } else {
                    const splitMessages = dynamicSplit(fullResponse);
                    for (const chunk of splitMessages) {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                message: chunk,
                                sender: "ChatGPT",
                            },
                        ]);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                    }
                }
            } else {
                console.log("Unexpected response format:", data);
            }
        } catch (err) {
            console.error("Failed to fetch response from API:", err);
        }
    };

    const handleSend = async (message) => {
        if (isTyping) return;

        const newMessage = {
            message,
            direction: "outgoing",
            sender: "user",
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);

        setIsTyping(true);
        try {
            await processMessageToChatGPT(newMessages);
        } catch (error) {
            console.error("Error processing message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleNewChat = () => {
        setMessages([
            {
                message:
                    "Welcome to Digital Therapy – Your Space for Mental Health Support! We’re here to provide you with tools, guidance, and a supportive environment to help you navigate through your mental health challenges. How can we help?",
                sentTime: "just now",
                sender: "ChatGPT",
            },
        ]);
    };

    const handleTabClick = (message) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                message,
                sender: "user",
            },
        ]);
        processMessageToChatGPT([...messages, { message, sender: "user" }]);
    };

    // Check cookie and navigate logic
    const checkCookieAndNavigate = () => {
        const userRole = getCookie("userRole");
        if (userRole === "parent") {
            navigate("/parent-profile");
        } else if (userRole === "child") {
            navigate("/child-profile");
        }
    };

    const handleProfileBtn = () => {
        // Simply call the function to check and navigate on button click
        checkCookieAndNavigate();
    };

    const handleLogout = () => {
        const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };

        deleteCookie("userRole");

        navigate("/");
    };

    return (
        <div className="ChatAi">
            <div className="sidebar">
                <h2>Digital Therapy</h2>
                <button className="new-chat-button" onClick={handleNewChat}>
                    <span className="icon">+</span>
                    New Chat
                </button>
                <div className="tab-container">
                    <button
                        className="tab-button"
                        onClick={() => handleTabClick("How to reduce stress")}
                    >
                        How to reduce stress?
                    </button>
                    <button
                        className="tab-button"
                        onClick={() => handleTabClick("I am not well")}
                    >
                        I am not well
                    </button>
                    <button
                        className="tab-button"
                        onClick={() =>
                            handleTabClick("My friends tried to tease me")
                        }
                    >
                        My friends tried to tease me
                    </button>
                </div>

                {/* Profile button at the bottom */}
                <div className="sidebar-bottom">
                    <button className="profile-button" onClick={handleLogout}>
                        <span className="profile-text">Logout</span>
                    </button>

                    <button
                        className="profile-button"
                        onClick={handleProfileBtn}
                    >
                        <Avatar src={usericon} name="profile " />
                        <span className="profile-text">Profile</span>
                    </button>
                </div>
            </div>

            <div className="main">
                <MainContainer>
                    <ChatContainer>
                        <MessageList ref={messageListRef}>
                            {messages.map((msg, index) => (
                                <Message
                                    key={index}
                                    model={{
                                        message: msg.message,
                                        sender: msg.sender,
                                        direction:
                                            msg.sender === "ChatGPT"
                                                ? "incoming"
                                                : "outgoing",
                                        sentTime: msg.sentTime,
                                    }}
                                >
                                    {msg.sender === "ChatGPT" && (
                                        <Avatar src={chaticon} name="ChatGPT" />
                                    )}
                                    {msg.sender !== "ChatGPT" && (
                                        <Avatar src={usericon} name="User" />
                                    )}
                                </Message>
                            ))}
                            {isTyping && (
                                <TypingIndicator content="Digital Therapy is typing..." />
                            )}
                        </MessageList>
                        <MessageInput
                            placeholder="Type a message..."
                            onSend={handleSend}
                            attachButton={false}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default ChatAi;
