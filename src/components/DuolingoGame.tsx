import React, { useState } from 'react';

interface DuolingoGameProps {
  onClose: () => void;
}

// Sample lessons and exercises
const lessons = [
  {
    title: 'Básicos 1',
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Cuál es la palabra en inglés para "gato"?',
        options: ['cat', 'dog', 'bird', 'fish'],
        answer: 'cat',
      },
      {
        type: 'fill-blank',
        question: 'I ___ an apple. (Yo como una manzana.)',
        answer: 'eat',
      },
      {
        type: 'match',
        question: 'Empareja las palabras',
        pairs: [
          { es: 'perro', en: 'dog' },
          { es: 'manzana', en: 'apple' },
        ],
      },
      {
        type: 'listen-type',
        question: 'Escribe lo que escuchas ("Hello")',
        audio: 'Hello',
        answer: 'Hello',
      },
      {
        type: 'speak-repeat',
        question: 'Di "Good morning"',
        answer: 'Good morning',
      },
    ],
  },
];

const DuolingoGame: React.FC<DuolingoGameProps> = ({ onClose }) => {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lesson = lessons[lessonIdx];
  const exercise = lesson.exercises[exerciseIdx];

  // Handle answer submission
  const handleSubmit = (answer: string) => {
    if (exercise.type === 'multiple-choice') {
      setSelected(answer);
      if (answer === exercise.answer) {
        setXp(xp + 10);
        setFeedback('Correct! +10 XP');
        setTimeout(nextExercise, 1200);
      } else {
        setFeedback('Try again!');
      }
    } else if (exercise.type === 'fill-blank') {
      if (input.trim().toLowerCase() === exercise.answer.toLowerCase()) {
        setXp(xp + 10);
        setFeedback('Correct! +10 XP');
        setTimeout(nextExercise, 1200);
      } else {
        setFeedback('Try again!');
      }
    } else if (exercise.type === 'match') {
      const allMatched = exercise.pairs.every(pair => matches[pair.es] === pair.en);
      if (allMatched) {
        setXp(xp + 10);
        setFeedback('Correct! +10 XP');
        setTimeout(nextExercise, 1200);
      } else {
        setFeedback('Match all pairs correctly!');
      }
    } else if (exercise.type === 'listen-type') {
      if (input.trim() === exercise.answer) {
        setXp(xp + 10);
        setFeedback('Correct! +10 XP');
        setTimeout(nextExercise, 1200);
      } else {
        setFeedback('Try again!');
      }
    } else if (exercise.type === 'speak-repeat') {
      setListening(true);
      setIsLoading(true);
      if (!('webkitSpeechRecognition' in window)) {
        setFeedback('Speech Recognition not supported.');
        setListening(false);
        setIsLoading(false);
        return;
      }
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim().toLowerCase() === exercise.answer.toLowerCase()) {
          setXp(xp + 10);
          setFeedback('Correct! +10 XP');
          setTimeout(nextExercise, 1200);
        } else {
          setFeedback('Try again!');
        }
        setListening(false);
        setIsLoading(false);
      };
      recognition.onend = () => {
        setListening(false);
        setIsLoading(false);
      };
      recognition.start();
    }
  };

  // Next exercise or lesson
  const nextExercise = () => {
    setFeedback(null);
    setSelected(null);
    setInput('');
    setMatches({});
    if (exerciseIdx < lesson.exercises.length - 1) {
      setExerciseIdx(exerciseIdx + 1);
    } else {
      setExerciseIdx(0);
      setLessonIdx((lessonIdx + 1) % lessons.length);
      setStreak(streak + 1);
    }
  };

  // Listen for listen-type
  const playAudio = () => {
    if ('speechSynthesis' in window && exercise.audio) {
      const utterance = new window.SpeechSynthesisUtterance(exercise.audio);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Match logic
  const handleMatch = (es: string, en: string) => {
    setMatches({ ...matches, [es]: en });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative border-4 border-green-300 flex flex-col items-center">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={onClose}>×</button>
        <div className="flex items-center gap-8 mb-6 w-full justify-between">
          <div className="text-2xl font-bold text-green-700">XP: {xp}</div>
          <div className="text-xl font-semibold text-yellow-600">🔥 Streak: {streak}</div>
        </div>
        <h2 className="text-3xl font-extrabold mb-4 text-green-700">{lesson.title}</h2>
        <div className="w-full max-w-lg bg-white/80 rounded-2xl p-6 mb-4 shadow flex flex-col gap-4 items-center">
          {exercise.type === 'multiple-choice' && (
            <>
              <div className="text-lg font-semibold mb-4">{exercise.question}</div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {exercise.options.map((option: string) => (
                  <button
                    key={option}
                    className={`px-4 py-3 rounded-xl font-semibold shadow transition-all text-lg ${selected === option ? (option === exercise.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                    onClick={() => handleSubmit(option)}
                    disabled={!!selected}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {exercise.type === 'fill-blank' && (
            <>
              <div className="text-lg font-semibold mb-4">{exercise.question}</div>
              <input
                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(input)}
                disabled={!!feedback}
                placeholder="Type your answer..."
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700" onClick={() => handleSubmit(input)} disabled={!!feedback || !input.trim()}>Submit</button>
            </>
          )}
          {exercise.type === 'match' && (
            <>
              <div className="text-lg font-semibold mb-4">{exercise.question}</div>
              <div className="flex gap-8 w-full justify-center">
                <div className="flex flex-col gap-2">
                  {exercise.pairs.map((pair: any) => (
                    <div key={pair.es} className="bg-blue-100 px-4 py-2 rounded-xl text-blue-800 font-semibold">{pair.es}</div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {exercise.pairs.map((pair: any) => (
                    <select
                      key={pair.en}
                      className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={matches[pair.es] || ''}
                      onChange={e => handleMatch(pair.es, e.target.value)}
                    >
                      <option value="">Selecciona</option>
                      {exercise.pairs.map((p: any) => (
                        <option key={p.en} value={p.en}>{p.en}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700 mt-2" onClick={() => handleSubmit('match')} disabled={!!feedback}>Enviar</button>
            </>
          )}
          {exercise.type === 'listen-type' && (
            <>
              <div className="text-lg font-semibold mb-4">{exercise.question}</div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 mb-2" onClick={playAudio}>🔊 Play</button>
              <input
                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(input)}
                disabled={!!feedback}
                placeholder="Type what you hear..."
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700" onClick={() => handleSubmit(input)} disabled={!!feedback || !input.trim()}>Submit</button>
            </>
          )}
          {exercise.type === 'speak-repeat' && (
            <>
              <div className="text-lg font-semibold mb-4">{exercise.question}</div>
              <button className={`bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700 ${listening ? 'opacity-50' : ''}`} onClick={() => handleSubmit('speak')} disabled={listening || isLoading}>🎤 Speak</button>
              {isLoading && <div className="text-gray-400 mt-2">Listening...</div>}
            </>
          )}
          {feedback && <div className={`mt-4 text-lg font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-500'}`}>{feedback}</div>}
        </div>
        <button className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-600 mt-4" onClick={onClose}>Exit</button>
      </div>
    </div>
  );
};

export default DuolingoGame; 