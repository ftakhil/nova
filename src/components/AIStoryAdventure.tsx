import React, { useState, useRef } from 'react';

interface AIStoryAdventureProps {
  onClose: () => void;
}

const initialStory = {
  background: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  character: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png',
  prompt: 'You find yourself in a magical forest. A wise old owl greets you: "Welcome, traveler! What brings you here?"',
};

const AIStoryAdventure: React.FC<AIStoryAdventureProps> = ({ onClose }) => {
  const [story, setStory] = useState(initialStory);
  const [messages, setMessages] = useState([
    { from: 'npc', text: initialStory.prompt }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setMessages(prev => [...prev, { from: 'user', text }]);
    try {
      const response = await fetch('https://dopeer.app.n8n.cloud/webhook-test/d2ef0176-568f-4f86-8e48-e5cdbc2c07aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      let reply = 'No response received.';
      if (response.ok) {
        const data = await response.json();
        reply = data.solution || reply;
        setMessages(prev => [...prev, { from: 'npc', text: reply }]);
        speak(reply);
      } else {
        const errorText = await response.text();
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      setError(error?.message || 'Unknown error');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative border border-white/60 flex flex-col items-center" style={{ backgroundImage: `url(${story.background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={onClose}>×</button>
        <img src={story.character} alt="Character" className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4" />
        <div className="w-full max-w-lg bg-white/80 rounded-2xl p-6 mb-4 shadow flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-md text-base ${msg.from === 'npc' ? 'bg-green-100 text-gray-800' : 'bg-blue-600 text-white'}`}>{msg.text}</div>
            </div>
          ))}
          {isLoading && <div className="text-gray-400">AI is thinking...</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <div className="flex gap-2 w-full max-w-lg">
          <input
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Say something or make a choice..."
            disabled={isLoading}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-700" onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}>Send</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-700" onClick={startListening} disabled={isLoading}>🎤</button>
        </div>
      </div>
    </div>
  );
};

export default AIStoryAdventure; 