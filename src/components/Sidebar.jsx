// Sidebar.jsx
import React from "react";
import { Avatar } from "@chatscope/chat-ui-kit-react";
import usericon from "../assets/usericon.png";
import "./Sidebar.css"; // If you want separate styling for the sidebar
import { useNavigate } from "react-router-dom";

const Sidebar = ({ handleNewChat, handleTabClick, handleProfileBtn, handleSend }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };

        deleteCookie("userRole");
        navigate("/");
    };

    const handleTabSelect = (tab) => {
        // Send the appropriate message to ChatGPT when a tab is clicked
        switch (tab) {
            case "How to reduce stress":
                handleSend("How can I reduce stress?");
                break;
            case "I am not well":
                handleSend("I am not feeling well.");
                break;
            case "My friends tried to tease me":
                handleSend("My friends have been teasing me.");
                break;
            default:
                break;
        }
    };

    return (
        <div className="sidebar">
            <h2>Digital Therapy</h2>
            <button className="new-chat-button" onClick={handleNewChat}>
                <span className="icon">+</span>
                New Chat
            </button>
            <div className="tab-container">
                <button className="tab-button" onClick={() => handleTabSelect("How to reduce stress")}>
                    How to reduce stress?
                </button>
                <button className="tab-button" onClick={() => handleTabSelect("I am not well")}>
                    I am not well
                </button>
                <button className="tab-button" onClick={() => handleTabSelect("My friends tried to tease me")}>
                    My friends tried to tease me
                </button>
            </div>

            <div className="sidebar-bottom">
                <button className="profile-button" onClick={handleProfileBtn}>
                    <Avatar src={usericon} name="profile" />
                    <span className="profile-text">Profile</span>
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    <span className="profile-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
