interface PredictionResponse {
  class: string;
  confidence: number;
}

interface ApiError {
  message: string;
  status?: number;
}

class ApiService {

  private baseUrl = 'http://localhost:8080';


  async predictDisease(file: File): Promise<PredictionResponse> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data || typeof data.class !== 'string' || typeof data.confidence !== 'number') {
        throw new Error('Invalid response format from API');
      }

      return {
        class: data.class,
        confidence: data.confidence
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the API server');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred during prediction');
    }
  }
}

export const apiService = new ApiService();

export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-400';
  if (confidence >= 0.6) return 'text-yellow-400';
  return 'text-red-400';
};

export const getDiseaseDisplayName = (className: string): string => {
  const displayNames: { [key: string]: string } = {
    'early_blight': 'Early Blight',
    'late_blight': 'Late Blight',
    'healthy': 'Healthy',
    'bacterial_spot': 'Bacterial Spot',
    'target_spot': 'Target Spot',
    'mosaic_virus': 'Mosaic Virus',
    'yellow_curl_virus': 'Yellow Curl Virus',
    'leaf_mold': 'Leaf Mold',
    'septoria_leaf_spot': 'Septoria Leaf Spot',
    'spider_mites': 'Spider Mites'
  };

  return displayNames[className] || className.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  prediction?: PredictionResponse;
  predictionStatus?: 'idle' | 'predicting' | 'predicted' | 'prediction_error';
  predictionError?: string;
}