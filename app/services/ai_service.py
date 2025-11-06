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
        base_prompt = """You are TAI (Tanzania AI), a highly intelligent and friendly AI assistant specialized in programming, software development, and general assistance.

        Your personality:
        - Conversational and natural, like ChatGPT
        - Professional yet approachable
        - Patient and encouraging with beginners
        - Knowledgeable and precise with experts
        - Context-aware and adaptive to user needs

        Your capabilities:
        1. **Code Assistance**: Generate, debug, explain, and optimize code in any language
        2. **Technical Guidance**: Best practices, architecture, algorithms, data structures
        3. **Content Creation**: Write documentation, blogs, emails, summaries, translations
        4. **Problem Solving**: Debug issues, suggest solutions, optimize performance
        5. **Learning Support**: Teach concepts, explain topics, provide examples
        6. **Personal Assistant**: Help with tasks, provide recommendations, answer questions

        When responding:
        - Be conversational and human-like
        - Remember context from the conversation
        - Ask clarifying questions when needed
        - Provide code examples with proper syntax highlighting
        - Explain your reasoning step-by-step
        - Offer alternatives and best practices
        - Be concise but thorough
        - Use markdown formatting for better readability
        - Include emojis sparingly for friendly tone

        When providing code:
        - Use proper syntax highlighting with language tags
        - Include helpful comments
        - Show complete, runnable examples
        - Explain the logic and approach
        - Suggest improvements or alternatives
        - Mention potential edge cases"""
        
        if programming_language:
            language_specific = f"""

        Current context: {programming_language} development
        - Prioritize {programming_language}-specific solutions
        - Follow {programming_language} idioms and conventions
        - Reference popular {programming_language} libraries/frameworks
        - Consider {programming_language} version compatibility"""
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
    
    # ==== Content Generation Features ====
    
    async def generate_blog_post(self, topic: str, tone: str = "professional", length: str = "medium") -> str:
        """
        Generate a blog post on a given topic
        """
        prompt = f"""Write a {tone} blog post about: {topic}

Length: {length} (short=~300 words, medium=~600 words, long=~1000 words)

Include:
- Engaging introduction
- Well-structured main points
- Relevant examples
- Conclusion with key takeaways

Make it informative and engaging."""
        return await self.generate_response(prompt)
    
    async def write_email(self, purpose: str, recipient: str, tone: str = "professional") -> str:
        """
        Generate an email for a specific purpose
        """
        prompt = f"""Write a {tone} email for the following purpose:

Purpose: {purpose}
Recipient: {recipient}

Include:
- Appropriate subject line
- Professional greeting
- Clear message body
- Proper closing

Format it properly with clear sections."""
        return await self.generate_response(prompt)
    
    async def summarize_text(self, text: str, length: str = "short") -> str:
        """
        Summarize long text into key points
        """
        prompt = f"""Summarize the following text into {length} format:

{text}

Provide:
- Key points as bullet points
- Main conclusions
- Important details

Keep it clear and concise."""
        return await self.generate_response(prompt)
    
    async def translate_text(self, text: str, target_language: str) -> str:
        """
        Translate text to target language
        """
        prompt = f"""Translate the following text to {target_language}:

{text}

Provide a natural, accurate translation that preserves the meaning and tone."""
        return await self.generate_response(prompt)
    
    async def generate_product_description(self, product_name: str, features: list, target_audience: str) -> str:
        """
        Generate compelling product description
        """
        features_text = "\n".join([f"- {feature}" for feature in features])
        prompt = f"""Create a compelling product description for:

Product: {product_name}
Target Audience: {target_audience}

Features:
{features_text}

Make it engaging, highlight benefits, and include a call-to-action."""
        return await self.generate_response(prompt)
    
    # ==== Personal Assistant Features ====
    
    async def create_todo_list(self, task_description: str) -> str:
        """
        Create a structured todo list from task description
        """
        prompt = f"""Based on this task description, create a detailed todo list:

{task_description}

Format as:
1. [  ] Task 1
2. [  ] Task 2
etc.

Break down complex tasks into manageable steps."""
        return await self.generate_response(prompt)
    
    async def provide_recommendations(self, query: str, context: str = "") -> str:
        """
        Provide personalized recommendations
        """
        context_text = f"\nContext: {context}" if context else ""
        prompt = f"""Provide thoughtful recommendations for:

{query}{context_text}

Include:
- Multiple options with pros/cons
- Reasoning for each recommendation
- Best practices or tips"""
        return await self.generate_response(prompt)
    
    async def answer_knowledge_question(self, question: str) -> str:
        """
        Answer general knowledge questions
        """
        prompt = f"""Answer this question comprehensively:

{question}

Provide:
- Clear, accurate answer
- Relevant context or background
- Examples if helpful
- Sources or references when applicable"""
        return await self.generate_response(prompt)
    
    async def plan_schedule(self, tasks: list, duration: str, priority: str = "balanced") -> str:
        """
        Create a schedule from list of tasks
        """
        tasks_text = "\n".join([f"- {task}" for task in tasks])
        prompt = f"""Create a {duration} schedule with {priority} priority for these tasks:

{tasks_text}

Format as a clear timeline with:
- Time slots
- Task assignments
- Break periods
- Buffer time for unexpected items"""
        return await self.generate_response(prompt)
    
    async def brainstorm_ideas(self, topic: str, count: int = 10) -> str:
        """
        Generate creative ideas for a topic
        """
        prompt = f"""Brainstorm {count} creative ideas for: {topic}

For each idea provide:
1. Brief title/name
2. Short description
3. Why it's valuable

Make them diverse and innovative."""
        return await self.generate_response(prompt)

# Global AI service instance
ai_service = AIService()