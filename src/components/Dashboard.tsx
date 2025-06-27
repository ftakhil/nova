import React from 'react';
import { MessageCircle, Languages, Camera, Users, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { CurrentPage } from '../App';

interface DashboardProps {
  onNavigate: (page: CurrentPage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
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
      id: 'image-identification',
      title: 'Visual Learning',
      description: 'Learn by pointing your camera at objects around you',
      icon: Camera,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('landing')}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Welcome to Your Learning Hub
              </h1>
              <p className="text-gray-600 text-lg">
                Choose your learning adventure
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">AI Powered</span>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => onNavigate(feature.id as CurrentPage)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
                <div className="flex items-center justify-center mb-6">
                  <div className={`bg-gradient-to-r ${feature.gradient} rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="text-center">
                  <div className={`inline-flex items-center text-${feature.color}-600 font-semibold group-hover:text-${feature.color}-700 transition-colors duration-300`}>
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Connect Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Connect with Real Users</h3>
              </div>
              <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
                Join our global community of language learners. Practice with native speakers, 
                make friends, and accelerate your learning through real conversations.
              </p>
            </div>
            <button
              onClick={() => onNavigate('user-connect')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Connect Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;