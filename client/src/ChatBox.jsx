import React, { useEffect, useState } from "react";
import "./App.css";

const ChatBox = ({ socket, data }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            const messageData = {
                room: data.roomId,
                author: data.username,
                message: message,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            await socket.emit('send_message', messageData);

            setMessages((prevMessages) => [...prevMessages, messageData]);
            setMessage("");
        }
    };

    useEffect(() => {
        socket.on('receive_message', (messageData) => {
            setMessages((prevMessages) => [...prevMessages, messageData]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    return (
        <div className="chat">
            <div className="chat-header">
                <p>ROOM: {data.roomId}</p>
            </div>
            <div className="chat-window">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-container ${msg.author === data.username ? "sent" : "received"
                                }`}
                        >
                            <div className="message-author">{msg.author}</div>
                            <div className="message">
                                <div>{msg.message}</div>
                            </div>
                            <div className="message-meta">
                                <em>({msg.time})</em>
                            </div>
                        </div>
                    ))}
                </ul>

            </div>
            <div className="chat-input">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { e.key === 'Enter' && handleSendMessage() }}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
