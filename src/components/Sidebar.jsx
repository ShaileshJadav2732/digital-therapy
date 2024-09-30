import React from 'react';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import usericon from '../assets/usericon.png';

function Sidebar() {

    

    const handleNewChat = () => {
        setMessages([{
          message: "Welcome to Digital Therapy – Your Space for Mental Health Support! We’re here to provide you with tools, guidance, and a supportive environment to help you navigate through your mental health challenges. How can we help?",
          sentTime: "just now",
          sender: "ChatGPT"
        }]);
      };
    
      const handleTabClick = (message) => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            message,
            sender: "user"
          }
        ]);
        processMessageToChatGPT([...messages, { message, sender: "user" }]);
      };


  return (
    <div className="sidebar">
        <h2>Digital Therapy</h2>
        <button className="new-chat-button" onClick={handleNewChat}>
          <span className="icon">+</span>
          New Chat
        </button>
        <div className="tab-container">
          <button className="tab-button" onClick={() => handleTabClick("How to reduce stress")}>How to reduce stress?</button>
          <button className="tab-button" onClick={() => handleTabClick("I am not well")}>I am not well</button>
          <button className="tab-button" onClick={() => handleTabClick("My friends tried to tease me")}>My friends tried to tease me</button>
        </div>

        {/* Profile button at the bottom */}
        <div className="sidebar-bottom">
          <button className="profile-button" onClick={() => alert('Profile clicked')}>
            <Avatar src={usericon} name="profile " />
            <span className='profile-text'>Profile</span>
          </button>
        </div>
      </div>
  );
}

export default Sidebar;