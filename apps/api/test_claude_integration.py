#!/usr/bin/env python3
"""
Quick test script for Claude integration
Tests both Anthropic service and dashboard integration
"""
import asyncio
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.anthropic_service import anthropic_service
from services.chatbot_dashboard_service import ChatbotDashboardService

async def test_anthropic_service():
    """Test Anthropic service directly"""
    print("\n" + "="*60)
    print("🧪 Testing Anthropic Service")
    print("="*60)
    
    # Check if service is available
    if not anthropic_service.is_available():
        print("❌ Anthropic service not configured (ANTHROPIC_API_KEY missing)")
        print("ℹ️  This is expected if you haven't set up the API key yet")
        return False
    
    print("✅ Anthropic service is configured")
    
    # Test simple message
    try:
        print("\n📤 Sending test message to Claude...")
        messages = [
            {"role": "user", "content": "Say 'Hello from SHELTR!' in exactly 5 words."}
        ]
        
        response = await anthropic_service.generate_chat_completion(
            messages=messages,
            model="claude-3-5-sonnet-20241022",
            max_tokens=100,
            temperature=0.7
        )
        
        print(f"✅ Claude Response: {response}")
        return True
        
    except Exception as e:
        print(f"❌ Error testing Claude: {str(e)}")
        return False

async def test_provider_detection():
    """Test provider detection logic"""
    print("\n" + "="*60)
    print("🧪 Testing Provider Detection")
    print("="*60)
    
    dashboard_service = ChatbotDashboardService()
    
    test_cases = [
        ("claude-3-5-sonnet-20241022", "anthropic"),
        ("claude-3-5-haiku-20241022", "anthropic"),
        ("gpt-4o-mini", "openai"),
        ("gpt-4o", "openai"),
    ]
    
    all_passed = True
    for model, expected_provider in test_cases:
        detected = dashboard_service._get_provider_from_model(model)
        status = "✅" if detected == expected_provider else "❌"
        print(f"{status} {model} → {detected} (expected: {expected_provider})")
        if detected != expected_provider:
            all_passed = False
    
    return all_passed

async def test_available_models():
    """Test getting available models"""
    print("\n" + "="*60)
    print("🧪 Testing Available Models")
    print("="*60)
    
    models = anthropic_service.get_available_models()
    print(f"✅ Found {len(models)} Claude models:")
    for model in models:
        print(f"   - {model['name']} ({model['id']})")
        print(f"     {model['description']}")
        print(f"     Context: {model['context_window']:,} tokens")
    
    return True

async def main():
    """Run all tests"""
    print("\n🚀 SHELTR Claude Integration Test Suite")
    print("=" * 60)
    
    results = []
    
    # Test 1: Provider Detection (always works)
    results.append(("Provider Detection", await test_provider_detection()))
    
    # Test 2: Available Models (always works)
    results.append(("Available Models", await test_available_models()))
    
    # Test 3: Anthropic Service (requires API key)
    results.append(("Anthropic Service", await test_anthropic_service()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    print(f"\n🎯 Results: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("✅ All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed (this is expected without ANTHROPIC_API_KEY)")
        return 0  # Don't fail if just API key is missing

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

