import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import toast from "react-hot-toast";

const ChatBox = ({ socket, data }) => {
    const [message, setMessage] = useState("");
    const [roomSize, setRoomSize] = useState(0);
    const [messages, setMessages] = useState([]);
    const messageListRef = useRef(null);

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

        socket.on('room_size', (roomData) => {
            setRoomSize(roomData.size);
        });

        return () => {
            socket.off('receive_message');
            socket.off('room_size');
        };
    }, [socket]);

    useEffect(() => {
        messageListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        toast(('Welcome to Room, ' + data.username), {
            duration: 4000,
            position: 'top-right',
            style: {
                backgroundColor: '#fdd596',
                color: '#723277'
            },
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        });
    }, [])

    return (
        <div className="chat">
            <div className="chat-header">
                <p>ROOM: {data.roomId}</p>
                <div className="user-status">
                    <div className="online-status"></div>
                    <p>{roomSize}</p>
                </div>
            </div>
            <div className="chat-window">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-container ${msg.author === data.username ? "sent" : "received"}`}
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
                    <div ref={messageListRef}></div> {/* Auto-scroll target */}
                </ul>
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button className="send-button" onClick={handleSendMessage} disabled={!message.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
