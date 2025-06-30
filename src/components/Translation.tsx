import React, { useState, useEffect } from 'react';
import { ArrowLeft, Languages, ArrowRight, Volume2, Copy, Check, Lightbulb } from 'lucide-react';
import { CurrentPage } from '../App';
import VoiceRecorder from './VoiceRecorder';
import { TranslationService, TranslationResult, GeminiScenario } from '../lib/translationService';

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
  const [languages, setLanguages] = useState([
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
  ]);
  const [geminiScenario, setGeminiScenario] = useState<GeminiScenario | null>(null);
  const [showScenario, setShowScenario] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Load supported languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const supportedLanguages = await TranslationService.getSupportedLanguages();
        // Merge with existing languages to keep flags
        const mergedLanguages = supportedLanguages.map(lang => {
          const existing = languages.find(l => l.code === lang.code);
          return {
            code: lang.code,
            name: lang.name,
            flag: existing?.flag || '🌐'
          };
        });
        setLanguages(mergedLanguages);
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  const translateText = async (text: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    setGeminiScenario(null);
    setShowScenario(false);
    
    try {
      const result: TranslationResult = await TranslationService.translateText(text, targetLang, sourceLang);
      setTranslatedText(result.translatedText);
      
      // Generate contextual scenario for all types of input (words, phrases, sentences)
      setIsGeneratingScenario(true);
      try {
        const scenario = await TranslationService.createContextualScenario(
          text.trim(),
          sourceLang,
          targetLang,
          result.translatedText
        );
        setGeminiScenario(scenario);
      } catch (error) {
        console.error('Failed to generate scenario:', error);
      } finally {
        setIsGeneratingScenario(false);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
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

  const renderScenario = (scenario: GeminiScenario) => {
    // Convert markdown-style bold to HTML
    const formattedScenario = scenario.scenario.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Learning Context</span>
          </div>
          <button
            onClick={() => setShowScenario(!showScenario)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showScenario ? 'Hide' : 'Show Study Materials'}
          </button>
        </div>
        
        {showScenario && (
          <div className="space-y-4">
            {/* Scenario */}
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Usage Scenario</h4>
              <div 
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedScenario }}
              />
            </div>

            {/* Context */}
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Context & Explanation</h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {scenario.context}
              </div>
            </div>

            {/* Study Tips */}
            {scenario.studyTips && (
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Study Tips</h4>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {scenario.studyTips}
                </div>
              </div>
            )}

            {/* Practice Exercise */}
            {scenario.practiceExercise && (
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Practice Exercise</h4>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {scenario.practiceExercise}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
        {/* Back Button */}
        {onNavigate && (
          <button
            className="absolute -top-6 left-6 flex items-center text-green-600 hover:text-green-800 font-semibold focus:outline-none bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-md border border-green-100 transition-all hover:scale-105"
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        )}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-3 shadow-lg">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Smart Translation</h1>
            <p className="text-md text-gray-500 mt-1">Translate text and speech instantly</p>
          </div>
        </div>
        {/* Smart Translation UI (Text Only) */}
        <div className="mb-8 flex flex-col gap-6">
          {/* Language Selectors */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                value={sourceLang}
                onChange={e => setSourceLang(e.target.value)}
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 font-semibold text-green-700 shadow-sm"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={swapLanguages}
              className="mx-2 p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow hover:scale-110 transition-all border-2 border-white"
              title="Swap languages"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 font-semibold text-blue-700 shadow-sm"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Input Area (Text Only) */}
          <div className="bg-white/70 rounded-2xl p-6 shadow flex flex-col gap-4">
            <textarea
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="Type or paste text to translate..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent font-medium text-gray-800 bg-white/80"
            />
            <button
              onClick={() => translateText(sourceText)}
              disabled={isTranslating || !sourceText.trim()}
              className="self-end px-8 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:from-blue-500 hover:to-green-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {/* Translation Result */}
          {translatedText && (
            <div className="bg-gradient-to-br from-green-100/80 to-blue-100/80 rounded-2xl p-6 border border-blue-200 shadow-lg animate-fade-in mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-blue-700">Translation</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => speakText(translatedText, targetLang)}
                    className="p-2 bg-blue-200 hover:bg-blue-300 rounded-full shadow-sm transition-all"
                    title="Listen"
                  >
                    <Volume2 className="w-5 h-5 text-blue-700" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-blue-200 hover:bg-blue-300 rounded-full shadow-sm transition-all"
                    title="Copy"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-blue-700" />}
                  </button>
                </div>
              </div>
              <div className="text-gray-900 font-mono text-base whitespace-pre-wrap min-h-[40px] bg-white/60 rounded-lg p-3 border border-blue-50 shadow-inner">
                {translatedText}
              </div>
            </div>
          )}
          {/* Scenario/Study Materials */}
          {geminiScenario && renderScenario(geminiScenario)}
        </div>
      </div>
    </div>
  );
};

export default Translation;