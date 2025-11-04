#!/usr/bin/env python3
"""
Simple test script to verify TAI backend functionality
Run with: python test_backend.py
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("Testing root endpoint...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint passed: {data.get('message', 'No message')}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_openapi_docs():
    """Test the OpenAPI documentation"""
    print("Testing OpenAPI docs...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ OpenAPI docs accessible")
            return True
        else:
            print(f"❌ OpenAPI docs failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ OpenAPI docs error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing TAI Backend")
    print("=" * 50)

    # Wait a moment for server to start if needed
    time.sleep(1)

    tests = [
        test_health_check,
        test_root_endpoint,
        test_openapi_docs,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1
        print()

    print("=" * 50)
    print(f"Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Backend is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the backend setup.")
        return 1

if __name__ == "__main__":
    exit(main())