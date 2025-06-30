import React, { useState, useRef } from 'react';

interface LanguageGameSimulationProps {
  onClose: () => void;
}

const defaultScenario = {
  title: 'Ordering at a Restaurant',
  systemPrompt: 'You are a waiter at a restaurant. Greet the customer and take their order in the target language.',
  initialMessage: 'Welcome to our restaurant! How can I help you today?'
};

interface Message {
  from: 'user' | 'system';
  text: string;
}

const LanguageGameSimulation: React.FC<LanguageGameSimulationProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'system', text: defaultScenario.initialMessage }
  ]);
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Start speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // TODO: Make dynamic
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessages((prev) => [...prev, { from: 'user', text: transcript }]);
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
          setMessages((prev) => [...prev, { from: 'system', text: reply }]);
          speak(reply);
        } else {
          const errorText = await response.text();
          setError(`API Error: ${response.status} - ${errorText}`);
          setMessages((prev) => [...prev, { from: 'system', text: 'Sorry, I encountered an error. Please try again.' }]);
        }
      } catch (error: any) {
        setError(error?.message || 'Unknown error');
        setMessages((prev) => [...prev, { from: 'system', text: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
    recognitionRef.current = recognition;
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Speak system reply
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // TODO: Make dynamic
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative border border-white/60">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={onClose}>
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">{defaultScenario.title}</h2>
        <p className="mb-6 text-gray-600">{defaultScenario.systemPrompt}</p>
        <div className="h-64 overflow-y-auto border rounded-2xl p-4 mb-6 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-md text-base ${msg.from === 'system' ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-400 px-4 py-3 rounded-2xl shadow-md">AI is thinking...</div>
            </div>
          )}
        </div>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <div className="flex items-center gap-2 justify-center">
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-all ${listening ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            onClick={listening ? stopListening : startListening}
            disabled={isLoading}
          >
            {listening ? 'Stop Listening' : 'Speak'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageGameSimulation; 