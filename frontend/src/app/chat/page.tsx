'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, Copy, Check, Sparkles, Code, Bug, Book, Briefcase, Menu, X, Globe, 
  Settings, Home, Wrench, User, Mail, FileText, Languages, ListTodo,
  Lightbulb, Calendar, HelpCircle, Wand2, Bot, Mic, MicOff, Sun, Moon, Download,
  Share2, ThumbsUp, ThumbsDown, Trash2, Pin, Search
} from 'lucide-react';
import Link from 'next/link';
import './animations.css';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
  liked?: boolean;
  disliked?: boolean;
  pinned?: boolean;
}

type Language = 'en' | 'sw';

type FeatureMode = 'chat' | 'blog' | 'email' | 'summary' | 'translate' | 'todo' | 'recommend' | 'knowledge' | 'schedule' | 'brainstorm';

type Theme = 'dark' | 'light';

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
  const [featureMode, setFeatureMode] = useState<FeatureMode>('chat');
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<Array<{id: string, title: string, lastMessage: string, timestamp: Date}>>([]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Translations
  const translations: Translations = {
    appName: { en: 'TAI', sw: 'TAI' },
    appDesc: { en: 'Your Intelligent AI Assistant', sw: 'Msaidizi Wako Mahiri wa AI' },
    welcomeTitle: { en: "👋 Hi! I'm TAI, your intelligent AI assistant.", sw: "👋 Habari! Mimi ni TAI, msaidizi wako mahiri wa AI." },
    welcomeCode: { en: '💻 Code Generation - Write code in any language', sw: '💻 Kutengeneza Msimbo - Andika msimbo kwa lugha yoyote' },
    welcomeDebug: { en: '🐛 Debugging - Find and fix bugs instantly', sw: '🐛 Kurekebisha - Tafuta na urekebishe hitilafu haraka' },
    welcomeAPI: { en: '📚 API Help - Learn about any API', sw: '📚 Msaada wa API - Jifunze kuhusu API yoyote' },
    welcomeCLI: { en: '⌨️ CLI Commands - Master command-line tools', sw: '⌨️ Amri za CLI - Bingwa wa zana za mstari wa amri' },
    welcomePortfolio: { en: '💼 Portfolio Building - Create stunning resumes', sw: '💼 Kujenga Portfolio - Unda CV nzuri' },
    welcomeBlog: { en: '✍️ Blog Writing - Generate engaging articles', sw: '✍️ Kuandika Makala - Tengeneza makala za kuvutia' },
    welcomeEmail: { en: '📧 Email Writing - Craft professional emails', sw: '📧 Kuandika Barua Pepe - Unda barua pepe za kitaaluma' },
    welcomeSummary: { en: '📝 Text Summarization - Condense long content', sw: '📝 Muhtasari wa Maandishi - Punguza maudhui marefu' },
    welcomeTranslate: { en: '🌍 Translation - Translate to any language', sw: '🌍 Tafsiri - Tafsiri kwa lugha yoyote' },
    welcomeTodo: { en: '✅ To-Do Lists - Organize your tasks', sw: '✅ Orodha za Kufanya - Panga kazi zako' },
    welcomeQuestion: { en: 'What can I help you with today?', sw: 'Ninaweza kukusaidia vipi leo?' },
    placeholder: { en: 'Message TAI... (Shift+Enter for new line)', sw: 'Tuma ujumbe kwa TAI... (Shift+Enter kwa mstari mpya)' },
    helpText: { en: 'TAI can assist with coding, writing, research, planning, and much more', sw: 'TAI inaweza kusaidia na msimbo, uandishi, utafiti, mipango, na mengi zaidi' },
    home: { en: 'Home', sw: 'Nyumbani' },
    tools: { en: 'Tools', sw: 'Zana' },
    chat: { en: 'Chat', sw: 'Mazungumzo' },
    features: { en: 'Features', sw: 'Vipengele' },
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
    newChat: { en: 'New Chat', sw: 'Mazungumzo Mapya' },
    blogPost: { en: 'Blog Post', sw: 'Chapisho la Blogi' },
    emailWriter: { en: 'Email Writer', sw: 'Mwandishi wa Barua Pepe' },
    summarize: { en: 'Summarize', sw: 'Fupisha' },
    translate: { en: 'Translate', sw: 'Tafsiri' },
    todoList: { en: 'To-Do List', sw: 'Orodha ya Kufanya' },
    recommend: { en: 'Get Recommendations', sw: 'Pata Mapendekezo' },
    knowledge: { en: 'Ask Questions', sw: 'Uliza Maswali' },
    schedule: { en: 'Plan Schedule', sw: 'Panga Ratiba' },
    brainstorm: { en: 'Brainstorm Ideas', sw: 'Tafakari Mawazo' },
    conversationHistory: { en: 'Conversation History', sw: 'Historia ya Mazungumzo' },
    today: { en: 'Today', sw: 'Leo' },
    yesterday: { en: 'Yesterday', sw: 'Jana' },
    lastWeek: { en: 'Last Week', sw: 'Wiki Iliyopita' },
    older: { en: 'Older', sw: 'Ya Zamani' },
    deleteConversation: { en: 'Delete', sw: 'Futa' },
    clearAll: { en: 'Clear All', sw: 'Futa Yote' },
    exportChat: { en: 'Export Chat', sw: 'Hamisha Mazungumzo' },
    regenerate: { en: 'Regenerate', sw: 'Tengeneza Tena' },
    stop: { en: 'Stop', sw: 'Simama' },
    examples: { en: 'Examples', sw: 'Mifano' },
    capabilities: { en: 'Capabilities', sw: 'Uwezo' },
    limitations: { en: 'Limitations', sw: 'Mipaka' },
    darkMode: { en: 'Dark Mode', sw: 'Mandhari Meusi' },
    lightMode: { en: 'Light Mode', sw: 'Mandhari Mwangaza' },
    voiceInput: { en: 'Voice Input', sw: 'Sauti ya Kuingiza' },
    listening: { en: 'Listening...', sw: 'Sikiliza...' },
    share: { en: 'Share', sw: 'Shiriki' },
    edit: { en: 'Edit', sw: 'Hariri' },
    delete: { en: 'Delete', sw: 'Futa' },
    pin: { en: 'Pin', sw: 'Bandika' },
    unpin: { en: 'Unpin', sw: 'Ondoa Bandiko' },
    search: { en: 'Search messages...', sw: 'Tafuta ujumbe...' },
    settingsTitle: { en: 'Settings', sw: 'Mipangilio' },
    appearance: { en: 'Appearance', sw: 'Muonekano' },
    voiceSettings: { en: 'Voice Settings', sw: 'Mipangilio ya Sauti' },
    exportData: { en: 'Export Data', sw: 'Hamisha Data' },
  };

  const t = (key: string) => translations[key]?.[language] || key;

  // Example prompts for quick start
  const examplePrompts = [
    { icon: '💻', text: language === 'en' ? 'Write a Python function to sort a list' : 'Andika function ya Python kusafisha orodha', category: 'code_generation' },
    { icon: '🐛', text: language === 'en' ? 'Debug my JavaScript error' : 'Rekebisha hitilafu yangu ya JavaScript', category: 'debugging' },
    { icon: '✍️', text: language === 'en' ? 'Write a professional email' : 'Andika barua pepe ya kitaaluma', category: 'email' },
    { icon: '🌍', text: language === 'en' ? 'Translate this to Spanish' : 'Tafsiri hii kwa Kihispania', category: 'translate' },
  ];

  // Feature icons mapping
  const featureIcons: Record<FeatureMode, React.ReactNode> = {
    chat: <Sparkles className="w-4 h-4" />,
    blog: <FileText className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    summary: <Book className="w-4 h-4" />,
    translate: <Languages className="w-4 h-4" />,
    todo: <ListTodo className="w-4 h-4" />,
    recommend: <Lightbulb className="w-4 h-4" />,
    knowledge: <HelpCircle className="w-4 h-4" />,
    schedule: <Calendar className="w-4 h-4" />,
    brainstorm: <Wand2 className="w-4 h-4" />,
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `${t('welcomeTitle')}\n\n**Core Features:**\n• ${t('welcomeCode')}\n• ${t('welcomeDebug')}\n• ${t('welcomeAPI')}\n• ${t('welcomeCLI')}\n• ${t('welcomePortfolio')}\n\n**Content & Writing:**\n• ${t('welcomeBlog')}\n• ${t('welcomeEmail')}\n• ${t('welcomeSummary')}\n• ${t('welcomeTranslate')}\n\n**Personal Assistant:**\n• ${t('welcomeTodo')}\n\n${t('welcomeQuestion')} 🚀`,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: New chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `${t('welcomeTitle')}\n\n**Core Features:**\n• ${t('welcomeCode')}\n• ${t('welcomeDebug')}\n• ${t('welcomeAPI')}\n• ${t('welcomeCLI')}\n• ${t('welcomePortfolio')}\n\n**Content & Writing:**\n• ${t('welcomeBlog')}\n• ${t('welcomeEmail')}\n• ${t('welcomeSummary')}\n• ${t('welcomeTranslate')}\n\n**Personal Assistant:**\n• ${t('welcomeTodo')}\n\n${t('welcomeQuestion')} 🚀`,
          timestamp: new Date(),
        }]);
      }
      // Cmd/Ctrl + B: Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
      // Escape: Close sidebar on mobile
      if (e.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [language, showSidebar]);

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

  const handleExampleClick = (exampleText: string) => {
    setInput(exampleText);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'You' : 'TAI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition || (window as unknown as { SpeechRecognition: new () => SpeechRecognition }).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'sw-TZ';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleMessageReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        if (reaction === 'like') {
          return { ...msg, liked: !msg.liked, disliked: false };
        } else {
          return { ...msg, disliked: !msg.disliked, liked: false };
        }
      }
      return msg;
    }));
  };

  const togglePin = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'TAI Chat Message',
        text: content,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(content, 'share');
      });
    } else {
      copyToClipboard(content, 'share');
    }
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
      const response = await fetch(`${API_URL}/api/chat/general`, {
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
          <div key={index} className="my-4 rounded-xl overflow-hidden bg-black border border-gray-800">
            <div className="flex items-center justify-between bg-gray-900 px-4 py-2.5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-mono">{language}</span>
              </div>
              <button
                onClick={() => copyToClipboard(code, `code-${index}`)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-xs"
              >
                {copiedId === `code-${index}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-black p-4 overflow-x-auto">
              <code className="text-sm text-gray-300 font-mono leading-relaxed">{code}</code>
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
                <code key={i} className="bg-gray-800/60 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-sm">
                  {textPart.slice(1, -1)}
                </code>
              );
            }
            // Handle bold text
            const boldParts = textPart.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((boldPart, j) => {
              if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                return <strong key={j} className="font-semibold text-white">{boldPart.slice(2, -2)}</strong>;
              }
              return boldPart;
            });
          })}
        </span>
      );
    });
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'
    }`}>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('settingsTitle')}
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Appearance */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {t('appearance')}
                  </h3>
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {theme === 'dark' ? t('darkMode') : t('lightMode')}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {theme === 'dark' ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>

                {/* Voice Settings */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {t('voiceSettings')}
                  </h3>
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Voice input is {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? 'available' : 'not supported'} in your browser
                    </p>
                  </div>
                </div>

                {/* Export */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {t('exportData')}
                  </h3>
                  <button
                    onClick={() => {
                      exportChat();
                      setShowSettings(false);
                    }}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {t('exportChat')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Conversation History */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-300 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={() => {
                setMessages([{
                  id: '1',
                  role: 'assistant',
                  content: `${t('welcomeTitle')}\n\n**Core Features:**\n• ${t('welcomeCode')}\n• ${t('welcomeDebug')}\n• ${t('welcomeAPI')}\n• ${t('welcomeCLI')}\n• ${t('welcomePortfolio')}\n\n**Content & Writing:**\n• ${t('welcomeBlog')}\n• ${t('welcomeEmail')}\n• ${t('welcomeSummary')}\n• ${t('welcomeTranslate')}\n\n**Personal Assistant:**\n• ${t('welcomeTodo')}\n\n${t('welcomeQuestion')} 🚀`,
                  timestamp: new Date(),
                }]);
                setShowSidebar(false);
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">{t('newChat')}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <div className={`relative rounded-lg ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
            } border`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg outline-none ${
                  theme === 'dark' 
                    ? 'bg-transparent text-gray-200 placeholder-gray-500' 
                    : 'bg-transparent text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scroll">
            <div className={`text-xs uppercase tracking-wider px-3 py-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {t('conversationHistory')}
            </div>
            {conversations.length === 0 ? (
              <div className={`text-sm text-center py-8 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all group ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`text-sm truncate ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{conv.title}</div>
                  <div className={`text-xs truncate ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>{conv.lastMessage}</div>
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className={`p-3 border-t space-y-2 ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setShowSettings(true)}
              className={`w-full px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('settings')}</span>
            </button>
            <button
              onClick={() => setConversations([])}
              className={`w-full px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('clearAll')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Navbar - More ChatGPT-like */}
        <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          theme === 'dark' 
            ? 'bg-gray-900/80 border-gray-800/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo - Simpler, more ChatGPT-like */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`lg:hidden p-2 rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 transition-all">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className={`text-lg sm:text-xl font-semibold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('appName')}
                  </h1>
                  <p className={`text-[10px] sm:text-xs truncate hidden xs:block ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{t('appDesc')}</p>
                </div>
              </div>

            {/* Desktop Navigation - Minimal ChatGPT-style */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setMessages([{
                  id: '1',
                  role: 'assistant',
                  content: `${t('welcomeTitle')}\n\n**Core Features:**\n• ${t('welcomeCode')}\n• ${t('welcomeDebug')}\n• ${t('welcomeAPI')}\n• ${t('welcomeCLI')}\n• ${t('welcomePortfolio')}\n\n**Content & Writing:**\n• ${t('welcomeBlog')}\n• ${t('welcomeEmail')}\n• ${t('welcomeSummary')}\n• ${t('welcomeTranslate')}\n\n**Personal Assistant:**\n• ${t('welcomeTodo')}\n\n${t('welcomeQuestion')} 🚀`,
                  timestamp: new Date(),
                }])}
                className={`px-3 md:px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('newChat')}</span>
              </button>

              {/* Features Dropdown */}
              <div className="relative group">
                <button className="px-3 md:px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all flex items-center gap-2 text-sm">
                  <Wand2 className="w-4 h-4" />
                  <span>{t('features')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <button onClick={() => setFeatureMode('blog')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <FileText className="w-4 h-4" />
                      <span>{t('blogPost')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('email')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span>{t('emailWriter')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('summary')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Book className="w-4 h-4" />
                      <span>{t('summarize')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('translate')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Languages className="w-4 h-4" />
                      <span>{t('translate')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('todo')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <ListTodo className="w-4 h-4" />
                      <span>{t('todoList')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('recommend')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Lightbulb className="w-4 h-4" />
                      <span>{t('recommend')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('knowledge')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <HelpCircle className="w-4 h-4" />
                      <span>{t('knowledge')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('schedule')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{t('schedule')}</span>
                    </button>
                    <button onClick={() => setFeatureMode('brainstorm')} className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-300">
                      <Wand2 className="w-4 h-4" />
                      <span>{t('brainstorm')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Selector - Minimal */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>{language === 'en' ? '🇬🇧' : '🇹🇿'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg flex items-center gap-2 text-sm ${
                      language === 'en' ? 'text-emerald-400 bg-gray-700/50' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    <span>{t('english')}</span>
                  </button>
                  <button
                    onClick={() => setLanguage('sw')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors last:rounded-b-lg flex items-center gap-2 text-sm ${
                      language === 'sw' ? 'text-emerald-400 bg-gray-700/50' : 'text-gray-300'
                    }`}
                  >
                    <span className="text-lg">🇹🇿</span>
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

      {/* Messages - ChatGPT-style centered layout */}
      <div className="flex-1 overflow-y-auto pt-20 pb-32 px-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Example Prompts and Info Cards - Show only when no messages (except welcome) */}
          {messages.length <= 1 && (
            <div className="space-y-6 mb-8">
              {/* Example Prompts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('examples')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.text, example.category)}
                      className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{example.icon}</span>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {example.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Capabilities Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">{t('capabilities')}</h4>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li>• Code generation & debugging</li>
                    <li>• Content writing & translation</li>
                    <li>• Task planning & organization</li>
                    <li>• Research & knowledge queries</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Code className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">Developer Tools</h4>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li>• Multi-language support</li>
                    <li>• API documentation help</li>
                    <li>• CLI command assistance</li>
                    <li>• Portfolio building</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200">Shortcuts</h4>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li>• <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">⌘K</kbd> New chat</li>
                    <li>• <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">⌘B</kbd> Toggle sidebar</li>
                    <li>• <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">Shift+Enter</kbd> New line</li>
                    <li>• <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">Enter</kbd> Send message</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`group ${
                message.role === 'user' ? 'message-user' : 'message-assistant'
              }`}
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Avatar - Larger, more prominent */}
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>

                {/* Message Content - Full width, cleaner */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Role Label */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-200">
                      {message.role === 'user' ? 'You' : 'TAI'}
                    </span>
                    {message.role === 'assistant' && message.context && message.context !== 'general' && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded-md border border-gray-700">
                        {getContextIcon(message.context)}
                        <span className="text-[10px] text-gray-400">{getContextLabel(message.context)}</span>
                      </div>
                    )}
                  </div>

                  {/* Content - ChatGPT-style prose */}
                  <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                    <div className="text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                      {formatMessage(message.content)}
                    </div>
                  </div>

                  {/* Actions - Subtle, appears on hover */}
                  <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                    {message.role === 'assistant' && (
                      <>
                        {/* Reactions */}
                        <button
                          onClick={() => toggleMessageReaction(message.id, 'like')}
                          className={`text-xs transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                            message.liked
                              ? theme === 'dark' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              : theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Like"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleMessageReaction(message.id, 'dislike')}
                          className={`text-xs transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                            message.disliked
                              ? theme === 'dark' ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-600'
                              : theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Dislike"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <div className={`w-px h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />

                        {/* Actions */}
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className={`text-xs transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md ${
                            theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                          title={copiedId === message.id ? t('copied') : t('copy')}
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{t('copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t('copy')}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => shareMessage(message.content)}
                          className={`text-xs transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md ${
                            theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                          title={t('share')}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            // Find the user message before this assistant message
                            const messageIndex = messages.findIndex(m => m.id === message.id);
                            if (messageIndex > 0) {
                              const userMsg = messages[messageIndex - 1];
                              if (userMsg.role === 'user') {
                                setInput(userMsg.content);
                                // Remove current message and regenerate
                                setMessages(prev => prev.slice(0, messageIndex));
                              }
                            }
                          }}
                          className={`text-xs transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md ${
                            theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t('regenerate')}</span>
                        </button>
                      </>
                    )}

                    {/* Common actions for all messages */}
                    <button
                      onClick={() => togglePin(message.id)}
                      className={`text-xs transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                        message.pinned
                          ? theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                          : theme === 'dark' ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={message.pinned ? t('unpin') : t('pin')}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className={`text-xs transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                        theme === 'dark' ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                      }`}
                      title={t('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className={`w-px h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />

                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator - ChatGPT-style */}
          {isLoading && (
            <div className="message-assistant">
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <span className="text-sm font-semibold text-gray-200">TAI</span>
                  <div className="flex gap-1.5 items-center py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full typing-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - ChatGPT-style fixed bottom input */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent border-t border-gray-800/50 lg:left-64">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          {/* Quick Actions Bar */}
          {!isLoading && messages.length > 1 && (
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
              <button
                onClick={() => setFeatureMode('blog')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 text-xs text-gray-400 hover:text-white transition-all whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('blogPost')}</span>
              </button>
              <button
                onClick={() => setFeatureMode('email')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 text-xs text-gray-400 hover:text-white transition-all whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t('emailWriter')}</span>
              </button>
              <button
                onClick={() => setFeatureMode('summary')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 text-xs text-gray-400 hover:text-white transition-all whitespace-nowrap"
              >
                <Book className="w-3.5 h-3.5" />
                <span>{t('summarize')}</span>
              </button>
              <button
                onClick={() => setFeatureMode('translate')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-emerald-500/50 text-xs text-gray-400 hover:text-white transition-all whitespace-nowrap"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{t('translate')}</span>
              </button>
            </div>
          )}

          <div className="relative bg-gray-800/50 rounded-2xl border border-gray-700 shadow-2xl hover:border-gray-600 focus-within:border-emerald-500/50 transition-all">
            {/* Feature Mode Indicator */}
            {featureMode !== 'chat' && (
              <div className="px-4 pt-3 pb-2 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {featureIcons[featureMode]}
                    <span className="text-xs text-emerald-400 font-medium">
                      {featureMode === 'blog' && t('blogPost')}
                      {featureMode === 'email' && t('emailWriter')}
                      {featureMode === 'summary' && t('summarize')}
                      {featureMode === 'translate' && t('translate')}
                      {featureMode === 'todo' && t('todoList')}
                      {featureMode === 'recommend' && t('recommend')}
                      {featureMode === 'knowledge' && t('knowledge')}
                      {featureMode === 'schedule' && t('schedule')}
                      {featureMode === 'brainstorm' && t('brainstorm')}
                    </span>
                  </div>
                  <button
                    onClick={() => setFeatureMode('chat')}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 p-3 sm:p-4">
              {/* Voice Input Button */}
              <button
                onClick={isRecording ? stopVoiceInput : startVoiceInput}
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'
                }`}
                title={isRecording ? t('listening') : t('voiceInput')}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? t('listening') : t('placeholder')}
                className={`flex-1 bg-transparent resize-none outline-none min-h-[24px] max-h-[200px] py-2 text-base leading-relaxed ${
                  theme === 'dark' 
                    ? 'text-white placeholder-gray-500' 
                    : 'text-gray-900 placeholder-gray-400'
                }`}
                rows={1}
                disabled={isLoading || isRecording}
              />
              
              {isLoading ? (
                <button
                  onClick={() => setIsLoading(false)}
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600/30 transition-all border border-red-500/30"
                  title={t('stop')}
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    input.trim()
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3 px-4">
            {t('helpText')}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
