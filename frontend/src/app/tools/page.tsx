'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Bug, Zap, Terminal, ArrowLeft, User, ArrowRight } from 'lucide-react';
import CodeGenerator from '@/components/tools/CodeGenerator';
import DebugAssistant from '@/components/tools/DebugAssistant';
import APIHelper from '@/components/tools/APIHelper';
import CLIHelper from '@/components/tools/CLIHelper';
import PortfolioBuilder from '@/components/tools/PortfolioBuilder';

type ToolType = 'code-generator' | 'debug-assistant' | 'api-helper' | 'cli-helper' | 'portfolio-builder';

const tools = [
  {
    id: 'code-generator' as ToolType,
    name: 'Code Generator',
    description: 'Generate code templates and boilerplate',
    icon: Code,
    color: 'bg-blue-500',
  },
  {
    id: 'debug-assistant' as ToolType,
    name: 'Debug Assistant',
    description: 'Analyze errors and provide fixes',
    icon: Bug,
    color: 'bg-red-500',
  },
  {
    id: 'api-helper' as ToolType,
    name: 'API Helper',
    description: 'Generate API specifications and implementations',
    icon: Zap,
    color: 'bg-yellow-500',
  },
  {
    id: 'cli-helper' as ToolType,
    name: 'CLI Helper',
    description: 'Get command-line help and examples',
    icon: Terminal,
    color: 'bg-green-500',
  },
  {
    id: 'portfolio-builder' as ToolType,
    name: 'Portfolio Builder',
    description: 'Create professional developer portfolios',
    icon: User,
    color: 'bg-purple-500',
  },
];

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const router = useRouter();

  const renderToolComponent = () => {
    switch (selectedTool) {
      case 'code-generator':
        return <CodeGenerator />;
      case 'debug-assistant':
        return <DebugAssistant />;
      case 'api-helper':
        return <APIHelper />;
      case 'cli-helper':
        return <CLIHelper />;
      case 'portfolio-builder':
        return <PortfolioBuilder />;
      default:
        return null;
    }
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedTool(null)}
            className="group mb-8 inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-xl text-gray-700 hover:text-blue-600 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Tools</span>
          </button>
          <div className="animate-fade-in">
            {renderToolComponent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            <span>Professional Developer Tools</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tool</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI-powered tools designed to boost your productivity and code quality
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-8 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${tool.color} p-4 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                    <span>Launch tool</span>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}