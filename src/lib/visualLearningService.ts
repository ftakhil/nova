import { TranslationService, TranslationResult } from './translationService';

export interface ExtractedText {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VisualLearningResult {
  originalImage: string;
  extractedTexts: ExtractedText[];
  translations: TranslationResult[];
  targetLanguage: string;
  sourceLanguage?: string;
}

export class VisualLearningService {
  private static readonly VISION_API_KEY = 'AIzaSyCuzGloBEG2vf8v3r5aPDGB3mPAoloy5Zk';
  private static readonly VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

  // Extract text from image using Google Cloud Vision API
  static async extractTextFromImage(imageFile: File): Promise<ExtractedText[]> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await fetch(`${this.VISION_API_URL}?key=${this.VISION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(',')[1] // Remove data:image/...;base64, prefix
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 50
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
        const textAnnotations = data.responses[0].textAnnotations;
        
        // Skip the first annotation as it contains all text combined
        const extractedTexts: ExtractedText[] = textAnnotations.slice(1).map((annotation: any) => ({
          text: annotation.description,
          confidence: annotation.confidence || 0.8,
          boundingBox: annotation.boundingPoly ? {
            x: annotation.boundingPoly.vertices[0].x,
            y: annotation.boundingPoly.vertices[0].y,
            width: annotation.boundingPoly.vertices[1].x - annotation.boundingPoly.vertices[0].x,
            height: annotation.boundingPoly.vertices[2].y - annotation.boundingPoly.vertices[0].y
          } : undefined
        }));

        return extractedTexts;
      }

      return [];
    } catch (error) {
      console.error('Text extraction error:', error);
      throw error;
    }
  }

  // Process image and translate extracted text
  static async processImageForTranslation(
    imageFile: File, 
    targetLanguage: string, 
    sourceLanguage?: string
  ): Promise<VisualLearningResult> {
    try {
      // Extract text from image
      const extractedTexts = await this.extractTextFromImage(imageFile);
      
      // Translate each extracted text
      const translations: TranslationResult[] = [];
      for (const extractedText of extractedTexts) {
        if (extractedText.text.trim()) {
          try {
            const translation = await TranslationService.translateText(
              extractedText.text,
              targetLanguage,
              sourceLanguage
            );
            translations.push(translation);
          } catch (error) {
            console.error(`Translation error for text: ${extractedText.text}`, error);
            // Add fallback translation
            translations.push({
              translatedText: `[Translation failed: ${extractedText.text}]`,
              detectedLanguage: sourceLanguage,
              confidence: 0
            });
          }
        }
      }

      // Convert image to base64 for display
      const originalImage = await this.fileToBase64(imageFile);

      return {
        originalImage,
        extractedTexts,
        translations,
        targetLanguage,
        sourceLanguage
      };
    } catch (error) {
      console.error('Visual learning processing error:', error);
      throw error;
    }
  }

  // Convert file to base64
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Validate image file
  static validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, GIF, BMP)');
    }

    if (file.size > maxSize) {
      throw new Error('Image file size must be less than 10MB');
    }

    return true;
  }

  // Get supported image formats
  static getSupportedFormats(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
  }

  // Get maximum file size
  static getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }
} 