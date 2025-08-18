"""
SHELTR-AI OpenAI Service
Intelligent AI-powered chatbot responses using GPT-4o-mini
"""

import os
import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio

import openai
import tiktoken
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)

class OpenAIService:
    """OpenAI integration service for SHELTR-AI intelligent chatbot"""
    
    def __init__(self):
        """Initialize OpenAI client with SHELTR configuration"""
        try:
            # Initialize OpenAI client
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "your_openai_api_key_here":
                logger.warning("⚠️  OpenAI API key not configured - AI features disabled")
                self.client = None
                self.available = False
                return
            
            self.client = openai.AsyncOpenAI(
                api_key=api_key,
                timeout=float(os.getenv("OPENAI_TIMEOUT", 30))
            )
            
            # Configuration
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            self.fallback_model = os.getenv("OPENAI_FALLBACK_MODEL", "gpt-3.5-turbo")
            self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", 150))
            self.temperature = float(os.getenv("OPENAI_TEMPERATURE", 0.7))
            self.max_context_tokens = int(os.getenv("OPENAI_MAX_CONTEXT_TOKENS", 4000))
            
            # Initialize token encoder
            try:
                self.encoding = tiktoken.encoding_for_model(self.model)
            except KeyError:
                logger.warning(f"Model {self.model} not found in tiktoken, using cl100k_base")
                self.encoding = tiktoken.get_encoding("cl100k_base")
            
            # Rate limiting
            self.requests_per_minute = int(os.getenv("OPENAI_RATE_LIMIT_PER_MINUTE", 60))
            self.request_timestamps = []
            
            self.available = True
            logger.info(f"✅ OpenAI service initialized with model: {self.model}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize OpenAI service: {e}")
            self.client = None
            self.available = False
    
    def _check_rate_limit(self) -> bool:
        """Check if we're within rate limits"""
        if not self.available:
            return False
            
        current_time = time.time()
        minute_ago = current_time - 60
        
        # Remove old requests
        self.request_timestamps = [
            timestamp for timestamp in self.request_timestamps 
            if timestamp > minute_ago
        ]
        
        # Check if we can make a new request
        if len(self.request_timestamps) >= self.requests_per_minute:
            logger.warning("Rate limit reached, request denied")
            return False
        
        # Add current request
        self.request_timestamps.append(current_time)
        return True
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((openai.RateLimitError, openai.APITimeoutError))
    )
    async def generate_response(
        self, 
        message: str, 
        context: Dict[str, Any],
        system_prompt: str = None
    ) -> str:
        """Generate AI response with context awareness and retry logic"""
        
        if not self.available or not self._check_rate_limit():
            raise Exception("OpenAI service unavailable or rate limited")
        
        try:
            # Prepare messages for OpenAI
            messages = []
            
            # Add system prompt
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            # Add conversation context if available
            conversation_history = context.get("conversation_history", [])
            for exchange in conversation_history[-3:]:  # Last 3 exchanges
                if "user_message" in exchange and "bot_response" in exchange:
                    messages.append({
                        "role": "user", 
                        "content": exchange["user_message"]
                    })
                    messages.append({
                        "role": "assistant", 
                        "content": exchange["bot_response"]
                    })
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })
            
            # Count tokens and ensure we're within limits
            total_tokens = sum(self.count_tokens(msg["content"]) for msg in messages)
            if total_tokens > self.max_context_tokens:
                # Truncate conversation history
                messages = messages[:1] + messages[-2:]  # Keep system + last exchange
            
            # Generate response
            start_time = time.time()
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                presence_penalty=0.1,  # Encourage varied responses
                frequency_penalty=0.1   # Reduce repetition
            )
            
            response_time = time.time() - start_time
            
            # Extract and validate response
            ai_response = response.choices[0].message.content.strip()
            
            # Log metrics
            logger.info(f"OpenAI response generated in {response_time:.2f}s, "
                       f"tokens: {response.usage.total_tokens}")
            
            return ai_response
            
        except openai.RateLimitError as e:
            logger.warning(f"OpenAI rate limit hit: {e}")
            raise
        except openai.APITimeoutError as e:
            logger.warning(f"OpenAI timeout: {e}")
            raise
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise Exception(f"AI response generation failed: {str(e)}")
    
    async def classify_intent(
        self, 
        message: str, 
        user_role: str, 
        conversation_history: List[Dict] = None
    ) -> Dict[str, Any]:
        """Use LLM for enhanced intent classification"""
        
        if not self.available:
            return {"error": "OpenAI service unavailable"}
        
        classification_prompt = f"""
        You are an expert at understanding user intents in a homeless services platform.
        
        User Role: {user_role}
        Message: "{message}"
        
        Classify this message into:
        
        Categories:
        - emergency: Crisis, immediate danger, urgent needs
        - information: Questions, explanations, general inquiries  
        - action: Service booking, donations, account actions
        - support: Technical issues, platform problems
        - navigation: Help finding features, tutorials
        
        Urgency Levels:
        - critical: Immediate danger, emergency
        - high: Urgent but not life-threatening
        - medium: Important but can wait
        - low: General inquiry
        
        Respond in JSON format:
        {{
            "category": "category_name",
            "subcategory": "specific_type",
            "confidence": 0.85,
            "urgency": "urgency_level",
            "entities": ["extracted", "keywords"],
            "reasoning": "brief explanation"
        }}
        """
        
        try:
            response = await self.generate_response(
                message=classification_prompt,
                context={"task": "intent_classification"},
                system_prompt="You are a precise intent classification system. Always respond with valid JSON."
            )
            
            # Try to parse JSON response
            import json
            try:
                classification = json.loads(response)
                return classification
            except json.JSONDecodeError:
                # Fallback to basic classification
                return {
                    "category": "information",
                    "subcategory": "general",
                    "confidence": 0.6,
                    "urgency": "medium",
                    "entities": [],
                    "reasoning": "JSON parse failed, using fallback"
                }
                
        except Exception as e:
            logger.error(f"Intent classification failed: {e}")
            return {"error": str(e)}
    
    async def summarize_conversation(
        self, 
        conversation_history: List[Dict], 
        max_summary_tokens: int = 100
    ) -> str:
        """Generate conversation summary for context management"""
        
        if not self.available or not conversation_history:
            return "No conversation history available."
        
        # Format conversation for summarization
        conversation_text = ""
        for exchange in conversation_history[-10:]:  # Last 10 exchanges
            if "user_message" in exchange and "bot_response" in exchange:
                conversation_text += f"User: {exchange['user_message']}\n"
                conversation_text += f"Assistant: {exchange['bot_response']}\n\n"
        
        summary_prompt = f"""
        Summarize this conversation in 2-3 sentences, focusing on:
        - Main topics discussed
        - Key requests or actions
        - Current conversation context
        
        Conversation:
        {conversation_text}
        
        Summary:
        """
        
        try:
            summary = await self.generate_response(
                message=summary_prompt,
                context={"task": "summarization"},
                system_prompt="You are a conversation summarizer. Provide clear, concise summaries."
            )
            
            # Ensure summary isn't too long
            if self.count_tokens(summary) > max_summary_tokens:
                sentences = summary.split('.')
                summary = '. '.join(sentences[:2]) + '.'
            
            return summary
            
        except Exception as e:
            logger.error(f"Conversation summarization failed: {e}")
            return "Unable to summarize conversation."
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text for context management"""
        if not self.available:
            return len(text.split())  # Rough estimate
        
        try:
            return len(self.encoding.encode(text))
        except Exception:
            return len(text.split())  # Fallback to word count
    
    def is_available(self) -> bool:
        """Check if OpenAI service is available"""
        return self.available
    
    async def health_check(self) -> Dict[str, Any]:
        """Perform health check on OpenAI service"""
        if not self.available:
            return {
                "status": "unavailable",
                "reason": "OpenAI client not initialized",
                "features_available": False
            }
        
        try:
            # Test with a simple request
            start_time = time.time()
            test_response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            response_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "model": self.model,
                "response_time": f"{response_time:.2f}s",
                "features_available": True,
                "rate_limit_remaining": self.requests_per_minute - len(self.request_timestamps)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "features_available": False
            }

# Create singleton instance
openai_service = OpenAIService()
