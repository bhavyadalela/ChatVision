import { createContext, useEffect, useState } from 'react';
import socket from '../socket';

const ChatContext = createContext(null);

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [selectedChat, setSelectedChat] = useState('');
    const [chats, setChats] = useState('');
    const [isCalling, setIscalling] = useState(false);

    useEffect(() => {
        const localStoredUser = localStorage.getItem("userInfo");

        if (localStoredUser) {
            const user = JSON.parse(localStoredUser);
            setUser(user)
            socket.connect();
        }
    }, [])

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, isCalling, setIscalling }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };
