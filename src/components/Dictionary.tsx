import React, { useState } from 'react';
import { BookOpen, Search, Volume2 } from 'lucide-react';
import { CurrentPage } from '../App';

// Add prop type
interface DictionaryProps {
  onNavigate?: (page: CurrentPage) => void;
}

const Dictionary: React.FC<DictionaryProps> = ({ onNavigate }) => {
  const [word, setWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchWord(word);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error('Word not found');
      const data = await res.json();
      setResult(data[0]);
    } catch (err: any) {
      setError('No definition found for this word.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8ff] via-[#f3f8ff] to-[#ffe8f8] flex flex-col items-center justify-start p-4">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mt-16 border border-white/60 relative">
        {/* Back Button */}
        {onNavigate && (
          <button
            className="absolute -top-6 left-6 flex items-center text-pink-600 hover:text-pink-800 font-semibold focus:outline-none bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-md border border-pink-100 transition-all hover:scale-105"
            onClick={() => onNavigate('dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        )}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-3 shadow-lg">
            <BookOpen className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Dictionary</h1>
            <p className="text-md text-gray-500 mt-1">Find word meanings, examples, and more</p>
          </div>
        </div>
        <form onSubmit={fetchDefinition} className="flex items-center mb-10 animate-fade-in">
          <input
            type="text"
            value={word}
            onChange={e => setWord(e.target.value)}
            placeholder="Enter a word..."
            className="flex-1 p-4 border border-pink-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg bg-white/80 font-semibold text-pink-700 shadow-sm"
          />
          <button
            type="submit"
            className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white rounded-r-xl transition-all font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-60"
            disabled={loading}
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        {loading && <div className="text-pink-500 mb-4 text-center font-semibold animate-fade-in">Searching...</div>}
        {error && <div className="text-red-500 mb-4 text-center font-semibold animate-fade-in">{error}</div>}
        {result && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl font-bold text-purple-700">{result.word}</span>
              {result.phonetics && result.phonetics[0]?.audio && (
                <button
                  onClick={() => playAudio(result.phonetics[0].audio)}
                  className="ml-2 p-2 bg-purple-100 hover:bg-purple-200 rounded-full shadow-sm transition-all"
                  title="Play pronunciation"
                >
                  <Volume2 className="w-5 h-5 text-purple-600" />
                </button>
              )}
              {result.phonetic && (
                <span className="text-lg text-gray-500 ml-2">/{result.phonetic}/</span>
              )}
            </div>
            {result.meanings && result.meanings.map((meaning: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 rounded-2xl p-6 border border-pink-200 mb-2 shadow-lg animate-fade-in">
                <div className="flex items-center mb-2">
                  <span className="text-md font-semibold text-purple-700 mr-2">{meaning.partOfSpeech}</span>
                </div>
                {meaning.definitions && meaning.definitions.map((def: any, i: number) => (
                  <div key={i} className="mb-3">
                    <div className="text-gray-800 text-lg font-mono">{i + 1}. {def.definition}</div>
                    {def.example && (
                      <div className="text-gray-500 text-sm mt-1">Example: <span className="italic">{def.example}</span></div>
                    )}
                  </div>
                ))}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Synonyms:</span> {meaning.synonyms.join(', ')}
                  </div>
                )}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Antonyms:</span> {meaning.antonyms.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary; 