import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Brain, Loader2 } from 'lucide-react';
import { apiService } from '../Functionality/ApiService'
import { formatConfidence, getConfidenceColor, getDiseaseDisplayName } from '../Functionality/ApiService';
import type { UploadedFile, PredictionResponse } from '../Functionality/ApiService';



const PotatoDiseaseUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isImage && isValidSize;
    });

    validFiles.forEach(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      const newFile: UploadedFile = {
        id,
        file,
        preview,
        status: 'uploading',
        predictionStatus: 'idle'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === id ? { ...f, status: Math.random() > 0.1 ? 'success' : 'error' } : f
          )
        );
      }, 1000 + Math.random() * 2000);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [processFiles]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const predictImage = useCallback(async (id: string) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (!file) return;

    // Update status to predicting
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === id ? { ...f, predictionStatus: 'predicting' } : f
      )
    );

    try {
      const prediction = await apiService.predictDisease(file.file);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === id ? { 
            ...f, 
            predictionStatus: 'predicted',
            prediction: prediction
          } : f
        )
      );
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === id ? { 
            ...f, 
            predictionStatus: 'prediction_error',
            predictionError: error instanceof Error ? error.message : 'Prediction failed'
          } : f
        )
      );
    }
  }, [uploadedFiles]);

  const clearAll = useCallback(() => {
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
  }, [uploadedFiles]);

  const predictAllImages = useCallback(async () => {
    const successfulFiles = uploadedFiles.filter(f => f.status === 'success' && f.predictionStatus === 'idle');
    
    for (const file of successfulFiles) {
      await predictImage(file.id);
    }
  }, [uploadedFiles, predictImage]);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Potato Disease Classification</h1>
            <div className="flex space-x-4">
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Home</button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">About</button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Services</button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Upload Potato Leaf Images</h2>
          <p className="text-slate-400 text-lg">
            Drag and drop your potato leaf images here or click to select files
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragActive
                ? 'border-blue-400 bg-blue-400/10 scale-105'
                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
            }`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full transition-colors ${
                isDragActive ? 'bg-blue-500' : 'bg-slate-700'
              }`}>
                <Upload className={`w-8 h-8 transition-colors ${
                  isDragActive ? 'text-white' : 'text-slate-300'
                }`} />
              </div>
              
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
                </p>
                <p className="text-slate-400">
                  or <span className="text-blue-400 font-medium">click to browse</span>
                </p>
              </div>
              
              <div className="text-sm text-slate-500">
                Supports: JPG, PNG, GIF • Max size: 10MB each
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Uploaded Images ({uploadedFiles.length})
              </h3>
              <div className="flex space-x-2">
                {uploadedFiles.some(f => f.status === 'success' && f.predictionStatus === 'idle') && (
                  <button
                    onClick={predictAllImages}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Predict All</span>
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                    <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-slate-600">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white truncate flex-1 mr-2">
                        {file.file.name}
                      </span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        {file.status === 'uploading' && (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-blue-400">Uploading...</span>
                          </>
                        )}
                        {file.status === 'success' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-400">Uploaded</span>
                          </>
                        )}
                        {file.status === 'error' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-400">Error</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Prediction Section */}
                    {file.status === 'success' && (
                      <div className="mt-3 pt-3 border-t border-slate-600/50">
                        {file.predictionStatus === 'idle' && (
                          <button
                            onClick={() => predictImage(file.id)}
                            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Brain className="w-4 h-4" />
                            <span>Predict Disease</span>
                          </button>
                        )}
                        
                        {file.predictionStatus === 'predicting' && (
                          <div className="flex items-center justify-center space-x-2 text-blue-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Analyzing...</span>
                          </div>
                        )}
                        
                        {file.predictionStatus === 'predicted' && file.prediction && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">Disease:</span>
                              <span className="text-sm text-slate-300">
                                {getDiseaseDisplayName(file.prediction.class)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">Confidence:</span>
                              <span className={`text-sm font-medium ${getConfidenceColor(file.prediction.confidence)}`}>
                                {formatConfidence(file.prediction.confidence)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  file.prediction.confidence >= 0.8 ? 'bg-green-500' :
                                  file.prediction.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${file.prediction.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {file.predictionStatus === 'prediction_error' && (
                          <div className="flex items-center space-x-2 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{file.predictionError || 'Prediction failed'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classification Results Summary */}
        {uploadedFiles.filter(f => f.predictionStatus === 'predicted').length > 0 && (
          <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Classification Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.filter(f => f.predictionStatus === 'predicted').map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white truncate">{file.file.name}</p>
                    <p className="text-sm text-slate-300 mt-1">
                      {file.prediction && getDiseaseDisplayName(file.prediction.class)}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      file.prediction && getConfidenceColor(file.prediction.confidence)
                    }`}>
                      {file.prediction && formatConfidence(file.prediction.confidence)} confidence
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    file.prediction && file.prediction.confidence >= 0.8 
                      ? 'bg-green-500/20 text-green-400' 
                      : file.prediction && file.prediction.confidence >= 0.6 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {file.prediction && file.prediction.confidence >= 0.8 ? 'High' : 
                     file.prediction && file.prediction.confidence >= 0.6 ? 'Medium' : 'Low'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 bg-slate-800/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Privacy</button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Terms</button>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotatoDiseaseUpload;