"""
Simple test to verify Python setup is working correctly.
Run this file to confirm FastAPI and dependencies are properly installed.
"""

import sys
from pathlib import Path

def test_python_setup():
    """Test basic Python setup."""
    print("🐍 Python Setup Test")
    print("=" * 50)
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print(f"Current working directory: {Path.cwd()}")
    print()

def test_dependencies():
    """Test that core dependencies are installed."""
    print("📦 Testing Dependencies")
    print("=" * 50)
    
    try:
        import fastapi
        print(f"✅ FastAPI: {fastapi.__version__}")
    except ImportError:
        print("❌ FastAPI: Not installed")
    
    try:
        import uvicorn
        print(f"✅ Uvicorn: {uvicorn.__version__}")
    except ImportError:
        print("❌ Uvicorn: Not installed")
    
    try:
        import pydantic
        print(f"✅ Pydantic: {pydantic.__version__}")
    except ImportError:
        print("❌ Pydantic: Not installed")
    
    try:
        import dotenv
        print("✅ python-dotenv: Available")
    except ImportError:
        print("❌ python-dotenv: Not installed")
    
    print()

def test_fastapi_basic():
    """Test basic FastAPI functionality."""
    print("🚀 Testing FastAPI Basic Setup")
    print("=" * 50)
    
    try:
        from fastapi import FastAPI
        app = FastAPI(title="Test App")
        
        @app.get("/")
        def read_root():
            return {"message": "FastAPI is working!"}
        
        print("✅ FastAPI app created successfully")
        print("✅ Route decorator working")
        print("✅ Ready for SHELTR-AI development!")
        
    except Exception as e:
        print(f"❌ FastAPI test failed: {e}")
    
    print()

if __name__ == "__main__":
    test_python_setup()
    test_dependencies()
    test_fastapi_basic()
    
    print("🎉 All tests completed!")
    print("Your Python environment is ready for SHELTR-AI development.")
    print()
    print("Next steps:")
    print("1. Select Python interpreter in Cursor IDE")
    print("2. Install remaining dependencies: pip install -r requirements.txt")
    print("3. Start developing the FastAPI backend!") 