import React, { useState } from 'react';
import { ArrowLeft, Languages, ArrowRight, Volume2, Copy, Check } from 'lucide-react';
import { CurrentPage } from '../App';
import VoiceRecorder from './VoiceRecorder';

interface TranslationProps {
  onNavigate: (page: CurrentPage) => void;
}

const Translation: React.FC<TranslationProps> = ({ onNavigate }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const translateText = (text: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    setTimeout(() => {
      const translations = {
        'en-es': {
          'hello': 'hola',
          'how are you': 'cómo estás',
          'good morning': 'buenos días',
          'thank you': 'gracias'
        },
        'es-en': {
          'hola': 'hello',
          'cómo estás': 'how are you',
          'buenos días': 'good morning',
          'gracias': 'thank you'
        }
      };
      
      const key = `${sourceLang}-${targetLang}`;
      const lowerText = text.toLowerCase();
      const result = translations[key]?.[lowerText] || `Translated: ${text}`;
      
      setTranslatedText(result);
      setIsTranslating(false);
    }, 1000);
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    // Simulate voice-to-text conversion
    const simulatedText = "This is your voice converted to text";
    setSourceText(simulatedText);
    translateText(simulatedText);
    setIsVoiceMode(false);
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-2">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Smart Translation</h1>
                  <p className="text-sm text-gray-600">Translate text and speech instantly</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isVoiceMode
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Language Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={swapLanguages}
              className="mx-4 p-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors duration-300"
            >
              <ArrowRight className="w-6 h-6 text-green-600" />
            </button>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Translation Interface */}
        {isVoiceMode ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Voice Translation</h3>
              <p className="text-gray-600">Speak in {languages.find(l => l.code === sourceLang)?.name} and get instant translation</p>
            </div>
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecording}
              onRecordingStart={() => console.log('Recording started')}
              onRecordingStop={() => console.log('Recording stopped')}
            />
            {translatedText && (
              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Translation</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => speakText(translatedText, targetLang)}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-300"
                    >
                      <Volume2 className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-300"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-green-600" />}
                    </button>
                  </div>
                </div>
                <p className="text-lg text-gray-800">{translatedText}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Source Text */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {languages.find(l => l.code === sourceLang)?.flag} {languages.find(l => l.code === sourceLang)?.name}
                </h3>
                <button
                  onClick={() => speakText(sourceText, sourceLang)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                  disabled={!sourceText}
                >
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => {
                  setSourceText(e.target.value);
                  if (e.target.value) {
                    translateText(e.target.value);
                  } else {
                    setTranslatedText('');
                  }
                }}
                placeholder="Type or paste text to translate..."
                className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Translated Text */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {languages.find(l => l.code === targetLang)?.flag} {languages.find(l => l.code === targetLang)?.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => speakText(translatedText, targetLang)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                    disabled={!translatedText}
                  >
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                    disabled={!translatedText}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                </div>
              </div>
              <div className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                {isTranslating ? (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Translating...</span>
                  </div>
                ) : translatedText ? (
                  <div className="w-full h-full">
                    <p className="text-gray-800 leading-relaxed">{translatedText}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Translation will appear here...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Phrases */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Phrases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Hello, how are you?",
              "Thank you very much",
              "Where is the bathroom?",
              "How much does this cost?",
              "I don't understand",
              "Can you help me?",
              "What time is it?",
              "I'm learning your language",
              "Nice to meet you"
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  setSourceText(phrase);
                  translateText(phrase);
                }}
                className="text-left p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-300"
              >
                <span className="text-sm text-gray-700">{phrase}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translation;