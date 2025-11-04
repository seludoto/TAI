#!/bin/bash
# TAI Setup Script for Ollama
# This script helps set up Ollama and download the required models

echo "🚀 Setting up Ollama for TAI..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "📦 Installing Ollama..."

    # Install Ollama (works on macOS, Linux, and WSL)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install ollama
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "❌ Unsupported OS. Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
fi

echo "✅ Ollama is installed!"

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &

# Wait a moment for Ollama to start
sleep 5

# Pull the required models
echo "📥 Downloading Mistral model (recommended for coding)..."
ollama pull mistral

echo "📥 Downloading CodeLlama model (specialized for code)..."
ollama pull codellama

echo "📥 Downloading Llama2 model (alternative option)..."
ollama pull llama2

echo "🎉 Setup complete!"
echo ""
echo "Available models:"
ollama list
echo ""
echo "To use a different model, update OLLAMA_MODEL in your .env file:"
echo "- mistral (recommended for general coding)"
echo "- codellama (specialized for code generation)"
echo "- llama2 (good general purpose model)"
echo ""
echo "To start Ollama manually in the future: ollama serve"
echo "To pull additional models: ollama pull <model_name>"