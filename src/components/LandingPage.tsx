import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowRight, MessageCircle, Languages, Camera, Users, Smile } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const supportedLanguages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian', 'Portuguese', 'Italian', 'Malayalam', 'Tamil', 'Bengali', 'Turkish', 'Dutch', 'Greek', 'Polish', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Czech', 'Hungarian', 'Thai', 'Vietnamese', 'Indonesian', 'Filipino', 'Swahili', 'Hebrew', 'Urdu', 'Persian', 'Romanian', 'Ukrainian', 'Serbian', 'Croatian', 'Slovak', 'Bulgarian', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Mongolian', 'Other'
];

// Map languages to country codes for flags
const languageToCountry: Record<string, string> = {
  English: 'GB',
  Spanish: 'ES',
  French: 'FR',
  German: 'DE',
  Chinese: 'CN',
  Japanese: 'JP',
  Korean: 'KR',
  Hindi: 'IN',
  Arabic: 'SA',
  Russian: 'RU',
  Portuguese: 'PT',
  Italian: 'IT',
  Malayalam: 'IN',
  Tamil: 'IN',
  Bengali: 'BD',
  Turkish: 'TR',
  Dutch: 'NL',
  Greek: 'GR',
  Polish: 'PL',
  Swedish: 'SE',
  Norwegian: 'NO',
  Finnish: 'FI',
  Danish: 'DK',
  Czech: 'CZ',
  Hungarian: 'HU',
  Thai: 'TH',
  Vietnamese: 'VN',
  Indonesian: 'ID',
  Filipino: 'PH',
  Swahili: 'TZ',
  Hebrew: 'IL',
  Urdu: 'PK',
  Persian: 'IR',
  Romanian: 'RO',
  Ukrainian: 'UA',
  Serbian: 'RS',
  Croatian: 'HR',
  Slovak: 'SK',
  Bulgarian: 'BG',
  Slovenian: 'SI',
  Estonian: 'EE',
  Latvian: 'LV',
  Lithuanian: 'LT',
  Georgian: 'GE',
  Armenian: 'AM',
  Azerbaijani: 'AZ',
  Kazakh: 'KZ',
  Uzbek: 'UZ',
  Mongolian: 'MN',
  Other: 'UN', // Use UN flag or fallback
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const cardAnimations = [
    'animate-fade-in-up delay-100',
    'animate-fade-in-up delay-300',
    'animate-fade-in-up delay-500',
    'animate-fade-in-up delay-700',
  ];

  // Modal state
  // const [showModal, setShowModal] = useState(true);
  // const [step, setStep] = useState(1);
  // const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
  // const [targetLanguage, setTargetLanguage] = useState<string>("");

  // const handleKnownLanguageChange = (lang: string) => {
  //   setKnownLanguages(prev =>
  //     prev.includes(lang)
  //       ? prev.filter(l => l !== lang)
  //       : [...prev, lang]
  //   );
  // };

  // const handleTargetLanguageChange = (lang: string) => {
  //   setTargetLanguage(lang);
  // };

  // const handleNext = () => {
  //   if (step === 1 && knownLanguages.length > 0) {
  //     setStep(2);
  //   }
  // };

  // const handleStart = () => {
  //   if (targetLanguage) {
  //     setShowModal(false);
  //   }
  // };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-30 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-200 via-green-200 to-purple-200 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 w-full">
        {/* Illustration */}
        <div className="mb-8">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="80" height="80" rx="24" fill="url(#paint0_linear)" />
            <rect x="28" y="28" width="40" height="40" rx="12" fill="white" />
            <rect x="36" y="36" width="24" height="8" rx="4" fill="url(#paint1_linear)" />
            <rect x="36" y="52" width="24" height="8" rx="4" fill="url(#paint2_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="8" y1="8" x2="88" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="36" y1="36" x2="60" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="paint2_linear" x1="36" y1="52" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Gradient Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow mb-4 animate-fade-in-up">Welcome to Nova AI</h1>
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-2 animate-fade-in-up delay-100">Your all-in-one AI-powered language learning platform</p>
        <p className="text-md md:text-lg text-gray-400 mb-8 animate-fade-in-up delay-200">Practice, translate, play, and connect with a global community</p>
        <button
          onClick={onEnter}
          className="mt-2 px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-up delay-300"
        >
          Enter Dashboard
        </button>
      </div>
      {/* Features Carousel */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12">
        <div className="flex flex-row gap-8 overflow-x-auto pb-4 snap-x snap-mandatory">
          {[
            {
              icon: (
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
              ),
              title: 'AI Conversations',
              desc: 'Practice real conversations with a friendly AI partner.'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
              ),
              title: 'Smart Translation',
              desc: 'Instantly translate text with context-aware AI.'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
              ),
              title: 'Visual Learning',
              desc: 'Learn through images, live video, and interactive games.'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
              ),
              title: 'Global Community',
              desc: 'Connect and practice with learners and native speakers worldwide.'
            }
          ].map((f, i) => (
            <div key={i} className="snap-center min-w-[260px] bg-white/80 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-200 group cursor-pointer">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-500 transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonial Section */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-20 text-center">
        <div className="bg-white/90 rounded-2xl p-10 shadow-xl flex flex-col items-center">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-4 border-pink-200 shadow" />
          <blockquote className="text-xl italic text-gray-700 mb-2">“Nova AI made language learning fun and interactive. I love practicing with AI and meeting new friends!”</blockquote>
          <span className="text-sm text-gray-500">— Maria, Nova AI Beta User</span>
        </div>
      </div>
      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto mt-20 mb-8 text-center text-gray-400 text-sm">
        <div className="py-6 border-t border-white/30">© {new Date().getFullYear()} Nova AI. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LandingPage;