'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Sparkles, Code, Bug, Book, Briefcase, Menu, X, Globe, Settings, Home, Wrench, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import './animations.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
}

type Language = 'en' | 'sw';

interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}

export default function ChatPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Translations
  const translations: Translations = {
    appName: { en: 'TAI Chat', sw: 'TAI Mazungumzo' },
    appDesc: { en: 'AI-Powered Developer Assistant', sw: 'Msaidizi wa AI kwa Watengenezaji' },
    welcomeTitle: { en: "Hi! I'm TAI, your AI developer assistant.", sw: "Habari! Mimi ni TAI, msaidizi wako wa AI." },
    welcomeCode: { en: 'Code Generation - Create code in any language', sw: 'Kutengeneza Msimbo - Unda msimbo kwa lugha yoyote' },
    welcomeDebug: { en: 'Debugging - Find and fix bugs', sw: 'Kurekebisha - Tafuta na urekebishe hitilafu' },
    welcomeAPI: { en: 'API Documentation - Learn about APIs', sw: 'Nyaraka za API - Jifunze kuhusu API' },
    welcomeCLI: { en: 'CLI Commands - Get command-line help', sw: 'Amri za CLI - Pata msaada wa mstari wa amri' },
    welcomePortfolio: { en: 'Portfolio Building - Create your resume', sw: 'Kujenga Portfolio - Unda CV yako' },
    welcomeQuestion: { en: 'What would you like to work on today?', sw: 'Ungependa kufanya nini leo?' },
    placeholder: { en: 'Ask me anything... (Shift+Enter for new line)', sw: 'Niulize chochote... (Shift+Enter kwa mstari mpya)' },
    helpText: { en: 'TAI can help with code generation, debugging, API docs, CLI commands, and portfolios', sw: 'TAI inaweza kusaidia kutengeneza msimbo, kurekebisha, nyaraka za API, amri za CLI, na portfolio' },
    home: { en: 'Home', sw: 'Nyumbani' },
    tools: { en: 'Tools', sw: 'Zana' },
    chat: { en: 'Chat', sw: 'Mazungumzo' },
    settings: { en: 'Settings', sw: 'Mipangilio' },
    language: { en: 'Language', sw: 'Lugha' },
    english: { en: 'English', sw: 'Kiingereza' },
    swahili: { en: 'Swahili', sw: 'Kiswahili' },
    codeGeneration: { en: 'Code Generation', sw: 'Kutengeneza Msimbo' },
    debugging: { en: 'Debugging', sw: 'Kurekebisha' },
    apiHelp: { en: 'API Help', sw: 'Msaada wa API' },
    cliHelp: { en: 'CLI Help', sw: 'Msaada wa CLI' },
    portfolio: { en: 'Portfolio', sw: 'Portfolio' },
    general: { en: 'General', sw: 'Jumla' },
    copy: { en: 'Copy', sw: 'Nakili' },
    copied: { en: 'Copied!', sw: 'Imenakiliwa!' },
  };

  const t = (key: string) => translations[key]?.[language] || key;

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `${t('welcomeTitle')}\n\n• **${t('welcomeCode')}**\n• **${t('welcomeDebug')}**\n• **${t('welcomeAPI')}**\n• **${t('welcomeCLI')}**\n• **${t('welcomePortfolio')}**\n\n${t('welcomeQuestion')}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const detectContext = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('write')) {
      return 'code_generation';
    }
    if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
      return 'debugging';
    }
    if (lowerMessage.includes('api') || lowerMessage.includes('endpoint') || lowerMessage.includes('request')) {
      return 'api_help';
    }
    if (lowerMessage.includes('command') || lowerMessage.includes('cli') || lowerMessage.includes('terminal')) {
      return 'cli_help';
    }
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return 'portfolio';
    }
    
    return 'general';
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const context = detectContext(input.trim());

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context,
          conversation_history: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        context,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getContextIcon = (context?: string) => {
    switch (context) {
      case 'code_generation':
        return <Code className="w-4 h-4" />;
      case 'debugging':
        return <Bug className="w-4 h-4" />;
      case 'api_help':
        return <Book className="w-4 h-4" />;
      case 'portfolio':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getContextLabel = (context?: string) => {
    switch (context) {
      case 'code_generation':
        return t('codeGeneration');
      case 'debugging':
        return t('debugging');
      case 'api_help':
        return t('apiHelp');
      case 'cli_help':
        return t('cliHelp');
      case 'portfolio':
        return t('portfolio');
      default:
        return t('general');
    }
  };

  const formatMessage = (content: string) => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim() || 'plaintext';
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-3 sm:my-4 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider truncate">{language}</span>
              </div>
              <button
                onClick={() => copyToClipboard(code, `code-${index}`)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white transition-all text-[10px] sm:text-xs flex-shrink-0"
              >
                {copiedId === `code-${index}` ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                    <span className="text-green-400 hidden xs:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-900 p-3 sm:p-4 overflow-x-auto">
              <code className="text-xs sm:text-sm text-gray-300 font-mono leading-relaxed">{code}</code>
            </pre>
          </div>
        );
      }
      
      // Handle inline code
      const textParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={index}>
          {textParts.map((textPart, i) => {
            if (textPart.startsWith('`') && textPart.endsWith('`')) {
              return (
                <code key={i} className="bg-gray-800 text-blue-400 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-all">
                  {textPart.slice(1, -1)}
                </code>
              );
            }
            // Handle bold text
            const boldParts = textPart.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((boldPart, j) => {
              if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                return <strong key={j}>{boldPart.slice(2, -2)}</strong>;
              }
              return boldPart;
            });
          })}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Professional Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform active:scale-95 sm:group-hover:scale-110 transition-transform duration-200">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                  {t('appName')}
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate hidden xs:block">{t('appDesc')}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3 md:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
              >
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </Link>
              <Link
                href="/tools"
                className="px-3 md:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
              >
                <Wrench className="w-4 h-4" />
                <span>{t('tools')}</span>
              </Link>
              <Link
                href="/chat"
                className="px-3 md:px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('chat')}</span>
              </Link>

              {/* Language Selector */}
              <div className="relative group">
                <button className="px-3 md:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4" />
                  <span className="hidden lg:inline">{language === 'en' ? t('english') : t('swahili')}</span>
                  <span className="lg:hidden">{language === 'en' ? '🇬🇧' : '🇹🇿'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-44 md:w-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg flex items-center gap-2 md:gap-3 text-sm ${
                      language === 'en' ? 'text-blue-400 bg-gray-700/50' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg md:text-xl">🇬🇧</span>
                    <span>{t('english')}</span>
                  </button>
                  <button
                    onClick={() => setLanguage('sw')}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-left hover:bg-gray-700 transition-colors last:rounded-b-lg flex items-center gap-2 md:gap-3 text-sm ${
                      language === 'sw' ? 'text-blue-400 bg-gray-700/50' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg md:text-xl">🇹🇿</span>
                    <span>{t('swahili')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-xl border-t border-gray-700">
            <div className="px-3 py-2 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 text-sm active:scale-98"
              >
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </Link>
              <Link
                href="/tools"
                className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 text-sm active:scale-98"
              >
                <Wrench className="w-4 h-4" />
                <span>{t('tools')}</span>
              </Link>
              <Link
                href="/chat"
                className="block px-3 py-2.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-2.5 text-sm active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('chat')}</span>
              </Link>

              {/* Language Options */}
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="px-3 py-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                  {t('language')}
                </div>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-center gap-2.5 text-sm active:scale-98 ${
                    language === 'en'
                      ? 'text-blue-400 bg-blue-600/20 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">🇬🇧</span>
                  <span>{t('english')}</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('sw');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-center gap-2.5 text-sm active:scale-98 ${
                    language === 'sw'
                      ? 'text-blue-400 bg-blue-600/20 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">🇹🇿</span>
                  <span>{t('swahili')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Messages */}
      <div className="pt-20 pb-32 px-3 sm:px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 md:gap-4 ${
                message.role === 'user' ? 'flex-row-reverse message-user' : 'flex-row message-assistant'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}
              >
                {message.role === 'user' ? (
                  <span className="text-white text-xs sm:text-sm font-semibold">U</span>
                ) : (
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                )}
              </div>

              {/* Message */}
              <div
                className={`flex-1 min-w-0 ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {/* Context Badge */}
                  {message.role === 'assistant' && message.context && message.context !== 'general' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 pb-2 border-b border-gray-700">
                      <div className="flex-shrink-0">
                        {getContextIcon(message.context)}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 truncate">{getContextLabel(message.context)}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-invert prose-sm max-w-none text-sm sm:text-base">
                    <div className="whitespace-pre-wrap break-words overflow-x-auto">
                      {formatMessage(message.content)}
                    </div>
                  </div>

                  {/* Timestamp & Actions */}
                  <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-gray-700/50 gap-2">
                    <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 flex-shrink-0"
                        title={copiedId === message.id ? t('copied') : t('copy')}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span className="text-[10px] sm:text-xs">{t('copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px] sm:text-xs hidden sm:inline">{t('copy')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 md:gap-4 message-assistant">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/50">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-blue-500/20 shadow-xl">
                <div className="flex gap-1.5 sm:gap-2 items-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full typing-dot shadow-lg shadow-blue-500/50" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-500 rounded-full typing-dot shadow-lg shadow-purple-500/50" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-pink-500 rounded-full typing-dot shadow-lg shadow-pink-500/50" />
                  <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-gray-400">TAI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent pb-safe">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="bg-gradient-to-r from-gray-800 to-gray-800 rounded-xl sm:rounded-2xl border border-blue-500/20 shadow-2xl hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none min-h-[24px] max-h-[120px] sm:max-h-[200px] py-2 px-1 sm:px-2 text-sm sm:text-base"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="relative group flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 active:scale-95 sm:hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 px-2">
            {t('helpText')}
          </p>
        </div>
      </div>
    </div>
  );
}
