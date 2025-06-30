import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Upload, FileText, Languages, Volume2, Copy, Check } from 'lucide-react';
import { CurrentPage } from '../App';
import { VisualLearningService, ExtractedText } from '../lib/visualLearningService';
import { TranslationService } from '../lib/translationService';

interface VisualLearningProps {
  onNavigate: (page: CurrentPage) => void;
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

const speak = (text: string, lang: string) => {
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = lang;
  window.speechSynthesis.speak(utter);
};

const VisualLearning: React.FC<VisualLearningProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'liveocr'>('image');
  const [liveOcrText, setLiveOcrText] = useState<string>('');
  const [liveOcrTranslation, setLiveOcrTranslation] = useState<string>('');
  const [isLiveOcrProcessing, setIsLiveOcrProcessing] = useState(false);
  const [liveOcrError, setLiveOcrError] = useState<string | null>(null);
  const [liveOcrTargetLanguage, setLiveOcrTargetLanguage] = useState('es');
  const liveOcrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Webcam setup for live OCR
  useEffect(() => {
    if (activeTab !== 'liveocr') return;
    let stream: MediaStream;
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setLiveOcrError('Could not access camera.');
      }
    };
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  // Live Video to Text OCR effect
  useEffect(() => {
    if (activeTab !== 'liveocr') return;
    let interval: NodeJS.Timeout;
    setLiveOcrError(null);
    setLiveOcrText('');
    setLiveOcrTranslation('');
    setIsLiveOcrProcessing(false);
      interval = setInterval(async () => {
      if (videoRef.current && liveOcrCanvasRef.current) {
        const width = 320;
        const height = 180;
        liveOcrCanvasRef.current.width = width;
        liveOcrCanvasRef.current.height = height;
        const ctx = liveOcrCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, width, height);
          const dataUrl = liveOcrCanvasRef.current.toDataURL('image/png');
          setIsLiveOcrProcessing(true);
          try {
            // Use Vision API to extract text from base64 image
            const base64 = dataUrl.split(',')[1];
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
            setLiveOcrText(detected);
            if (detected.trim()) {
              try {
                const translation = await TranslationService.translateText(detected, liveOcrTargetLanguage, 'auto');
                setLiveOcrTranslation(translation.translatedText);
              } catch (err) {
                setLiveOcrTranslation('Translation failed');
              }
                } else {
              setLiveOcrTranslation('');
                }
            setIsLiveOcrProcessing(false);
          } catch (err) {
            setLiveOcrError('Live OCR failed.');
            setIsLiveOcrProcessing(false);
            }
          }
        }
      }, 2000);
    return () => clearInterval(interval);
  }, [activeTab, liveOcrTargetLanguage]);

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        VisualLearningService.validateImageFile(file);
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setExtractedTexts([]);
        setTranslatedTexts([]);
      } catch (error) {
        setExtractedTexts([]);
        setTranslatedTexts([]);
      }
    }
  };

  // Process image for text extraction and translation
  const processImage = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    try {
      // Only use Vision API for text detection (no object recognition)
      const result = await VisualLearningService.processImageForTranslation(
        selectedImage,
        targetLanguage,
        'auto'
      );
      setExtractedTexts(result.extractedTexts);
      setTranslatedTexts(result.translations.map(t => ({ [targetLanguage]: t.translatedText })));
    } catch (error) {
      setExtractedTexts([]);
      setTranslatedTexts([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
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
            <Languages className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Visual Learning</h1>
            <p className="text-md text-gray-500 mt-1">Learn languages through images and live video text</p>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'image'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Image Text Extraction
            </button>
            <button
              onClick={() => setActiveTab('liveocr')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'liveocr'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Languages className="w-4 h-4 inline mr-2" />
              Live Video to Text
            </button>
          </div>

          {activeTab === 'image' ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Extract & Translate Text from Images</h3>
              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Translate to:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Image Upload */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {!imagePreview ? (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload an image containing text</p>
                      <p className="text-sm text-gray-500 mb-4">Supports: JPEG, PNG, GIF, BMP (max 10MB)</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Choose Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg mb-4"
                      />
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? 'Processing...' : 'Extract & Translate Text'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Results */}
              {extractedTexts.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Extracted Text & Translations</h4>
                  {extractedTexts.map((extractedText, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Original Text:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => speak(extractedText.text, 'en')}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            <Volume2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(extractedText.text)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-3">{extractedText.text}</p>
                      {translatedTexts[index] && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-purple-700">
                              {LANGUAGES.find(l => l.code === targetLanguage)?.flag} Translation:
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => speak(translatedTexts[index][targetLanguage], targetLanguage)}
                                className="p-1 bg-purple-100 hover:bg-purple-200 rounded"
                              >
                                <Volume2 className="w-4 h-4 text-purple-600" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(translatedTexts[index][targetLanguage])}
                                className="p-1 bg-purple-100 hover:bg-purple-200 rounded"
                              >
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
                              </button>
                            </div>
                          </div>
                          <p className="text-purple-800">{translatedTexts[index][targetLanguage]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Video to Text (OCR)</h3>
              <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
                  width={320}
                  height={180}
                  className="rounded-lg border border-purple-200 shadow"
                  style={{ objectFit: 'cover' }}
                />
                <canvas ref={liveOcrCanvasRef} style={{ display: 'none' }} />
              </div>
              <div className="mb-4 w-full max-w-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Translate to:</label>
                <select
                  value={liveOcrTargetLanguage}
                  onChange={e => setLiveOcrTargetLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>
                  ))}
                </select>
              </div>
              {liveOcrError && <div className="mb-2 text-red-600">{liveOcrError}</div>}
              <div className="w-full max-w-lg bg-white rounded-lg p-4 border border-gray-200 mb-2">
                <div className="text-xs text-gray-500 mb-1">Detected Text:</div>
                <div className="text-gray-800 whitespace-pre-wrap min-h-[40px]">{liveOcrText || <span className="text-gray-400">No text detected yet.</span>}</div>
                  </div>
              <div className="w-full max-w-lg bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-xs text-purple-700 mb-1">Translation:</div>
                <div className="text-purple-800 whitespace-pre-wrap min-h-[40px]">{liveOcrTranslation || <span className="text-gray-400">No translation yet.</span>}</div>
                {isLiveOcrProcessing && <div className="text-xs text-purple-400 mt-2">Processing...</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualLearning; 