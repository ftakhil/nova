import React, { useState } from 'react';

interface LanguageQuizShowProps {
  onClose: () => void;
}

const questions = [
  {
    question: 'What is the Spanish word for "apple"?',
    options: ['manzana', 'pera', 'uva', 'naranja'],
    answer: 'manzana',
  },
  {
    question: 'Which of these means "to read" in French?',
    options: ['lire', 'manger', 'parler', 'aller'],
    answer: 'lire',
  },
  {
    question: 'What is the German word for "book"?',
    options: ['Buch', 'Haus', 'Stuhl', 'Baum'],
    answer: 'Buch',
  },
  {
    question: 'How do you say "hello" in Chinese?',
    options: ['你好', '谢谢', '再见', '请'],
    answer: '你好',
  },
];

const LanguageQuizShow: React.FC<LanguageQuizShowProps> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative border border-white/60 flex flex-col items-center">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={onClose}>×</button>
        <h2 className="text-3xl font-extrabold mb-4 text-blue-700">Language Quiz Show</h2>
        {showResult ? (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">Your Score: {score} / {questions.length}</div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 mt-4" onClick={onClose}>Exit</button>
          </div>
        ) : (
          <>
            <div className="text-lg font-semibold mb-6">{questions[current].question}</div>
            <div className="grid grid-cols-2 gap-4 mb-6 w-full">
              {questions[current].options.map(option => (
                <button
                  key={option}
                  className={`px-4 py-3 rounded-xl font-semibold shadow transition-all text-lg ${selected === option ? (option === questions[current].answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="text-gray-500">Question {current + 1} of {questions.length}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageQuizShow; 