import React from 'react';
import { BookOpen, Sparkles, ArrowRight, MessageCircle, Languages, Camera, Users } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const cardAnimations = [
    'animate-fade-in-up delay-100',
    'animate-fade-in-up delay-300',
    'animate-fade-in-up delay-500',
    'animate-fade-in-up delay-700',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full text-center">
        {/* Header */}
        <div className="mb-16 animate-fade-in bg-white/40 glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <BookOpen className="w-20 h-20 text-blue-600 drop-shadow-xl" />
              <Sparkles className="w-8 h-8 text-purple-500 absolute -top-3 -right-3 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-move">
            Adaptive Language Learning Companion
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in delay-200">
            Master any language with AI-powered conversations, real-time translation, 
            visual recognition, and a global community of learners.
          </p>
          <button
            onClick={onEnter}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto animate-fade-in-up delay-500"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[0,1,2,3].map(i => (
            <div key={i} className={`bg-white/60 glass backdrop-blur-2xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-white/30 ${cardAnimations[i]}`}> 
              <div className={`bg-gradient-to-r ${i===0?'from-blue-500 to-blue-600':i===1?'from-green-500 to-green-600':i===2?'from-purple-500 to-purple-600':'from-indigo-500 to-purple-600'} rounded-xl p-3 w-fit mx-auto mb-4 shadow-lg`}>
                {i===0 ? <MessageCircle className="w-8 h-8 text-white" /> : i===1 ? <Languages className="w-8 h-8 text-white" /> : i===2 ? <Camera className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 animate-fade-in-up delay-200">{['AI Conversations','Smart Translation','Visual Learning','Global Community'][i]}</h3>
              <p className="text-gray-600 text-sm animate-fade-in-up delay-300">{[
                'Practice with intelligent AI that adapts to your learning pace',
                'Instant, accurate translations with voice input support',
                'Learn by identifying objects through your camera',
                'Connect with native speakers and fellow learners',
              ][i]}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto opacity-75">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">AI Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;