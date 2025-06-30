import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyCuzGloBEG2vf8v3r5aPDGB3mPAoloy5Zk');

// Use the same API key for Google Translate API
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyCuzGloBEG2vf8v3r5aPDGB3mPAoloy5Zk';
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

export interface GeminiScenario {
  scenario: string;
  highlightedWord: string;
  context: string;
  studyTips?: string;
  practiceExercise?: string;
}

export class TranslationService {
  // Google Translate API
  static async translateText(text: string, targetLang: string, sourceLang?: string): Promise<TranslationResult> {
    try {
      // Build request body
      const body: any = {
        q: text,
        target: targetLang,
        format: 'text'
      };
      if (sourceLang) {
        body.source = sourceLang;
      }
      const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        return {
          translatedText: data.data.translations[0].translatedText,
          detectedLanguage: data.data.translations[0].detectedSourceLanguage,
          confidence: data.data.translations[0].confidence || 0
        };
      }

      throw new Error('No translation data received');
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Enhanced Gemini API for contextual scenarios and study materials
  static async createContextualScenario(
    text: string, 
    sourceLang: string, 
    targetLang: string, 
    translatedText: string
  ): Promise<GeminiScenario> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const isSingleWord = text.split(' ').length === 1;
      const isShortPhrase = text.split(' ').length <= 3;
      const isSentence = text.split(' ').length > 3;

      let prompt = '';
      
      if (isSingleWord) {
        prompt = `
          You are a language learning assistant. Create a practical learning scenario for the word "${text}" (${sourceLang}) / "${translatedText}" (${targetLang}).

          Create a realistic dialogue or situation (2-3 sentences) where this word is used naturally. Highlight the word with **bold** formatting.
          
          You must respond with ONLY a valid JSON object in this exact format:
          {
            "scenario": "A realistic dialogue or situation where the word is used naturally with the word in **bold**",
            "highlightedWord": "${text}",
            "context": "Brief explanation of when/why this word is used",
            "studyTips": "2-3 practical tips for remembering and using this word",
            "practiceExercise": "A simple exercise to practice using this word"
          }

          Example for "hello":
          {
            "scenario": "Maria walks into a café and sees her friend Juan. She smiles and says **hello** to him.",
            "highlightedWord": "hello",
            "context": "Used as a casual greeting when meeting someone",
            "studyTips": "1. Practice saying it with a smile. 2. Use it in the morning. 3. Combine with 'how are you'",
            "practiceExercise": "Greet 3 people today using this word"
          }
        `;
      } else if (isShortPhrase) {
        prompt = `
          You are a language learning assistant. Create a practical learning scenario for the phrase "${text}" (${sourceLang}) / "${translatedText}" (${targetLang}).

          Create a realistic conversation or situation (3-4 sentences) where this phrase fits naturally. Highlight the key words with **bold** formatting.
          
          You must respond with ONLY a valid JSON object in this exact format:
          {
            "scenario": "A realistic conversation or situation with key words in **bold**",
            "highlightedWord": "${text}",
            "context": "Explanation of when and how to use this phrase",
            "studyTips": "3 practical tips for mastering this phrase",
            "practiceExercise": "A practical exercise to practice this phrase"
          }

          Example for "how are you":
          {
            "scenario": "At the office, Sarah meets her colleague Tom in the hallway. She asks **how are you** today? Tom responds that he's doing well.",
            "highlightedWord": "how are you",
            "context": "Used as a polite greeting to ask about someone's well-being",
            "studyTips": "1. Use it after saying hello. 2. Listen for the response. 3. Practice with friends",
            "practiceExercise": "Ask this question to 2 people and practice their responses"
          }
        `;
      } else {
        // For longer sentences
        prompt = `
          You are a language learning assistant. Create an educational study scenario for the sentence "${text}" (${sourceLang}) / "${translatedText}" (${targetLang}).

          Create a realistic situation where this sentence would be used (4-5 sentences). Highlight the main parts of the sentence with **bold** formatting.
          
          You must respond with ONLY a valid JSON object in this exact format:
          {
            "scenario": "A realistic situation where this sentence fits naturally, with key parts in **bold**",
            "highlightedWord": "${text}",
            "context": "Grammar breakdown and cultural context explanation",
            "studyTips": "4-5 practical tips for understanding and using this sentence structure",
            "practiceExercise": "A practical exercise to practice similar sentence patterns"
          }

          Example for "I would like to order a coffee":
          {
            "scenario": "At a café, the customer approaches the counter and says **I would like to order a coffee**. The barista asks what type of coffee they prefer.",
            "highlightedWord": "I would like to order a coffee",
            "context": "Polite way to make a request in a restaurant or café setting",
            "studyTips": "1. Use 'would like' for politeness. 2. Practice with different foods. 3. Learn café vocabulary. 4. Use in restaurants",
            "practiceExercise": "Practice ordering different items at a restaurant"
          }
        `;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text().trim();
      
      console.log('Gemini API Response:', responseText); // Debug log
      
      // Try to extract JSON from the response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          // Validate that we have the required fields
          if (parsed.scenario && parsed.highlightedWord && parsed.context) {
            return {
              scenario: parsed.scenario,
              highlightedWord: parsed.highlightedWord,
              context: parsed.context,
              studyTips: parsed.studyTips || "Practice using this in everyday conversations",
              practiceExercise: parsed.practiceExercise || "Try using this in a similar situation"
            };
          }
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
        }
      }
      
      // If JSON parsing fails, create a fallback scenario
      console.log('Creating fallback scenario due to parsing failure');
      return this.createFallbackScenario(text, sourceLang, targetLang, translatedText);
      
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.createFallbackScenario(text, sourceLang, targetLang, translatedText);
    }
  }

  // Fallback scenario generator
  private static createFallbackScenario(
    text: string, 
    sourceLang: string, 
    targetLang: string, 
    translatedText: string
  ): GeminiScenario {
    const isSingleWord = text.split(' ').length === 1;
    const isShortPhrase = text.split(' ').length <= 3;

    if (isSingleWord) {
      return {
        scenario: `Imagine you're meeting someone new. You can use **${text}** as a greeting or introduction.`,
        highlightedWord: text,
        context: `"${text}" is a common word used in everyday conversation. Practice saying it out loud.`,
        studyTips: "1. Repeat the word 5 times. 2. Use it in a real conversation today. 3. Write it down in your notebook.",
        practiceExercise: `Practice saying "${text}" to yourself, then try using it with a friend or family member.`
      };
    } else if (isShortPhrase) {
      return {
        scenario: `In a conversation, you might say **${text}** to express yourself or ask a question.`,
        highlightedWord: text,
        context: `"${text}" is a useful phrase that you can use in many situations.`,
        studyTips: "1. Break down the phrase into parts. 2. Practice with different tones. 3. Use it in context.",
        practiceExercise: `Try using "${text}" in a real conversation or practice saying it in front of a mirror.`
      };
    } else {
      return {
        scenario: `This sentence **${text}** can be used in various situations. Practice saying it naturally.`,
        highlightedWord: text,
        context: `"${text}" is a complete sentence that you can use in conversations.`,
        studyTips: "1. Read the sentence slowly. 2. Practice pronunciation. 3. Use it in context. 4. Record yourself saying it.",
        practiceExercise: `Practice saying "${text}" out loud several times, then try using it in a conversation.`
      };
    }
  }

  // Get supported languages from Google Translate
  static async getSupportedLanguages(): Promise<Array<{code: string, name: string}>> {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${GOOGLE_TRANSLATE_API_KEY}&target=en`
      );
      
      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.languages.map((lang: any) => ({
        code: lang.language,
        name: lang.name
      }));
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Return fallback languages
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' }
      ];
    }
  }
} 