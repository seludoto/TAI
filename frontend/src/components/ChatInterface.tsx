'use client';

import { useState, useEffect, useRef } from 'react';
import { Chat, Message, User } from '@/types';
import { chatAPI, authAPI, isAuthenticated, setAuthToken, removeAuthToken } from '@/lib/api';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import AuthModal from './AuthModal';

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      loadUserAndChats();
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const loadUserAndChats = async () => {
    try {
      const [userData, chatsData] = await Promise.all([
        authAPI.getCurrentUser(),
        chatAPI.getChats()
      ]);
      setUser(userData);
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      removeAuthToken();
      setShowAuthModal(true);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatAPI.createChat();
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    setCurrentChat(chat);
    try {
      const chatData = await chatAPI.getChat(chat.id);
      setMessages(chatData.messages);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleSendMessage = async (content: string, programmingLanguage?: string) => {
    if (!currentChat) return;

    setIsLoading(true);
    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now(), // Temporary ID
        content,
        role: 'user',
        programming_language: programmingLanguage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const aiMessage = await chatAPI.sendMessage(currentChat.id, {
        content,
        programming_language: programmingLanguage
      });

      setMessages(prev => [...prev, aiMessage]);

      // Update chat in list
      setChats(prev => prev.map(chat =>
        chat.id === currentChat.id
          ? { ...chat, updated_at: new Date().toISOString() }
          : chat
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
    setShowAuthModal(false);
    loadUserAndChats();
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setChats([]);
    setCurrentChat(null);
    setMessages([]);
    setShowAuthModal(true);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onLogout={handleLogout}
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-6 py-4 bg-white">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentChat.title}
              </h1>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to TAI
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Your AI-powered programming assistant for Tanzanian and global developers
                </p>
              </div>
              <button
                onClick={handleNewChat}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start a New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}