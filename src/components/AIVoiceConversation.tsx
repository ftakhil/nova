import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bot, User, Mic, Square, Pause, Play } from 'lucide-react';
import { CurrentPage } from '../App';

interface AIVoiceConversationProps {
  onNavigate: (page: CurrentPage) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'ur-PK', label: 'Urdu' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'ru-RU', label: 'Russian' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  // Add more as needed
];

const AIVoiceConversation: React.FC<AIVoiceConversationProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm your AI language partner. Tap the mic and speak to start a voice conversation.",
    sender: 'ai',
    timestamp: new Date(),
  }]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Request microphone permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
  }, []);

  // Start voice recognition
  const startRecording = async () => {
    setTranscript('');
    setIsRecording(true);
    setRecordingTime(0);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      setIsRecording(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang || '';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    recognition.start(); // Start recognition immediately for minimal delay
    let detectedLang: string | null = null;
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      // Auto-detect language if not selected
      if (!selectedLang && finalTranscript) {
        // Simple detection by Unicode range
        if (/[\u0D00-\u0D7F]/.test(finalTranscript)) detectedLang = 'ml-IN';
        else if (/[\u0900-\u097F]/.test(finalTranscript)) detectedLang = 'hi-IN';
        else if (/[\u0B80-\u0BFF]/.test(finalTranscript)) detectedLang = 'ta-IN';
        else if (/[\u0980-\u09FF]/.test(finalTranscript)) detectedLang = 'bn-IN';
        else if (/[\u0A80-\u0AFF]/.test(finalTranscript)) detectedLang = 'gu-IN';
        else if (/[\u0C80-\u0CFF]/.test(finalTranscript)) detectedLang = 'kn-IN';
        else if (/[\u0C00-\u0C7F]/.test(finalTranscript)) detectedLang = 'te-IN';
        else if (/[\u0900-\u097F]/.test(finalTranscript)) detectedLang = 'mr-IN';
        else if (/[\u0A00-\u0A7F]/.test(finalTranscript)) detectedLang = 'pa-IN';
        else if (/[\u0600-\u06FF]/.test(finalTranscript)) detectedLang = 'ur-PK';
        else if (/[\u0600-\u06FF]/.test(finalTranscript)) detectedLang = 'ar-SA';
        else if (/[\u0400-\u04FF]/.test(finalTranscript)) detectedLang = 'ru-RU';
        else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(finalTranscript)) detectedLang = 'ja-JP';
        else if (/[\uAC00-\uD7AF]/.test(finalTranscript)) detectedLang = 'ko-KR';
        else if (/[\u4E00-\u9FFF]/.test(finalTranscript)) detectedLang = 'zh-CN';
        else if (/[a-zA-Z]/.test(finalTranscript)) detectedLang = 'en-US';
        else detectedLang = 'en-US';
      }
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (transcript.trim()) {
        // Use detected language for speech if not selected
        if (!selectedLang && detectedLang) {
          setSelectedLang(detectedLang);
        }
        sendMessage(transcript.trim());
      }
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    // Audio level animation and stream setup can run in parallel
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      animateMic();
    } catch (e) {
      // ignore
    }
  };

  // Animate mic based on audio frequency
  const animateMic = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const getLevel = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setAudioLevel(avg);
      rafIdRef.current = requestAnimationFrame(getLevel);
    };
    getLevel();
  };

  // Stop voice recognition
  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setAudioLevel(0);
  };

  // Send message to AI
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await fetch('https://dopeer.app.n8n.cloud/webhook/d2ef0176-568f-4f86-8e48-e5cdbc2c07aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.solution || 'No response received.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      speak(aiMessage.text);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setTranscript('');
    }
  };

  // Enhanced text-to-speech for code-mixed messages
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    // Remove emojis from the text
    const textWithoutEmojis = text.replace(/[\p{Emoji_Presentation}\p{Emoji}\u200d]+/gu, '');
    // Simple language detection by Unicode range
    const detectLang = (word: string) => {
      // Malayalam: 0D00–0D7F, Hindi (Devanagari): 0900–097F, English: a-zA-Z
      if (/[\u0D00-\u0D7F]/.test(word)) return 'ml-IN';
      if (/[\u0900-\u097F]/.test(word)) return 'hi-IN';
      if (/^[a-zA-Z0-9.,?!'"\s]+$/.test(word)) return 'en-US';
      return selectedLang || 'en-US'; // fallback
    };
    // Split text into segments by language
    const segments: { text: string; lang: string }[] = [];
    let current = '';
    let currentLang = detectLang(textWithoutEmojis[0] || '');
    for (let i = 0; i < textWithoutEmojis.length; i++) {
      const char = textWithoutEmojis[i];
      const lang = detectLang(char);
      if (lang !== currentLang && current) {
        segments.push({ text: current, lang: currentLang });
        current = char;
        currentLang = lang;
      } else {
        current += char;
      }
    }
    if (current) segments.push({ text: current, lang: currentLang });

    // Helper to pick the best matching voice
    const pickVoice = (lang: string) => {
      const voices = window.speechSynthesis.getVoices();
      let match = voices.find(v => v.lang === lang);
      if (!match) {
        const baseLang = lang.split('-')[0];
        match = voices.find(v => v.lang.startsWith(baseLang));
      }
      return match || voices[0];
    };

    // Speak each segment in order
    let idx = 0;
    const speakNext = () => {
      if (idx >= segments.length) return;
      const seg = segments[idx];
      const utter = new window.SpeechSynthesisUtterance(seg.text);
      utter.lang = seg.lang;
      utter.voice = pickVoice(seg.lang);
      utter.onend = () => {
        idx++;
        speakNext();
      };
      window.speechSynthesis.speak(utter);
    };

    // Wait for voices to load if needed
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => speakNext();
    } else {
      speakNext();
    }
  };

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
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
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-3 shadow-lg">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">AI Voice Conversation</h1>
            <p className="text-md text-gray-500 mt-1">Practice speaking with your AI partner</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full ${message.sender === 'ai' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                {message.sender === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
              </div>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${message.sender === 'ai' ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'}`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'ai' ? 'text-gray-500' : 'text-blue-100'}`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-4">
            <select
              value={selectedLang || ''}
              onChange={e => setSelectedLang(e.target.value || null)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRecording}
            >
              <option value="">Auto Detect</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <div className="text-gray-600 text-sm">Language</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isRecording ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50'
                }`}
                style={{ boxShadow: isRecording ? `0 0 ${10 + audioLevel * 0.5}px 2px #3b82f6` : undefined }}
              >
                {/* Mic Animation */}
                {isRecording ? (
                  <Mic className="w-12 h-12 text-blue-500 animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12 text-gray-600" />
                )}
              </div>
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold"
                >
                  Stop
                </button>
              )}
            </div>
            <div className="text-center mt-2">
              {isRecording && <span className="text-blue-600 font-medium animate-pulse">Listening...</span>}
              {!isRecording && <span className="text-gray-600">Tap the mic to speak</span>}
            </div>
            {transcript && (
              <div className="mt-2 flex flex-col items-center">
                <div className="px-4 py-2 bg-gray-100 rounded-xl text-gray-800 text-sm max-w-xs">{transcript}</div>
                <button
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                  onClick={() => sendMessage(transcript)}
                  disabled={isLoading || !transcript.trim()}
                >
                  Send
                </button>
              </div>
            )}
            <div className="mt-2">
              {!isRecording && (
                <button
                  onClick={startRecording}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </button>
              )}
            </div>
            {isRecording && (
              <div className="text-2xl font-mono font-bold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-md mt-2">
                {`${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceConversation; 