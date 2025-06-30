import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

interface ThreeDGameProps {
  onClose: () => void;
}

const ThreeDGame: React.FC<ThreeDGameProps> = ({ onClose }) => {
  const [showSpeech, setShowSpeech] = useState(false);
  const [npcReply, setNpcReply] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Voice input logic
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
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsLoading(true);
      setError(null);
      // Call AI conversation API
      try {
        const response = await fetch('https://dopeer.app.n8n.cloud/webhook-test/d2ef0176-568f-4f86-8e48-e5cdbc2c07aa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript }),
        });
        let reply = 'No response received.';
        if (response.ok) {
          const data = await response.json();
          reply = data.solution || reply;
          setNpcReply(reply);
          speak(reply);
        } else {
          const errorText = await response.text();
          setError(`API Error: ${response.status} - ${errorText}`);
          setNpcReply('Sorry, I encountered an error. Please try again.');
        }
      } catch (error: any) {
        setError(error?.message || 'Unknown error');
        setNpcReply('Sorry, I encountered an error. Please try again.');
      } finally {
        setIsLoading(false);
        setIsListening(false);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative border border-white/60">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={onClose}>
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-4 text-green-700">3D NPC Conversation Game</h2>
        <p className="mb-6 text-gray-600">Click the NPC to talk. Speak to the NPC and get an AI-powered reply!</p>
        <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden mb-6">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            {/* Ground */}
            <mesh position={[0, -1, 0]} receiveShadow>
              <boxGeometry args={[20, 1, 20]} />
              <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            {/* NPC (simple sphere) */}
            <mesh
              position={[0, 0, 0]}
              onClick={() => setShowSpeech(true)}
              castShadow
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 7.5]} intensity={1} />
          </Canvas>
        </div>
        {showSpeech && (
          <div className="flex flex-col items-center mb-4">
            <div className="bg-white border border-green-300 rounded-2xl px-6 py-4 shadow mb-2 max-w-lg text-center">
              {npcReply || 'Say something to the NPC!'}
            </div>
            {isLoading && <div className="text-gray-400 mb-2">AI is thinking...</div>}
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <button
              className={`px-6 py-2 rounded-xl font-semibold shadow transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
            >
              {isListening ? 'Stop Listening' : 'Speak'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDGame; 