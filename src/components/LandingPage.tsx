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
  const [showModal, setShowModal] = useState(true);
  const [step, setStep] = useState(1);
  const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<string>("");

  const handleKnownLanguageChange = (lang: string) => {
    setKnownLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleTargetLanguageChange = (lang: string) => {
    setTargetLanguage(lang);
  };

  const handleNext = () => {
    if (step === 1 && knownLanguages.length > 0) {
      setStep(2);
    }
  };

  const handleStart = () => {
    if (targetLanguage) {
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0.2, scale: 1 }}
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      >
        <div className="w-[700px] h-[700px] rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl" />
      </motion.div>
      {/* Modal for language selection */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-6xl w-full text-center">
            <motion.div
              className="mb-16 bg-white/40 glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl mx-auto relative"
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ zIndex: 1 }}
            >
              {step === 1 && (
                <>
                  <div className="flex items-center justify-center mb-8">
                    <div className="relative">
                      <BookOpen className="w-20 h-20 text-blue-600 drop-shadow-xl" />
                      <Sparkles className="w-8 h-8 text-purple-500 absolute -top-3 -right-3 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-gray-800">Which languages do you know?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto mb-8">
                    {supportedLanguages.map(lang => (
                      <label key={lang} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${knownLanguages.includes(lang) ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                        <input
                          type="checkbox"
                          checked={knownLanguages.includes(lang)}
                          onChange={() => handleKnownLanguageChange(lang)}
                          className="accent-blue-600"
                        />
                        <ReactCountryFlag
                          countryCode={languageToCountry[lang] || 'UN'}
                          svg
                          style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
                          title={lang}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${knownLanguages.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={handleNext}
                    disabled={knownLanguages.length === 0}
                  >
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Which language do you want to learn?</h2>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto mb-6">
                    {supportedLanguages.map(lang => (
                      <label key={lang} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${targetLanguage === lang ? 'bg-purple-100' : 'hover:bg-gray-100'}`}>
                        <input
                          type="radio"
                          name="targetLanguage"
                          checked={targetLanguage === lang}
                          onChange={() => handleTargetLanguageChange(lang)}
                          className="accent-purple-600"
                        />
                        <ReactCountryFlag
                          countryCode={languageToCountry[lang] || 'UN'}
                          svg
                          style={{ width: '1.5em', height: '1.5em', borderRadius: '50%' }}
                          title={lang}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${targetLanguage ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={handleStart}
                    disabled={!targetLanguage}
                  >
                    Start
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
      {/* Welcome Card */}
      <motion.div
        className="max-w-3xl w-full mx-auto text-center relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mb-12 bg-white/70 glass rounded-3xl shadow-2xl p-12 backdrop-blur-xl flex flex-col items-center">
          <div className="flex items-center justify-center mb-6">
            <Smile className="w-16 h-16 text-purple-500 drop-shadow-xl animate-bounce-slow" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-move">
            Welcome to Voix!
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6 animate-fade-in-up delay-200">
            Your Adaptive Language Learning Companion
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in delay-300">
            Ready to start your language journey? Practice with AI-powered conversations, real-time translation, visual learning, and connect with a global community. Let's make learning fun and personal!
          </p>
          <button
            onClick={onEnter}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto animate-fade-in-up delay-500"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 mt-10">
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
      </motion.div>
    </div>
  );
};

export default LandingPage;