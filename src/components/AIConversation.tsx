import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Send, Bot, User } from 'lucide-react';
import { CurrentPage } from '../App';
import VoiceRecorder from './VoiceRecorder';

interface AIConversationProps {
  onNavigate: (page: CurrentPage) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIConversation: React.FC<AIConversationProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI language partner. Let's have a natural conversation to help improve your language skills. What would you like to talk about today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userText: string): string => {
    const responses = [
      "That's wonderful! Let me help you expand on that thought...",
      "I love your enthusiasm! Here's how you could express that in different ways...",
      "Great job! Let's practice some related vocabulary...",
      "Interesting perspective! Let's explore this topic further...",
      "Excellent! Now let's try using that in a different context...",
      "Perfect! Here are some similar expressions you might find useful..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    // Simulate voice-to-text conversion
    const simulatedText = "This is a simulated transcription of your voice message.";
    sendMessage(simulatedText);
    setIsVoiceMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">AI Conversation</h1>
                  <p className="text-sm text-gray-600">Practice with your AI language partner</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isVoiceMode
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.sender === 'ai' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}>
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                message.sender === 'ai'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'ai' ? 'text-gray-500' : 'text-blue-100'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {isVoiceMode ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecording}
              onRecordingStart={() => console.log('Recording started')}
              onRecordingStop={() => console.log('Recording stopped')}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConversation;