import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import {Toaster} from 'react-hot-toast'
import ChatBox from "./ChatBox";

const socket = io.connect("http://localhost:5000");

const App = () => {
  const [formData, setFormData] = useState({
    username: "",
    roomId: "",
  });
  const [showChat, setShowChat] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (formData.username !== "" && formData.roomId !== "") {
      socket.emit("join_room", formData.roomId);
    }
    setShowChat(true)
  };

  return (
    <div className="app">
      {!showChat ? (
        <div className="card">
          <span className="card__title">Join Room</span>
          <form className="card__form" onSubmit={joinRoom}>
            <input
              placeholder="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              placeholder="Room ID"
              type="text"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            />
            <button type="submit" className="sign-up">
              Join Now
            </button>
          </form>
        </div>
      ) : (
        <ChatBox socket={socket} data={formData} />
      )}
      <Toaster />
    </div>
  );
};

export default App;
