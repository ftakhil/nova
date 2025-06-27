import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Eye, Scan, X } from 'lucide-react';
import { CurrentPage } from '../App';

interface ImageIdentificationProps {
  onNavigate: (page: CurrentPage) => void;
}

interface IdentifiedObject {
  name: string;
  confidence: number;
  translation: string;
  pronunciation: string;
}

const ImageIdentification: React.FC<ImageIdentificationProps> = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedObjects, setIdentifiedObjects] = useState<IdentifiedObject[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sampleObjects: IdentifiedObject[] = [
    { name: 'Coffee Cup', confidence: 95, translation: 'Taza de Café', pronunciation: 'TAH-sah day kah-FEH' },
    { name: 'Laptop', confidence: 89, translation: 'Computadora Portátil', pronunciation: 'kom-poo-tah-DOH-rah por-TAH-teel' },
    { name: 'Book', confidence: 92, translation: 'Libro', pronunciation: 'LEE-broh' },
    { name: 'Pen', confidence: 88, translation: 'Pluma', pronunciation: 'PLOO-mah' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        setSelectedImage(dataURL);
        stopCamera();
        analyzeImage();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIdentifiedObjects(sampleObjects);
      setIsAnalyzing(false);
    }, 2000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setIdentifiedObjects([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full p-2">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Visual Learning</h1>
                  <p className="text-sm text-gray-600">Learn by identifying objects around you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Camera/Upload Section */}
        {!selectedImage && !cameraActive && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Upload Image */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h3>
              <p className="text-gray-600 mb-6">
                Upload any image to identify objects and learn their names in different languages
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Choose Image
              </button>
            </div>

            {/* Take Photo */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Take Photo</h3>
              <p className="text-gray-600 mb-6">
                Use your camera to identify objects around you and expand your vocabulary
              </p>
              <button
                onClick={startCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Camera
              </button>
            </div>
          </div>
        )}

        {/* Camera View */}
        {cameraActive && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Camera</h3>
              <button
                onClick={stopCamera}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-2xl mx-auto rounded-lg"
              />
              <div className="text-center mt-4">
                <button
                  onClick={captureImage}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Capture Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Analysis */}
        {selectedImage && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Image Analysis</h3>
              <button
                onClick={clearImage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Selected Image */}
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                />
                {isAnalyzing && (
                  <div className="flex items-center justify-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <Scan className="w-6 h-6 text-purple-600 animate-spin" />
                    <span className="text-purple-700 font-medium">Analyzing image...</span>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="space-y-4">
                {identifiedObjects.length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Identified Objects</h4>
                    <div className="space-y-3">
                      {identifiedObjects.map((object, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-purple-50 transition-colors duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-800">{object.name}</span>
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {object.confidence}% confident
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-purple-700 font-medium">{object.translation}</span>
                              <button
                                onClick={() => speakWord(object.translation)}
                                className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-purple-600 transition-colors duration-300"
                              >
                                <span className="text-xs">🔊</span>
                              </button>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Pronunciation:</span> {object.pronunciation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {!isAnalyzing && identifiedObjects.length === 0 && selectedImage && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No objects identified in this image.</p>
                    <p className="text-sm mt-2">Try uploading a clearer image with recognizable objects.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Tips for better results</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p>• Use well-lit, clear images</p>
              <p>• Focus on single objects for accuracy</p>
              <p>• Try different angles if needed</p>
            </div>
            <div className="space-y-2">
              <p>• Ensure objects are clearly visible</p>
              <p>• Avoid blurry or distorted images</p>
              <p>• Common objects work best</p>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageIdentification;