import React, { useRef, useState } from 'react';
import { Upload, FileText, Check, Copy, Volume2, Languages } from 'lucide-react';
import { TranslationService } from '../lib/translationService';
import { CurrentPage } from '../App';

interface TextFromImageProps {
  onNavigate?: (page: CurrentPage) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
];

const TextFromImage: React.FC<TextFromImageProps> = ({ onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExtractedText('');
      setTranslatedText('');
      setError(null);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setExtractedText('');
    setTranslatedText('');
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCuzGloBEG2vf8v3r5aPDGB3mPAoloy5Zk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64 },
                features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
              }
            ]
          })
        });
        const data = await response.json();
        let detected = '';
        if (data.responses && data.responses[0] && data.responses[0].textAnnotations && data.responses[0].textAnnotations[0]) {
          detected = data.responses[0].textAnnotations[0].description;
        }
        setExtractedText(detected);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError('Failed to process image.');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const speak = (text: string) => {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };

  const handleTranslate = async () => {
    if (!extractedText.trim()) return;
    setIsTranslating(true);
    setTranslatedText('');
    try {
      const result = await TranslationService.translateText(extractedText, targetLanguage, undefined);
      setTranslatedText(result.translatedText);
    } catch (err) {
      setTranslatedText('Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
        {/* Back Button */}
        {onNavigate && (
          <button
            className="absolute -top-6 left-6 flex items-center text-purple-600 hover:text-purple-800 font-semibold focus:outline-none bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-md border border-purple-100 transition-all hover:scale-105"
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        )}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 shadow-lg">
            <FileText className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Text from Image</h1>
            <p className="text-md text-gray-500 mt-1">Extract and translate text from your images instantly</p>
          </div>
        </div>
        <div className="mb-10">
          <div className="border-2 border-dashed border-purple-200 rounded-2xl p-10 text-center bg-white/60 hover:bg-white/80 transition-all duration-200 shadow-inner relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {!imagePreview ? (
              <div>
                <div className="flex flex-col items-center justify-center mb-4 animate-fade-in">
                  <Upload className="w-14 h-14 text-purple-300 mb-2" />
                  <span className="text-lg font-medium text-purple-700">Upload an image to extract text</span>
                  <span className="text-sm text-gray-400 mt-1">Supports: JPEG, PNG, GIF, BMP (max 10MB)</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  Choose Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-2xl mb-6 shadow-lg border border-purple-100"
                />
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                >
                  {isProcessing ? 'Processing...' : 'Extract Text'}
                </button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="text-red-500 mb-4 text-center font-semibold animate-fade-in">{error}</div>}
        {extractedText && (
          <div className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 rounded-2xl p-6 border border-purple-200 mb-4 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-purple-700">Extracted Text</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => speak(extractedText)}
                  className="p-2 bg-purple-200 hover:bg-purple-300 rounded-full shadow-sm transition-all"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5 text-purple-700" />
                </button>
                <button
                  onClick={() => copyToClipboard(extractedText)}
                  className="p-2 bg-purple-200 hover:bg-purple-300 rounded-full shadow-sm transition-all"
                  title="Copy"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-purple-700" />}
                </button>
              </div>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap min-h-[40px] font-mono text-base bg-white/60 rounded-lg p-3 border border-purple-50 shadow-inner">
              {extractedText}
            </div>
            {/* Translation Section */}
            <div className="mt-8">
              <div className="flex items-center mb-2">
                <Languages className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-md font-semibold text-purple-700">Translate Extracted Text</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center mb-4 gap-2">
                <select
                  value={targetLanguage}
                  onChange={e => setTargetLanguage(e.target.value)}
                  className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 font-semibold text-purple-700 shadow-sm"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="md:ml-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </button>
              </div>
              {translatedText && (
                <div className="bg-white/70 border border-purple-100 rounded-lg p-4 shadow-inner animate-fade-in">
                  <span className="block text-purple-700 font-semibold mb-2">Translation</span>
                  <div className="text-gray-900 font-mono text-base whitespace-pre-wrap">{translatedText}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextFromImage; 