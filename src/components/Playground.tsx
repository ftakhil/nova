import React, { useState, useRef } from 'react';

interface PlaygroundProps {
  onQuit?: () => void;
}

const puzzles = [
  { sentence: "I ___ to school every day.", answer: "go", options: ["go", "went", "gone", "going"] },
  { sentence: "She is ___ a book.", answer: "reading", options: ["read", "reads", "reading", "readed"] }
];

const Playground: React.FC<PlaygroundProps> = ({ onQuit }) => {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState("");
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string) => {
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain");
    const answer = puzzles[current].answer;
    if (word === answer) {
      if (dropZoneRef.current) dropZoneRef.current.textContent = word;
      setResult("✅ Correct!");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % puzzles.length);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center relative">
        {/* Quit Button */}
        <button
          onClick={handleQuit}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold shadow transition-all"
        >
          Quit
        </button>
        <h2 className="text-2xl font-bold mb-6">Playground</h2>
        <div className="mb-6 text-lg font-medium">
          {puzzles[current].sentence.replace("___", "_____")}
        </div>
        <div
          ref={dropZoneRef}
          className="drop-zone mb-6 p-6 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 text-lg font-semibold min-h-[50px] flex items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          Drop the correct word here
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {puzzles[current].options.map((w) => (
            <div
              key={w}
              className="option px-6 py-2 bg-blue-600 text-white rounded-lg shadow cursor-grab hover:bg-blue-700 transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, w)}
            >
              {w}
            </div>
          ))}
        </div>
        <div className="result text-xl font-bold mt-2 min-h-[32px]">{result}</div>
      </div>
    </div>
  );
};

export default Playground; 