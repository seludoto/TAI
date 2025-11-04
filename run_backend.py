#!/usr/bin/env python
"""
Heroku startup script for TAI Backend
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory for relative imports
os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))

# Now import and run the app
if __name__ == "__main__":
    import uvicorn
    from main import app
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
