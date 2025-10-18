"""
Anthropic Claude Service for SHELTR AI Platform
Provides Claude API integration for authenticated administrators
"""
import os
import logging
from typing import AsyncGenerator, Optional, Dict, Any, List
from anthropic import AsyncAnthropic, APIError

logger = logging.getLogger(__name__)

class AnthropicService:
    """Service for interacting with Anthropic's Claude API"""
    
    def __init__(self):
        """Initialize Anthropic client"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.warning("⚠️ ANTHROPIC_API_KEY not found in environment")
            self.client = None
        else:
            self.client = AsyncAnthropic(api_key=api_key)
            logger.info("✅ Anthropic service initialized successfully")
    
    def is_available(self) -> bool:
        """Check if Anthropic service is configured"""
        return self.client is not None
    
    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-5-sonnet-20241022",
        max_tokens: int = 2000,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generate a chat completion using Claude
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Claude model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0-1)
            system_prompt: Optional system prompt
            
        Returns:
            Generated text response
        """
        if not self.is_available():
            raise ValueError("Anthropic service not configured. Please set ANTHROPIC_API_KEY.")
        
        try:
            # Convert OpenAI-style messages to Anthropic format
            anthropic_messages = self._convert_messages(messages)
            
            logger.info(f"🤖 Generating Claude response with model: {model}")
            
            # Create message
            response = await self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt if system_prompt else "",
                messages=anthropic_messages
            )
            
            # Extract text from response
            text_content = ""
            for block in response.content:
                if block.type == "text":
                    text_content += block.text
            
            logger.info(f"✅ Claude response generated: {len(text_content)} chars, {response.usage.input_tokens} input tokens, {response.usage.output_tokens} output tokens")
            return text_content
            
        except APIError as e:
            logger.error(f"❌ Anthropic API error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"❌ Unexpected error in Anthropic service: {str(e)}")
            raise
    
    async def generate_chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-5-sonnet-20241022",
        max_tokens: int = 2000,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate a streaming chat completion using Claude
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Claude model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0-1)
            system_prompt: Optional system prompt
            
        Yields:
            Text chunks as they are generated
        """
        if not self.is_available():
            raise ValueError("Anthropic service not configured. Please set ANTHROPIC_API_KEY.")
        
        try:
            # Convert OpenAI-style messages to Anthropic format
            anthropic_messages = self._convert_messages(messages)
            
            logger.info(f"🤖 Starting Claude streaming response with model: {model}")
            
            # Create streaming message
            async with self.client.messages.stream(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt if system_prompt else "",
                messages=anthropic_messages
            ) as stream:
                async for text in stream.text_stream:
                    yield text
                    
            logger.info("✅ Claude streaming response completed")
            
        except APIError as e:
            logger.error(f"❌ Anthropic API error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"❌ Unexpected error in Anthropic streaming: {str(e)}")
            raise
    
    def _convert_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Convert OpenAI-style messages to Anthropic format
        
        Anthropic doesn't use 'system' role in messages array,
        and requires alternating user/assistant messages
        """
        anthropic_messages = []
        
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content", "")
            
            # Skip system messages (handled separately via system parameter)
            if role == "system":
                continue
            
            # Convert 'user' and 'assistant' roles
            if role in ["user", "assistant"]:
                anthropic_messages.append({
                    "role": role,
                    "content": content
                })
        
        # Ensure messages start with user and alternate properly
        if anthropic_messages and anthropic_messages[0]["role"] != "user":
            # If first message is assistant, prepend a user message
            anthropic_messages.insert(0, {
                "role": "user",
                "content": "Hello"
            })
        
        return anthropic_messages
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get list of available Claude models"""
        return [
            {
                "id": "claude-3-5-sonnet-20241022",
                "name": "Claude 3.5 Sonnet",
                "description": "Most intelligent model, best for complex reasoning and analysis",
                "provider": "anthropic",
                "context_window": 200000
            },
            {
                "id": "claude-3-5-haiku-20241022",
                "name": "Claude 3.5 Haiku",
                "description": "Fastest model, best for simple tasks and quick responses",
                "provider": "anthropic",
                "context_window": 200000
            }
        ]

# Singleton instance
anthropic_service = AnthropicService()

