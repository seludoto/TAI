'use client';

import React, { useState } from 'react';
import { Bug, Play, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DebugAssistantProps {
  onClose?: () => void;
}

export default function DebugAssistant({ onClose }: DebugAssistantProps) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [language, setLanguage] = useState('python');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDebug = async () => {
    if (!code.trim() || !errorMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          error_message: errorMessage,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to debug code');
      }

      const data = await response.json();
      setSolution(data.solution);
    } catch (error) {
      console.error('Error debugging code:', error);
      setSolution('Failed to generate debug solution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl shadow-lg">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Debug Assistant</h2>
              <p className="text-gray-600 text-lg">Find and fix bugs with AI assistance</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label htmlFor="language" className="block text-base font-bold text-gray-800 mb-3">
              Programming Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-red-400"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
          </div>

          {/* Code Input */}
          <div>
            <label htmlFor="code" className="block text-base font-bold text-gray-800 mb-3">
              Your Code
            </label>
            <textarea
              id="code"
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your problematic code here..."
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-base transition-all"
            />
          </div>

          {/* Error Message Input */}
          <div>
            <label htmlFor="error" className="block text-base font-bold text-gray-800 mb-3">
              Error Message
            </label>
            <textarea
              id="error"
              rows={4}
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Paste the error message you're getting..."
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-base transition-all"
            />
          </div>

          {/* Debug Button */}
          <button
            onClick={handleDebug}
            disabled={isLoading || !code.trim() || !errorMessage.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-3 font-bold text-lg shadow-lg"
          >
            <Play className="w-5 h-5" />
            <span>{isLoading ? 'Analyzing Bug...' : 'Debug Code'}</span>
          </button>

          {/* Solution Output */}
          {solution && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <Bug className="w-6 h-6 text-green-600" />
                    <span>Debug Solution</span>
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-green-600 hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Solution</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-green-200">
                  <SyntaxHighlighter
                    language="markdown"
                    style={oneLight}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {solution}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}