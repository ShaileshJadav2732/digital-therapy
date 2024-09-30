import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import RightImage from "../assets/RightImage.jpg";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // For navigation after login

    const setCookie = (name, value, hours) => {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + hours * 60 * 60 * 1000); // Expire in hours
        document.cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/;`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const handleLogin = (event) => {
        event.preventDefault();

        if (username === "Parents" && password === "parents") {
            // Set cookie with role 'parent'
            setCookie("userRole", "parent", 1); // Expire in 1 hour
            navigate("/parent-profile"); // Redirect to parent profile
        } else if (username === "Child" && password === "child") {
            // Set cookie with role 'child'
            setCookie("userRole", "child", 1); // Expire in 1 hour
            navigate("/child-profile"); // Redirect to child profile
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    const checkCookieAndNavigate = () => {
        const userRole = getCookie("userRole");
        if (userRole === "parent") {
            navigate("/parent-profile");
        } else if (userRole === "child") {
            navigate("/child-profile");
        }
    };

    // Automatically check cookie and navigate upon component mount
    useEffect(() => {
        checkCookieAndNavigate();
    }, []);

    return (
        <div className="login-container">
            {/* Left Side - Image */}
            <div
                className="image-section"
                style={{ backgroundImage: `url(${RightImage})` }}
            >
                {/* Image as background */}
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form-container">
                <div className="login-form">
                    <h3>Login To Digital Therapy</h3>
                    <p>
                        Empowering your mental well-being with personalized
                        digital therapy solutions. Start your journey to a
                        healthier mind today
                    </p>
                    <input
                        type="text"
                        placeholder="User Name"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="login-button" onClick={handleLogin}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
