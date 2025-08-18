#!/usr/bin/env python3
"""
Test script for SHELTR AI Chatbot
Tests different user roles and scenarios
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import asyncio
import json
from services.chatbot.orchestrator import chatbot_orchestrator

async def test_chatbot_scenarios():
    """Test various chatbot scenarios with different user roles"""
    
    print("🤖 SHELTR AI Chatbot Testing Suite")
    print("=" * 50)
    
    # Test scenarios
    scenarios = [
        {
            "name": "🚨 Emergency - Participant",
            "message": "I am homeless and need somewhere to sleep tonight - can you help me?",
            "user_role": "participant",
            "user_id": "test_participant"
        },
        {
            "name": "💝 Donor Question",
            "message": "How does SHELTR use my donations? I want to know my money is being used effectively.",
            "user_role": "donor", 
            "user_id": "test_donor"
        },
        {
            "name": "🏠 Participant Service Request",
            "message": "I need to book a meal for tomorrow. What's available?",
            "user_role": "participant",
            "user_id": "test_participant_2"
        },
        {
            "name": "👨‍💼 Admin Operations",
            "message": "How do I add a new participant to our shelter system?",
            "user_role": "admin",
            "user_id": "test_admin"
        },
        {
            "name": "🔧 Technical Support",
            "message": "I'm having trouble logging into my account. The password reset isn't working.",
            "user_role": "participant",
            "user_id": "test_tech_user"
        }
    ]
    
    for scenario in scenarios:
        print(f"\n{scenario['name']}")
        print("-" * 40)
        print(f"Message: {scenario['message']}")
        print(f"Role: {scenario['user_role']}")
        
        try:
            # Process message through orchestrator
            response = await chatbot_orchestrator.process_message(
                message=scenario['message'],
                user_id=scenario['user_id'],
                user_role=scenario['user_role']
            )
            
            print(f"Agent: {response.agent_used}")
            print(f"Response: {response.message[:200]}...")
            print(f"Actions: {len(response.actions)} available")
            print(f"Escalation: {'Yes' if response.escalation_triggered else 'No'}")
            
            if response.actions:
                print("Action Buttons:")
                for action in response.actions[:2]:  # Show first 2 actions
                    print(f"  • {action.get('label', 'N/A')}")
                    
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print(f"\n🎉 Testing complete!")

if __name__ == "__main__":
    asyncio.run(test_chatbot_scenarios())
