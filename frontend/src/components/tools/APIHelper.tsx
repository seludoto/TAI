'use client';

import React, { useState } from 'react';
import { Zap, Send, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface APIHelperProps {
  onClose?: () => void;
}

export default function APIHelper({ onClose }: APIHelperProps) {
  const [description, setDescription] = useState('');
  const [apiType, setApiType] = useState('rest');
  const [method, setMethod] = useState('GET');
  const [framework, setFramework] = useState('express');
  const [apiCode, setApiCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/api-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          api_type: apiType,
          method,
          framework,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate API code');
      }

      const data = await response.json();
      setApiCode(data.api_code);
    } catch (error) {
      console.error('Error generating API code:', error);
      setApiCode('Failed to generate API code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiCode);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">API Helper</h2>
              <p className="text-gray-600 text-lg">Generate API endpoints and implementations</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* API Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-bold text-gray-800 mb-3">
              API Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your API should do (e.g., 'Create a user registration endpoint that validates email and password')"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* API Type */}
            <div>
              <label htmlFor="apiType" className="block text-base font-bold text-gray-800 mb-3">
                API Type
              </label>
              <select
                id="apiType"
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-yellow-400"
              >
                <option value="rest">REST API</option>
                <option value="graphql">GraphQL</option>
                <option value="websocket">WebSocket</option>
              </select>
            </div>

            {/* HTTP Method */}
            <div>
              <label htmlFor="method" className="block text-base font-bold text-gray-800 mb-3">
                HTTP Method
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-yellow-400"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            {/* Framework */}
            <div>
              <label htmlFor="framework" className="block text-base font-bold text-gray-800 mb-3">
                Framework
              </label>
              <select
                id="framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-yellow-400"
              >
                <option value="express">Express.js</option>
                <option value="fastapi">FastAPI</option>
                <option value="django">Django</option>
                <option value="flask">Flask</option>
                <option value="spring">Spring Boot</option>
                <option value="nestjs">NestJS</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-3 font-bold text-lg shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>{isLoading ? 'Generating API...' : 'Generate API Code'}</span>
          </button>

          {/* Generated Code */}
          {apiCode && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <span>Generated API Code</span>
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-yellow-600 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-300">
                  <SyntaxHighlighter
                    language={framework === 'fastapi' ? 'python' : 'javascript'}
                    style={oneLight}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {apiCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          )}

          {/* API Testing Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>API Testing Tips:</span>
            </h4>
            <ul className="text-base text-blue-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Use tools like Postman, Insomnia, or curl to test your endpoints</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Include proper error handling and status codes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Add input validation and sanitization</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Consider rate limiting and authentication</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Document your API with OpenAPI/Swagger</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}