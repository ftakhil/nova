import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
];

const translateText = async (text: string, target: string) => {
  // Using LibreTranslate public API for demo (rate-limited, not for production)
  const res = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target, format: 'text' })
  });
  const data = await res.json();
  return data.translatedText;
};

const speak = (text: string, lang: string) => {
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = lang;
  window.speechSynthesis.speak(utter);
};

const VisualLearning: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [objectName, setObjectName] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera.');
      }
    };
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let model: cocoSsd.ObjectDetection;
    const runDetection = async () => {
      setDetecting(true);
      model = await cocoSsd.load();
      setDetecting(false);
      interval = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current!);
          if (predictions.length > 0) {
            const best = predictions[0].class;
            if (best !== objectName) {
              setObjectName(best);
              setTranslations({});
              // Translate to all languages
              LANGUAGES.forEach(async (lang) => {
                if (lang.code !== 'en') {
                  const translated = await translateText(best, lang.code);
                  setTranslations(prev => ({ ...prev, [lang.code]: translated }));
                } else {
                  setTranslations(prev => ({ ...prev, en: best }));
                }
              });
            }
          }
        }
      }, 2000);
    };
    runDetection();
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [videoRef]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Visual Learning</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={400}
          height={300}
          className="mx-auto rounded-xl shadow mb-6 border border-purple-200"
        />
        <div className="mb-4">
          {detecting ? (
            <span className="text-purple-500">Loading model...</span>
          ) : objectName ? (
            <>
              <div className="text-lg font-semibold mb-2">Detected: <span className="text-purple-600">{objectName}</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LANGUAGES.map(lang => (
                  <div key={lang.code} className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-2">
                    <span className="font-medium">{lang.label}:</span>
                    <span className="ml-2 text-purple-700">{translations[lang.code] || (lang.code === 'en' ? objectName : '...')}</span>
                    <button
                      className="ml-2 px-2 py-1 bg-purple-200 rounded hover:bg-purple-300 text-xs"
                      onClick={() => speak(translations[lang.code] || objectName || '', lang.code)}
                      disabled={!translations[lang.code] && lang.code !== 'en'}
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className="text-gray-500">Point your camera at an object to identify it.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualLearning; 