import React, { useState, useRef, useEffect } from 'react';
import LanguageGameSimulation from './LanguageGameSimulation';
import ThreeDGame from './ThreeDGame';
import AIStoryAdventure from './AIStoryAdventure';
import LanguageQuizShow from './LanguageQuizShow';
import DuolingoGame from './DuolingoGame';

interface PlaygroundProps {
  onQuit?: () => void;
}

interface Puzzle {
  sentence: string;
  answer: string;
  options: string[];
}

interface LanguagePuzzles {
  [key: string]: Puzzle[];
}

const languagePuzzles: LanguagePuzzles = {
  english: [
    { sentence: "I ___ to school every day.", answer: "go", options: ["go", "went", "gone", "going"] },
    { sentence: "She is ___ a book.", answer: "reading", options: ["read", "reads", "reading", "readed"] },
    { sentence: "They ___ dinner at 7 PM.", answer: "have", options: ["have", "has", "having", "had"] },
    { sentence: "The sun ___ in the east.", answer: "rises", options: ["rise", "rises", "rising", "rose"] },
    { sentence: "We ___ to the beach last weekend.", answer: "went", options: ["go", "went", "gone", "going"] },
    { sentence: "He ___ his homework before dinner.", answer: "finished", options: ["finish", "finishes", "finished", "finishing"] }
  ],
  spanish: [
    { sentence: "Yo ___ español.", answer: "hablo", options: ["hablo", "hablas", "habla", "hablan"] },
    { sentence: "Ella ___ en Madrid.", answer: "vive", options: ["vivo", "vives", "vive", "viven"] },
    { sentence: "Nosotros ___ la comida.", answer: "comemos", options: ["como", "comes", "come", "comemos"] },
    { sentence: "Ellos ___ al parque.", answer: "van", options: ["voy", "vas", "va", "van"] },
    { sentence: "Tú ___ un libro.", answer: "lees", options: ["leo", "lees", "lee", "leen"] },
    { sentence: "La película ___ a las 8.", answer: "empieza", options: ["empiezo", "empiezas", "empieza", "empiezan"] }
  ],
  french: [
    { sentence: "Je ___ français.", answer: "parle", options: ["parle", "parles", "parle", "parlent"] },
    { sentence: "Elle ___ à Paris.", answer: "habite", options: ["habite", "habites", "habite", "habitent"] },
    { sentence: "Nous ___ le dîner.", answer: "mangeons", options: ["mange", "manges", "mange", "mangeons"] },
    { sentence: "Ils ___ au cinéma.", answer: "vont", options: ["vais", "vas", "va", "vont"] },
    { sentence: "Tu ___ un livre.", answer: "lis", options: ["lis", "lis", "lit", "lisent"] },
    { sentence: "Le film ___ à 20h.", answer: "commence", options: ["commence", "commences", "commence", "commencent"] }
  ],
  german: [
    { sentence: "Ich ___ Deutsch.", answer: "spreche", options: ["spreche", "sprichst", "spricht", "sprechen"] },
    { sentence: "Sie ___ in Berlin.", answer: "wohnt", options: ["wohne", "wohnst", "wohnt", "wohnen"] },
    { sentence: "Wir ___ das Abendessen.", answer: "essen", options: ["esse", "isst", "isst", "essen"] },
    { sentence: "Sie ___ ins Kino.", answer: "gehen", options: ["gehe", "gehst", "geht", "gehen"] },
    { sentence: "Du ___ ein Buch.", answer: "liest", options: ["lese", "liest", "liest", "lesen"] },
    { sentence: "Der Film ___ um 20 Uhr.", answer: "beginnt", options: ["beginne", "beginnst", "beginnt", "beginnen"] }
  ],
  chinese: [
    { sentence: "我 ___ 中文。", answer: "说", options: ["说", "说", "说", "说"] },
    { sentence: "她 ___ 在北京。", answer: "住", options: ["住", "住", "住", "住"] },
    { sentence: "我们 ___ 晚饭。", answer: "吃", options: ["吃", "吃", "吃", "吃"] },
    { sentence: "他们 ___ 去公园。", answer: "要", options: ["要", "要", "要", "要"] },
    { sentence: "你 ___ 一本书。", answer: "读", options: ["读", "读", "读", "读"] },
    { sentence: "电影 ___ 八点开始。", answer: "在", options: ["在", "在", "在", "在"] }
  ]
};

const languages = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'french', name: 'Français', flag: '🇫🇷' },
  { code: 'german', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'chinese', name: '中文', flag: '🇨🇳' }
];

// Add a new state to control showing the simulation
type PlaygroundState = {
  showLanguageGame: boolean;
};

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
  { code: 'ko', name: '한국어' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pl', name: 'Polski' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'uk', name: 'Українська' },
  { code: 'fa', name: 'فارسی' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
];

const Playground: React.FC<PlaygroundProps> = ({ onQuit }) => {
  const [openGame, setOpenGame] = useState<null | 'language' | 'other' | '3d' | 'story' | 'quiz' | 'duo'>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState("");
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PlaygroundState>({ showLanguageGame: false });
  const [showSettings, setShowSettings] = useState(false);
  const [knownLang, setKnownLang] = useState<string>(() => localStorage.getItem('knownLang') || 'es');
  const [learnLang, setLearnLang] = useState<string>(() => localStorage.getItem('learnLang') || 'en');

  useEffect(() => {
    localStorage.setItem('knownLang', knownLang);
    localStorage.setItem('learnLang', learnLang);
  }, [knownLang, learnLang]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setCurrent(0);
    setResult("");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string) => {
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!selectedLanguage) return;
    
    const word = e.dataTransfer.getData("text/plain");
    const answer = languagePuzzles[selectedLanguage][current].answer;
    if (word === answer) {
      if (dropZoneRef.current) dropZoneRef.current.textContent = word;
      setResult("✅ Correct!");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % languagePuzzles[selectedLanguage].length);
        setResult("");
        if (dropZoneRef.current) dropZoneRef.current.textContent = "Drop the correct word here";
      }, 1000);
    } else {
      setResult("❌ Try again!");
    }
  };

  const handleQuit = () => {
    if (onQuit) {
      onQuit();
    } else {
      window.location.reload();
    }
  };

  const handleBackToLanguageSelect = () => {
    setSelectedLanguage(null);
    setCurrent(0);
    setResult("");
  };

  // Game screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] p-8">
      <div className="flex w-full max-w-5xl justify-between items-center mb-6">
        {/* Back Button */}
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold shadow mr-4"
          onClick={() => {
            if (onQuit) {
              onQuit();
            } else {
              window.history.back();
            }
          }}
        >
          ← Back
        </button>
        <h1 className="text-5xl font-extrabold text-purple-700 animate-fade-in flex-1 text-center">Playground</h1>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold shadow ml-4" onClick={() => setShowSettings(true)}>
          ⚙️ Settings
        </button>
      </div>
      <div className="mb-6 text-lg text-gray-700 font-medium">
        Your language: <span className="font-bold">{languageOptions.find(l => l.code === knownLang)?.name}</span> → Learning: <span className="font-bold">{languageOptions.find(l => l.code === learnLang)?.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Card 1: Language Simulation Game */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-400 p-10 flex flex-col items-center hover:scale-105 transition cursor-pointer animate-pop" onClick={() => setOpenGame('language')}>
          <span className="text-5xl mb-4">🗣️</span>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Language Simulation Game</h2>
          <p className="text-gray-600 mb-4 text-center">Practice real-world conversations using your voice and AI responses. Improve your speaking and listening skills in a fun, interactive way!</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-purple-700">Start Game</button>
        </div>
        {/* Card 2: 3D NPC Conversation Game */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-400 p-10 flex flex-col items-center hover:scale-105 transition cursor-pointer animate-pop" onClick={() => setOpenGame('3d')}>
          <span className="text-5xl mb-4">��</span>
          <h2 className="text-2xl font-bold text-green-700 mb-2">3D NPC Conversation Game</h2>
          <p className="text-gray-600 mb-4 text-center">Talk to NPCs in a 3D world and get AI-powered replies, just like open-world games!</p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700">Start Game</button>
        </div>
        {/* Card 3: AI Story Adventure */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-pink-400 p-10 flex flex-col items-center hover:scale-105 transition cursor-pointer animate-pop" onClick={() => setOpenGame('story')}>
          <span className="text-5xl mb-4">📖</span>
          <h2 className="text-2xl font-bold text-pink-700 mb-2">AI Story Adventure</h2>
          <p className="text-gray-600 mb-4 text-center">Go on an interactive story journey. Make choices, talk to characters, and shape your adventure with AI!</p>
          <button className="bg-pink-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-pink-700">Start Game</button>
        </div>
        {/* Card 4: Language Quiz Show */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-400 p-10 flex flex-col items-center hover:scale-105 transition cursor-pointer animate-pop" onClick={() => setOpenGame('quiz')}>
          <span className="text-5xl mb-4">🎯</span>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Language Quiz Show</h2>
          <p className="text-gray-600 mb-4 text-center">Test your language skills in a fast-paced quiz show. Compete for the high score!</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700">Start Game</button>
        </div>
        {/* Card 5: Duolingo-Style Game */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-yellow-400 p-10 flex flex-col items-center hover:scale-105 transition cursor-pointer animate-pop" onClick={() => setOpenGame('duo')}>
          <span className="text-5xl mb-4">��</span>
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">Duolingo-Style Game</h2>
          <p className="text-gray-600 mb-4 text-center">Learn languages with fun, gamified lessons and exercises. Earn XP, keep your streak, and master new words!</p>
          <button className="bg-yellow-400 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-yellow-500">Start Game</button>
        </div>
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border-4 border-purple-300 flex flex-col items-center">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={() => setShowSettings(false)}>×</button>
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Language Settings</h2>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold">Your language:</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-300" value={knownLang} onChange={e => setKnownLang(e.target.value)}>
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 font-semibold">Language to learn:</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-300" value={learnLang} onChange={e => setLearnLang(e.target.value)}>
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-purple-700" onClick={() => setShowSettings(false)}>Save</button>
          </div>
        </div>
      )}
      {/* Modals for games */}
      {openGame === 'language' && (
        <LanguageGameSimulation onClose={() => setOpenGame(null)} />
      )}
      {openGame === '3d' && (
        <ThreeDGame onClose={() => setOpenGame(null)} />
      )}
      {openGame === 'story' && (
        <AIStoryAdventure onClose={() => setOpenGame(null)} />
      )}
      {openGame === 'quiz' && (
        <LanguageQuizShow onClose={() => setOpenGame(null)} />
      )}
      {openGame === 'duo' && (
        <DuolingoGame onClose={() => setOpenGame(null)} />
      )}
    </div>
  );
};

export default Playground; 