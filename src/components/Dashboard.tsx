import React, { useState } from 'react';
import { MessageCircle, Languages, Camera, Users, ArrowLeft, Sparkles, ArrowRight, Gamepad2, BookOpen, FileText } from 'lucide-react';
import { CurrentPage } from '../App';

interface DashboardProps {
  onNavigate: (page: CurrentPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [showAIChoice, setShowAIChoice] = useState(false);
  const features = [
    {
      id: 'ai-conversation',
      title: 'AI Conversation',
      description: 'Practice natural conversations with our advanced AI language partner',
      icon: MessageCircle,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'translation',
      title: 'Smart Translation',
      description: 'Translate text and speech instantly with high accuracy',
      icon: Languages,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'playground',
      title: 'Playground',
      description: 'Practice grammar and vocabulary with interactive puzzles and games.',
      icon: Gamepad2,
      color: 'yellow',
      gradient: 'from-yellow-400 to-yellow-500'
    },
    {
      id: 'dictionary',
      title: 'Dictionary',
      description: 'Expand your vocabulary with word meanings and examples.',
      icon: BookOpen,
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      id: 'text-from-image',
      title: 'Text from Image',
      description: 'Extract text from images using Google Vision API.',
      icon: FileText,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  if (showAIChoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">AI Conversation</h2>
          <p className="text-gray-600 mb-8 text-center">How would you like to practice with your AI language partner?</p>
          <button
            className="w-full py-4 mb-4 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            onClick={() => onNavigate('ai-voice-conversation')}
          >
            Voice Conversation
          </button>
          <button
            className="w-full py-4 rounded-xl font-bold text-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
            onClick={() => onNavigate('ai-conversation')}
          >
            Text Conversation
          </button>
          <button
            className="mt-8 text-gray-500 hover:text-gray-700 underline"
            onClick={() => setShowAIChoice(false)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] p-6 flex flex-col items-center justify-start">
      <div className="max-w-6xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 mt-16 border border-white/60 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('landing')}
              className="p-3 rounded-full bg-white/80 border border-purple-100 shadow-md hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <ArrowLeft className="w-7 h-7 text-purple-600" />
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Welcome to Your Learning Hub</h1>
              <p className="text-lg text-gray-500 mt-1">Choose your learning adventure</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full px-6 py-3 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-lg font-bold text-white drop-shadow">AI Powered</span>
          </div>
        </div>
        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => feature.id === 'ai-conversation' ? setShowAIChoice(true) : onNavigate(feature.id as CurrentPage)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`bg-white/80 backdrop-blur-lg rounded-2xl p-10 shadow-xl hover:shadow-2xl border border-gray-100 hover:border-purple-200 h-full flex flex-col items-center transition-all duration-300`}> 
                <div className={`bg-gradient-to-r ${feature.gradient} rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 mb-6`}>
                  <feature.icon className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 text-center drop-shadow-sm">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>
                <div className="text-center">
                  <div className={`inline-flex items-center text-${feature.color}-600 font-bold group-hover:text-${feature.color}-700 transition-colors duration-300 bg-white/70 px-5 py-2 rounded-full shadow-sm hover:scale-105`}>
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Community Connect Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center space-x-4 mb-4">
              <Users className="w-10 h-10" />
              <h3 className="text-3xl font-extrabold">Connect with Real Users</h3>
            </div>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl font-medium">
              Join our global community of language learners. Practice with native speakers, make friends, and accelerate your learning through real conversations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('user-connect')}
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 text-lg"
          >
            <span>Connect Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;