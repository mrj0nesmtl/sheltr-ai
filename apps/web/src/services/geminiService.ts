/**
 * Firebase AI Logic Service (Gemini)
 * 
 * Provides access to Gemini models via Firebase AI Logic.
 * All data stays in Google Cloud (no external API calls).
 * 
 * Models used:
 * - gemini-2.0-flash: Fast, multimodal, 1M token context (auto-updating alias)
 * - gemini-2.0-flash-lite: Faster, lighter version for simple tasks
 * 
 * References:
 * - https://firebase.google.com/docs/ai-logic
 * - https://firebase.google.com/docs/ai-logic/models
 * - https://firebase.google.com/docs/ai-logic/chat
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import type { 
  GenerativeModel, 
  ChatSession,
  GenerateContentResult,
  Content
} from 'firebase/ai';

// Firebase config (from existing Firebase setup)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initialize Firebase AI Logic
 * Uses Gemini Developer API backend (free tier available)
 */
class GeminiService {
  private ai: ReturnType<typeof getAI> | null = null;
  private flashModel: GenerativeModel | null = null;
  private flashLiteModel: GenerativeModel | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Firebase and AI Logic service
   */
  private initialize() {
    try {
      // Initialize Firebase (reuse existing app if available)
      const firebaseApp = getApps().length > 0 
        ? getApps()[0] 
        : initializeApp(firebaseConfig);

      // Initialize Gemini Developer API backend
      this.ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

      // Create model instances
      // gemini-2.0-flash: Auto-updating alias to latest stable version
      this.flashModel = getGenerativeModel(this.ai, { 
        model: 'gemini-2.0-flash' 
      });

      // gemini-2.0-flash-lite: Faster, lighter version
      this.flashLiteModel = getGenerativeModel(this.ai, { 
        model: 'gemini-2.0-flash-lite' 
      });

      this.initialized = true;
      console.log('✅ Firebase AI Logic (Gemini) initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase AI Logic:', error);
      this.initialized = false;
    }
  }

  /**
   * Check if service is initialized and available
   */
  isAvailable(): boolean {
    return this.initialized && this.ai !== null;
  }

  /**
   * Generate text from a prompt (one-shot)
   * 
   * @param prompt - Text prompt
   * @param useLite - Use lite model for faster response (default: false)
   * @returns Generated text
   */
  async generateText(prompt: string, useLite = false): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Gemini service not initialized');
    }

    try {
      const model = useLite ? this.flashLiteModel : this.flashModel;
      if (!model) throw new Error('Model not available');

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini generateText error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for text (for knowledge base search)
   * 
   * Note: Firebase AI Logic uses the same embedding model as Vertex AI
   * 
   * @param text - Text to embed
   * @returns Embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isAvailable()) {
      throw new Error('Gemini service not initialized');
    }

    try {
      // TODO: Firebase AI Logic doesn't expose embeddings API yet
      // For now, we'll need to use Vertex AI directly or keep OpenAI
      // This is a placeholder for when the feature is available
      
      console.warn('⚠️ Embeddings not yet available via Firebase AI Logic');
      console.warn('   Continue using OpenAI for embeddings until supported');
      
      throw new Error('Embeddings not yet supported by Firebase AI Logic');
    } catch (error) {
      console.error('❌ Gemini generateEmbedding error:', error);
      throw error;
    }
  }

  /**
   * Start a chat session (multi-turn conversation)
   * 
   * @param history - Optional chat history
   * @param useLite - Use lite model for faster response (default: false)
   * @returns Chat session
   */
  startChat(history: Content[] = [], useLite = false): ChatSession {
    if (!this.isAvailable()) {
      throw new Error('Gemini service not initialized');
    }

    const model = useLite ? this.flashLiteModel : this.flashModel;
    if (!model) throw new Error('Model not available');

    return model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });
  }

  /**
   * Send a message in a chat session
   * 
   * @param session - Chat session
   * @param message - User message
   * @returns AI response
   */
  async sendChatMessage(session: ChatSession, message: string): Promise<string> {
    try {
      const result = await session.sendMessage(message);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini sendChatMessage error:', error);
      throw error;
    }
  }

  /**
   * Generate structured output (JSON)
   * 
   * @param prompt - Text prompt
   * @param schema - JSON schema for output
   * @returns Structured JSON response
   */
  async generateStructuredOutput<T = any>(
    prompt: string, 
    schema: any
  ): Promise<T> {
    if (!this.isAvailable()) {
      throw new Error('Gemini service not initialized');
    }

    try {
      if (!this.flashModel) throw new Error('Model not available');

      const result = await this.flashModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const response = result.response;
      const text = response.text();
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('❌ Gemini generateStructuredOutput error:', error);
      throw error;
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      flash: {
        name: 'gemini-2.0-flash',
        description: 'Fast, multimodal model with 1M token context',
        contextWindow: 1_048_576, // 1M tokens
        maxOutputTokens: 8192,
      },
      flashLite: {
        name: 'gemini-2.0-flash-lite',
        description: 'Faster, lighter version for simple tasks',
        contextWindow: 1_048_576, // 1M tokens
        maxOutputTokens: 8192,
      },
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export types for use in other files
export type { ChatSession, Content, GenerateContentResult };

