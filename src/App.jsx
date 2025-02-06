import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ParentProfile from "./components/ParentProfile";
import ChildProfile from "./components/ChildProfile";
import ChatAi from "./components/ChatAi";
const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/parent-profile" element={<ParentProfile />} />
				<Route path="/child-profile" element={<ChildProfile />} />
				<Route path="/Ai-Chat" element={<ChatAi />} />
				<Route path="/hello" element={console.log("hello")} />
				<p>hello world2</p>
			</Routes>
		</Router>
	);
};

export default App;
