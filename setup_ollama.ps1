# TAI Setup Script for Ollama (Windows PowerShell)
# This script helps set up Ollama and download the required models

Write-Host "🚀 Setting up Ollama for TAI..." -ForegroundColor Green

# Check if Ollama is installed
$ollamaExists = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollamaExists) {
    Write-Host "📦 Installing Ollama..." -ForegroundColor Yellow

    # Download and install Ollama for Windows
    try {
        # Download the installer
        $installerUrl = "https://ollama.ai/download/OllamaSetup.exe"
        $installerPath = "$env:TEMP\OllamaSetup.exe"

        Write-Host "Downloading Ollama installer..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath

        Write-Host "Running installer (please complete the installation)..." -ForegroundColor Cyan
        Start-Process -FilePath $installerPath -Wait

        # Clean up
        Remove-Item $installerPath -ErrorAction SilentlyContinue

        Write-Host "✅ Ollama installation completed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Ollama automatically. Please install manually from https://ollama.ai" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Ollama is already installed!" -ForegroundColor Green
}

# Start Ollama service in background
Write-Host "🔄 Starting Ollama service..." -ForegroundColor Cyan
$ollamaJob = Start-Job -ScriptBlock { ollama serve }

# Wait a moment for Ollama to start
Start-Sleep -Seconds 5

# Pull the required models
Write-Host "📥 Downloading Mistral model (recommended for coding)..." -ForegroundColor Cyan
ollama pull mistral

Write-Host "📥 Downloading CodeLlama model (specialized for code)..." -ForegroundColor Cyan
ollama pull codellama

Write-Host "📥 Downloading Llama2 model (alternative option)..." -ForegroundColor Cyan
ollama pull llama2

Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available models:" -ForegroundColor Cyan
ollama list
Write-Host ""
Write-Host "To use a different model, update OLLAMA_MODEL in your .env file:" -ForegroundColor Yellow
Write-Host "- mistral (recommended for general coding)" -ForegroundColor White
Write-Host "- codellama (specialized for code generation)" -ForegroundColor White
Write-Host "- llama2 (good general purpose model)" -ForegroundColor White
Write-Host ""
Write-Host "To start Ollama manually in the future: ollama serve" -ForegroundColor Cyan
Write-Host "To pull additional models: ollama pull <model_name>" -ForegroundColor Cyan

# Stop the background job
Stop-Job $ollamaJob
Remove-Job $ollamaJob