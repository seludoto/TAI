'use client';

import { useState } from 'react';
import { Code, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getTemplatesByLanguage } from '@/lib/codeTemplates';

interface CodeResponse {
  generated_code: string;
  explanation: string;
}

const PROGRAMMING_LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'csharp',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css'
];

const FRAMEWORKS = {
  python: ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'tensorflow', 'pytorch'],
  javascript: ['react', 'vue', 'angular', 'express', 'node', 'next.js', 'nuxt'],
  typescript: ['react', 'vue', 'angular', 'nest', 'express', 'next.js'],
  java: ['spring', 'hibernate', 'maven', 'gradle', 'spring-boot'],
  php: ['laravel', 'symfony', 'codeigniter', 'wordpress'],
  ruby: ['rails', 'sinatra'],
  go: ['gin', 'echo', 'fiber', 'gorilla'],
  rust: ['actix', 'rocket', 'warp'],
  swift: ['vapor', 'perfect'],
  kotlin: ['spring', 'ktor'],
  csharp: ['asp.net', 'entity-framework', 'blazor'],
  css: ['tailwind', 'bootstrap', 'sass', 'styled-components'],
  html: ['html5', 'bootstrap', 'tailwind']
};

export default function CodeGenerator() {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('python');
  const [framework, setFramework] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CodeResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Get available templates for selected language
  const availableTemplates = getTemplatesByLanguage(language);

  // Handle template selection
  const handleTemplateSelect = (templateName: string) => {
    const templates = availableTemplates as Record<string, { description: string; code: string }>;
    const template = templates[templateName];
    if (template) {
      setDescription(template.description);
      setResult({
        generated_code: template.code,
        explanation: `Template: ${templateName}\n\n${template.description}\n\nThis is a pre-built template. You can modify it according to your needs.`
      });
      setShowTemplates(false);
    }
  };

  // Reset template selection when language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setFramework('');
    setSelectedTemplate('');
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          description,
          programming_language: language,
          framework: framework || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Failed to generate code');
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'explanation') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedExplanation(true);
        setTimeout(() => setCopiedExplanation(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const availableFrameworks = FRAMEWORKS[language as keyof typeof FRAMEWORKS] || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Code Generator</h2>
              <p className="text-gray-600 text-lg">Generate code templates and boilerplate instantly</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              What do you want to build?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Create a REST API for user management with authentication"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-lg"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-blue-400"
              >
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Framework (Optional)
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-blue-400"
              >
                <option value="">No framework</option>
                {availableFrameworks.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw.charAt(0).toUpperCase() + fw.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Selection */}
          {Object.keys(availableTemplates).length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  Quick Templates
                </h3>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {showTemplates ? 'Hide' : 'Show'} Templates
                </button>
              </div>
              
              {showTemplates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(availableTemplates).map(([name, template]) => (
                    <div
                      key={name}
                      onClick={() => handleTemplateSelect(name)}
                      className="group p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">{name}</h4>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{template.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!description.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-3 font-bold text-lg shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Magic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Code</span>
                </>
              )}
            </button>

            {result && (
              <button
                onClick={() => {
                  setResult(null);
                  setDescription('');
                  setSelectedTemplate('');
                }}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Generated Code */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <Code className="w-6 h-6 text-blue-600" />
                  <span>Generated Code</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(result.generated_code, 'code')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  className="text-base"
                  customStyle={{ margin: 0, borderRadius: 0 }}
                >
                  {result.generated_code}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span>Explanation</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(result.explanation, 'explanation')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-purple-600 hover:border-purple-400 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  {copiedExplanation ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">{result.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}