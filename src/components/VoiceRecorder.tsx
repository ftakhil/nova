import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        onRecordingComplete?.(audioBlob);
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }
    setIsRecording(false);
    setIsPaused(false);
    onRecordingStop?.();
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Recording Animation */}
      <div className="relative">
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
          isRecording 
            ? 'border-red-500 bg-red-50 shadow-lg' 
            : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50'
        }`}>
          {/* Pulsing Animation */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20"></div>
              <div className="absolute inset-2 rounded-full border-4 border-red-400 animate-ping opacity-30 animation-delay-150"></div>
              <div className="absolute inset-4 rounded-full border-4 border-red-300 animate-ping opacity-40 animation-delay-300"></div>
            </>
          )}
          
          {!isRecording ? (
            <Mic className="w-12 h-12 text-gray-600" />
          ) : (
            <div className="flex items-center justify-center">
              {isPaused ? (
                <MicOff className="w-12 h-12 text-red-500" />
              ) : (
                <Mic className="w-12 h-12 text-red-500 animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recording Time */}
      {isRecording && (
        <div className="text-2xl font-mono font-bold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-md">
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={stopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        {!isRecording && (
          <p className="text-gray-600">Click to start recording your voice</p>
        )}
        {isRecording && !isPaused && (
          <p className="text-red-600 font-medium animate-pulse">Recording in progress...</p>
        )}
        {isRecording && isPaused && (
          <p className="text-yellow-600 font-medium">Recording paused</p>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;