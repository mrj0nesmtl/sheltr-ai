"""
Google Gemini Service for SHELTR-AI Backend
Uses Firebase AI Logic with Vertex AI backend
"""

import os
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class GeminiService:
    """Google Gemini integration service for SHELTR-AI chatbot"""
    
    def __init__(self):
        """Initialize Gemini client with SHELTR configuration"""
        try:
            # Get API key from environment
            api_key = os.getenv("GEMINI_API_KEY")
            
            if not api_key:
                logger.warning("⚠️ GEMINI_API_KEY not found in environment")
                self.available = False
                return
            
            # Configure Gemini
            genai.configure(api_key=api_key)
            
            # Safety settings (moderate blocking)
            self.safety_settings = {
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            }
            
            # Generation config
            self.generation_config = {
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 2000,
            }
            
            self.available = True
            logger.info("✅ Gemini service initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini service: {str(e)}")
            self.available = False
    
    def is_available(self) -> bool:
        """Check if Gemini service is available"""
        return self.available
    
    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "gemini-2.5-flash",
        max_tokens: int = 2000,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generate chat completion using Gemini
        
        Args:
            messages: List of conversation messages [{"role": "user/assistant", "content": "..."}]
            model: Gemini model to use (gemini-2.5-flash or gemini-2.5-flash-lite)
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            system_prompt: System instruction for the model
            
        Returns:
            Generated response text
        """
        try:
            if not self.is_available():
                raise Exception("Gemini service not available")
            
            # Create model instance
            gemini_model = genai.GenerativeModel(
                model_name=model,
                safety_settings=self.safety_settings,
                generation_config={
                    "temperature": temperature,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": max_tokens,
                }
            )
            
            # Convert conversation history to Gemini format
            gemini_messages = []
            
            # Add system prompt as first user message if provided
            if system_prompt:
                gemini_messages.append({
                    "role": "user",
                    "parts": [system_prompt]
                })
                gemini_messages.append({
                    "role": "model",
                    "parts": ["Understood. I'll follow these instructions."]
                })
            
            # Add conversation history
            for msg in messages:
                role = "model" if msg["role"] == "assistant" else "user"
                gemini_messages.append({
                    "role": role,
                    "parts": [msg["content"]]
                })
            
            # Start chat with history
            chat = gemini_model.start_chat(history=gemini_messages[:-1] if len(gemini_messages) > 1 else [])
            
            # Get last message to send
            last_message = gemini_messages[-1]["parts"][0] if gemini_messages else "Hello"
            
            # Generate response
            response = chat.send_message(last_message)
            
            logger.info(f"✅ Gemini ({model}) response generated successfully")
            return response.text
            
        except Exception as e:
            logger.error(f"❌ Gemini generation error: {str(e)}")
            raise Exception(f"Gemini generation failed: {str(e)}")
    
    async def generate_response(
        self,
        message: str,
        context: Dict[str, Any] = None,
        system_prompt: Optional[str] = None,
        model: str = "gemini-2.5-flash"
    ) -> str:
        """
        Generate a simple response (compatibility method)
        
        Args:
            message: User message
            context: Optional context dictionary
            system_prompt: System instruction
            model: Gemini model to use
            
        Returns:
            Generated response text
        """
        try:
            # Convert to chat format
            messages = []
            
            # Add conversation history from context if available
            if context and 'conversation_history' in context:
                for msg in context['conversation_history']:
                    # Handle different message formats
                    if isinstance(msg, dict):
                        if 'role' in msg and 'content' in msg:
                            # Standard format: {"role": "user/assistant", "content": "..."}
                            messages.append(msg)
                        elif 'user_message' in msg and 'bot_response' in msg:
                            # Orchestrator format: {"user_message": "...", "bot_response": "..."}
                            messages.append({"role": "user", "content": msg['user_message']})
                            messages.append({"role": "assistant", "content": msg['bot_response']})
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })
            
            return await self.generate_chat_completion(
                messages=messages,
                model=model,
                system_prompt=system_prompt
            )
            
        except Exception as e:
            logger.error(f"❌ Gemini response generation error: {str(e)}")
            raise Exception(f"Gemini response generation failed: {str(e)}")
    
    def get_available_models(self) -> List[str]:
        """Get list of available Gemini models"""
        return [
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite"
        ]
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Gemini service health"""
        try:
            if not self.is_available():
                return {
                    "status": "unavailable",
                    "error": "Gemini service not initialized"
                }
            
            # Try a simple generation
            test_model = genai.GenerativeModel("gemini-2.5-flash-lite")
            response = test_model.generate_content("Say 'Hello from SHELTR!'")
            
            return {
                "status": "healthy",
                "models": self.get_available_models(),
                "test_response": response.text
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

# Singleton instance
gemini_service = GeminiService()

