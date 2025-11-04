import Link from "next/link";
import { Code, MessageSquare, Sparkles, Users, ArrowRight, Github, Zap, Bug, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TAI
                </h1>
                <p className="text-xs text-gray-600">Tanzania AI Assistant</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tools" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tools
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-24 text-center relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Powered by DigitalOcean GenAI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Development Assistant
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Build better software faster with AI-powered code generation, 
              debugging assistance, and professional developer tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                href="/tools"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Code className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Explore Developer Tools</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link
                href="#features"
                className="group border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-xl font-bold text-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center space-x-3"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Learn More</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">5+</div>
                <div className="text-sm text-gray-600">Developer Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">10x</div>
                <div className="text-sm text-gray-600">Faster Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Free to Use</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/80 backdrop-blur-sm rounded-3xl mb-20 shadow-xl border border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 mt-2">
                Powerful Developer Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to accelerate your development workflow, powered by AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Code Generator</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Generate boilerplate code, templates, and complete implementations for any programming language or framework.
                </p>
                <div className="text-blue-600 font-semibold text-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:-translate-y-2">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Bug className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">Debug Assistant</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Analyze errors, get intelligent suggestions, and find solutions to common programming issues quickly.
                </p>
                <div className="text-red-600 font-semibold text-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-2">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">API Helper</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Generate API specifications, create endpoints, and build comprehensive API documentation.
                </p>
                <div className="text-yellow-600 font-semibold text-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Terminal className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">CLI Helper</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get command-line help, examples, and explanations for various development tools and utilities.
                </p>
                <div className="text-green-600 font-semibold text-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link 
                href="/tools"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>Explore all tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute transform rotate-45 -right-12 top-12 w-64 h-64 border-4 border-white rounded-3xl"></div>
                <div className="absolute transform -rotate-12 -left-12 bottom-12 w-48 h-48 border-4 border-white rounded-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Why Choose TAI?</h2>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Built specifically for developers who value speed, quality, and reliability
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">AI-Powered</h4>
                    <p className="text-blue-100 leading-relaxed">
                      Advanced language models provide intelligent code suggestions and solutions
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Lightning Fast</h4>
                    <p className="text-blue-100 leading-relaxed">
                      Get responses in seconds with DigitalOcean GenAI cloud infrastructure
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Made for You</h4>
                    <p className="text-blue-100 leading-relaxed">
                      Designed by developers, for developers, with real-world use cases in mind
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <Link
                    href="/tools"
                    className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <span>Start Building Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">TAI</h3>
                  <p className="text-sm text-gray-400">Tanzania AI Assistant</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering Tanzanian developers with AI-powered tools for better, faster software development.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/tools" className="hover:text-white transition-colors">Code Generator</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Debug Assistant</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">API Helper</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">CLI Helper</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Beta Version</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Local AI Processing</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Open Source</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Focused</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TAI - Tanzania AI Assistant. Built for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
