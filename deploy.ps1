# TAI Platform Deployment Script
# PowerShell script to help with deployment

param(
    [string]$Action = "help"
)

function Show-Help {
    Write-Host @"
TAI Platform Deployment Helper
================================

Usage: .\deploy.ps1 -Action <action>

Actions:
  setup-github    - Push code to GitHub
  check-status    - Check deployment status
  deploy-vercel   - Deploy frontend to Vercel
  help            - Show this help message

Examples:
  .\deploy.ps1 -Action setup-github
  .\deploy.ps1 -Action deploy-vercel

"@ -ForegroundColor Cyan
}

function Setup-GitHub {
    Write-Host "`n🚀 Setting up GitHub repository..." -ForegroundColor Green
    
    # Check if remote exists
    $remotes = git remote -v 2>&1
    
    if ($remotes -notmatch "origin") {
        Write-Host "`n⚠️  GitHub remote not configured!" -ForegroundColor Yellow
        Write-Host "Please follow these steps:" -ForegroundColor Yellow
        Write-Host "1. Create a new repository at: https://github.com/new" -ForegroundColor White
        Write-Host "2. Name it: TAI" -ForegroundColor White
        Write-Host "3. Run this command with your username:" -ForegroundColor White
        Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/TAI.git" -ForegroundColor Cyan
        Write-Host "   git push -u origin master" -ForegroundColor Cyan
    } else {
        Write-Host "✅ Git remote already configured" -ForegroundColor Green
        Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
        git push -u origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "❌ Push failed. Check your credentials and try again." -ForegroundColor Red
        }
    }
}

function Check-Status {
    Write-Host "`n📊 Checking deployment status..." -ForegroundColor Green
    
    # Check Git status
    Write-Host "`n📁 Git Status:" -ForegroundColor Cyan
    git status --short
    
    # Check if there are uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "⚠️  You have uncommitted changes" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Working directory clean" -ForegroundColor Green
    }
    
    # Check remote
    Write-Host "`n🌐 Git Remotes:" -ForegroundColor Cyan
    git remote -v
    
    # Check latest commit
    Write-Host "`n📝 Latest Commit:" -ForegroundColor Cyan
    git log -1 --oneline
}

function Deploy-Vercel {
    Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Green
    
    # Check if vercel CLI is installed
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    
    if (-not $vercelInstalled) {
        Write-Host "⚠️  Vercel CLI not installed!" -ForegroundColor Yellow
        Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
        npm install -g vercel
    }
    
    # Navigate to frontend and deploy
    Set-Location -Path ".\frontend"
    Write-Host "Deploying frontend..." -ForegroundColor Cyan
    vercel --prod
    
    Set-Location -Path ".."
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
}

# Main script execution
switch ($Action.ToLower()) {
    "setup-github" { Setup-GitHub }
    "check-status" { Check-Status }
    "deploy-vercel" { Deploy-Vercel }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown action: $Action" -ForegroundColor Red
        Show-Help 
    }
}
