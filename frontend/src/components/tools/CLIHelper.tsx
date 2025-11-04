'use client';

import React, { useState } from 'react';
import { Terminal, Play, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CLIHelperProps {
  onClose?: () => void;
}

export default function CLIHelper({ onClose }: CLIHelperProps) {
  const [task, setTask] = useState('');
  const [platform, setPlatform] = useState('linux');
  const [tool, setTool] = useState('bash');
  const [commands, setCommands] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!task.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tools/cli-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task,
          platform,
          tool,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CLI commands');
      }

      const data = await response.json();
      setCommands(data.commands);
    } catch (error) {
      console.error('Error generating CLI commands:', error);
      setCommands('Failed to generate CLI commands. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
  };

  const commonTasks = [
    'Find all files with a specific extension',
    'Search for text in files',
    'Monitor system resources',
    'Create a backup of a directory',
    'Set up a web server',
    'Install packages and dependencies',
    'Manage processes and services',
    'Work with Git repositories',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">CLI Helper</h2>
              <p className="text-gray-600 text-lg">Generate command-line scripts and commands</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Task Description */}
          <div>
            <label htmlFor="task" className="block text-lg font-bold text-gray-800 mb-3">
              What do you want to do?
            </label>
            <textarea
              id="task"
              rows={3}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe the task you want to accomplish (e.g., 'Find all Python files modified in the last 7 days')"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Platform */}
            <div>
              <label htmlFor="platform" className="block text-base font-bold text-gray-800 mb-3">
                Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-green-400"
              >
                <option value="linux">Linux</option>
                <option value="macos">macOS</option>
                <option value="windows">Windows</option>
                <option value="cross-platform">Cross-platform</option>
              </select>
            </div>

            {/* Tool/Shell */}
            <div>
              <label htmlFor="tool" className="block text-base font-bold text-gray-800 mb-3">
                Preferred Tool/Shell
              </label>
              <select
                id="tool"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-green-400"
              >
                <option value="bash">Bash</option>
                <option value="zsh">Zsh</option>
                <option value="powershell">PowerShell</option>
                <option value="cmd">Command Prompt</option>
                <option value="fish">Fish</option>
                <option value="generic">Generic</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !task.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-3 font-bold text-lg shadow-lg"
          >
            <Play className="w-5 h-5" />
            <span>{isLoading ? 'Generating Commands...' : 'Generate Commands'}</span>
          </button>

          {/* Generated Commands */}
          {commands && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-gray-700 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <Terminal className="w-6 h-6 text-green-400" />
                    <span>Generated Commands</span>
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-green-600 hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Commands</span>
                  </button>
                </div>
                <div className="bg-black rounded-xl overflow-hidden shadow-inner border border-gray-700">
                  <SyntaxHighlighter
                    language="bash"
                    style={oneLight}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      backgroundColor: '#000000',
                      color: '#00ff00',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {commands}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          )}

          {/* Common Tasks */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 text-lg mb-4 flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Common CLI Tasks:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonTasks.map((taskExample, index) => (
                <button
                  key={index}
                  onClick={() => setTask(taskExample)}
                  className="text-left text-base text-green-700 hover:text-green-900 hover:bg-white p-3 rounded-lg transition-all hover:shadow-md font-medium"
                >
                  • {taskExample}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Warning */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-md">
            <h4 className="font-bold text-yellow-800 text-lg mb-3 flex items-center space-x-2">
              <span className="text-2xl">⚠️</span>
              <span>Safety Reminder:</span>
            </h4>
            <p className="text-base text-yellow-700 leading-relaxed">
              Always review and understand commands before executing them, especially those that:
              modify files, change permissions, install software, or affect system configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}