'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Code } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, programmingLanguage?: string) => void;
  disabled?: boolean;
}

const PROGRAMMING_LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'csharp',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
  'sql', 'bash', 'powershell', 'r', 'matlab', 'dart', 'lua', 'perl'
];

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Close language selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setShowLanguageSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), selectedLanguage || undefined);
      setMessage('');
      setSelectedLanguage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const insertCodeBlock = () => {
    const codeBlock = selectedLanguage
      ? `\`\`\`${selectedLanguage}\n\n\`\`\``
      : '```\n\n```';
    setMessage(prev => prev + codeBlock);
    setShowLanguageSelector(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* Language Selector */}
          <div className="relative" ref={languageSelectorRef}>
            <button
              type="button"
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Select programming language"
            >
              <Code className="w-4 h-4" />
              <span>{selectedLanguage || 'Language'}</span>
            </button>

            {showLanguageSelector && (
              <div className="absolute bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLanguage('');
                      setShowLanguageSelector(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    No language
                  </button>
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLanguageSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded capitalize"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about programming..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32"
              disabled={disabled}
              rows={1}
            />

            {/* Insert Code Block Button */}
            <button
              type="button"
              onClick={insertCodeBlock}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
              title="Insert code block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Helper Text */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {selectedLanguage && (
            <span className="flex items-center space-x-1">
              <Code className="w-3 h-3" />
              <span>{selectedLanguage}</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}