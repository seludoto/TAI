import httpx
from typing import Optional, Dict, Any
from ..config import settings

class AIService:
    def __init__(self):
        # Support both Ollama (local) and DigitalOcean GenAI (cloud)
        self.ai_provider = getattr(settings, 'AI_PROVIDER', 'ollama')  # 'ollama' or 'digitalocean'
        
        # Ollama settings
        self.ollama_base_url = getattr(settings, 'OLLAMA_BASE_URL', 'http://localhost:11434')
        self.ollama_model = getattr(settings, 'OLLAMA_MODEL', 'mistral')
        
        # DigitalOcean GenAI settings
        self.do_api_key = getattr(settings, 'DIGITALOCEAN_API_KEY', None)
        self.do_base_url = 'https://api.digitalocean.com/v2/genai'
        self.do_model = getattr(settings, 'DIGITALOCEAN_MODEL', 'meta-llama/llama-3.1-8b-instruct')
        
        # Initialize HTTP client with longer timeout for AI operations
        self.client = httpx.AsyncClient(timeout=120.0)
    
    async def generate_response(
        self, 
        user_message: str, 
        programming_language: Optional[str] = None,
        conversation_history: Optional[list] = None
    ) -> str:
        """
        Generate AI response for user message using configured AI provider
        """
        try:
            if self.ai_provider == 'digitalocean' and self.do_api_key:
                return await self._generate_with_digitalocean(
                    user_message, programming_language, conversation_history
                )
            else:
                return await self._generate_with_ollama(
                    user_message, programming_language, conversation_history
                )
        except Exception as e:
            print(f"Error generating AI response: {e}")
            # Fallback to mock response when AI is not available
            return self._generate_mock_response(user_message, programming_language)
    
    async def _generate_with_digitalocean(
        self,
        user_message: str,
        programming_language: Optional[str] = None,
        conversation_history: Optional[list] = None
    ) -> str:
        """
        Generate response using DigitalOcean GenAI API
        """
        try:
            system_prompt = self._build_system_prompt(programming_language)
            
            # Build messages array for DigitalOcean API
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history[-10:])  # Keep last 10 messages
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            # Call DigitalOcean GenAI API
            headers = {
                "Authorization": f"Bearer {self.do_api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(
                f"{self.do_base_url}/chat/completions",
                headers=headers,
                json={
                    "model": self.do_model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 2000,
                    "top_p": 0.9
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                print(f"DigitalOcean API error: {response.status_code} - {response.text}")
                # Fallback to Ollama if DigitalOcean fails
                return await self._generate_with_ollama(
                    user_message, programming_language, conversation_history
                )
                
        except Exception as e:
            print(f"DigitalOcean GenAI error: {e}")
            # Fallback to Ollama
            return await self._generate_with_ollama(
                user_message, programming_language, conversation_history
            )
    
    async def _generate_with_ollama(
        self,
        user_message: str,
        programming_language: Optional[str] = None,
        conversation_history: Optional[list] = None
    ) -> str:
        """
        Generate response using Ollama (local LLM)
        """
        try:
            system_prompt = self._build_system_prompt(programming_language)
            
            # Build conversation context
            context = system_prompt + "\n\n"
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                    if role == "user":
                        context += f"User: {content}\n"
                    elif role == "assistant":
                        context += f"Assistant: {content}\n"
            
            # Add current user message
            context += f"User: {user_message}\nAssistant:"
            
            # Call Ollama API
            response = await self.client.post(
                f"{self.ollama_base_url}/api/generate",
                json={
                    "model": self.ollama_model,
                    "prompt": context,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 1000,  # Limit response length
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                print(f"Ollama API error: {response.status_code} - {response.text}")
                # Fallback to mock response when Ollama is not available
                return self._generate_mock_response(user_message, programming_language)
            
        except Exception as e:
            print(f"Ollama error: {e}")
            # Fallback to mock response when Ollama is not available
            return self._generate_mock_response(user_message, programming_language)
    
    def _generate_mock_response(self, user_message: str, programming_language: Optional[str] = None) -> str:
        """
        Generate a mock AI response when Ollama is not available
        """
        language_specific_responses = {
            "python": f"Here's a Python solution for your question: '{user_message}'\n\n```python\n# Example Python code\nprint('Hello from TAI!')\n# Your implementation would go here\n```\n\nThis is a mock response since the AI model is not available. Please install and configure Ollama with the Mistral model for full AI functionality.",
            "javascript": f"Here's a JavaScript solution for your question: '{user_message}'\n\n```javascript\n// Example JavaScript code\nconsole.log('Hello from TAI!');\n// Your implementation would go here\n```\n\nThis is a mock response since the AI model is not available. Please install and configure Ollama with the Mistral model for full AI functionality.",
            "typescript": f"Here's a TypeScript solution for your question: '{user_message}'\n\n```typescript\n// Example TypeScript code\nconst message: string = 'Hello from TAI!';\nconsole.log(message);\n// Your implementation would go here\n```\n\nThis is a mock response since the AI model is not available. Please install and configure Ollama with the Mistral model for full AI functionality."
        }
        
        if programming_language and programming_language.lower() in language_specific_responses:
            return language_specific_responses[programming_language.lower()]
        
        return f"Thank you for your question: '{user_message}'\n\nI'm TAI, your AI programming assistant. Currently, I'm running in demo mode because the Ollama AI model is not available.\n\nTo get full AI functionality:\n1. Ensure Ollama is installed and running\n2. Download the Mistral model: `ollama pull mistral`\n3. Start the Ollama service: `ollama serve`\n\nFor now, I can help with basic programming questions and provide code templates!"
    
    def _build_system_prompt(self, programming_language: Optional[str] = None) -> str:
        """
        Build system prompt based on programming language context
        """
        base_prompt = """You are TAI, an AI assistant specialized in programming and software development. 
        You help developers with coding questions, debugging, best practices, and technical guidance.
        
        Key characteristics:
        - Provide clear, accurate, and helpful responses
        - Include code examples when relevant
        - Explain concepts step by step
        - Suggest best practices and modern approaches
        - Be concise but comprehensive
        - Support multiple programming languages
        
        When providing code:
        - Use proper syntax highlighting
        - Include comments for clarity
        - Show complete, runnable examples
        - Explain what the code does and why it's structured that way"""
        
        if programming_language:
            language_specific = f"""
            
            Current focus: {programming_language} development
            - Provide {programming_language}-specific solutions and patterns
            - Follow {programming_language} best practices and conventions
            - Reference relevant {programming_language} libraries and frameworks when appropriate"""
            base_prompt += language_specific
        
        return base_prompt
    
    async def explain_code(self, code: str, programming_language: str) -> str:
        """
        Provide detailed explanation of code snippet
        """
        prompt = f"Please explain this {programming_language} code in detail:\n\n``` {programming_language}\n{code}\n```"
        return await self.generate_response(prompt, programming_language)
    
    async def debug_code(self, code: str, error_message: str, programming_language: str) -> str:
        """
        Help debug code based on error message
        """
        prompt = f"I have this {programming_language} code that's producing an error:\n\nCode:\n``` {programming_language}\n{code}\n```\n\nError:\n{error_message}\n\nPlease help me debug this issue."
        return await self.generate_response(prompt, programming_language)
    
    async def generate_code_template(self, description: str, programming_language: str) -> str:
        """
        Generate code template based on description
        """
        prompt = f"Generate a {programming_language} code template for: {description}\n\nProvide a complete, well-structured example with comments."
        return await self.generate_response(prompt, programming_language)

# Global AI service instance
ai_service = AIService()