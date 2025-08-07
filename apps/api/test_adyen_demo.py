#!/usr/bin/env python3
"""
SHELTR-AI Adyen Demo Test Script
Tests our demo donation integration without requiring Adyen credentials
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.demo_participant_service import DemoParticipantService

async def test_demo_participant_service():
    """Test demo participant service functionality"""
    print("🧪 Testing Demo Participant Service...")
    
    try:
        demo_service = DemoParticipantService()
        
        # Test 1: Create/Get demo participant
        print("\n1. Creating/Getting demo participant Alex Thompson...")
        participant = await demo_service.get_demo_participant()
        print(f"✅ Participant: {participant['firstName']} {participant['lastName']}")
        print(f"   Story: {participant['story'][:50]}...")
        print(f"   Goals: {len(participant['goals'])} active goals")
        
        # Test 2: Generate QR code
        print("\n2. Generating QR code...")
        qr_result = await demo_service.generate_qr_code('demo-participant-001')
        print(f"✅ QR Code generated: {len(qr_result['qr_code_url'])} chars")
        print(f"   Session ID: {qr_result['session_id']}")
        
        # Test 3: Get participant stats
        print("\n3. Getting participant stats...")
        stats = await demo_service.get_participant_stats('demo-participant-001')
        print(f"✅ Stats loaded:")
        print(f"   Total received: ${stats['total_received']}")
        print(f"   Donation count: {stats['donation_count']}")
        print(f"   Overall progress: {stats['overall_progress']:.1f}%")
        
        print("\n🎉 Demo Participant Service test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_adyen_service_mock():
    """Test Adyen service without real credentials"""
    print("\n🧪 Testing Adyen Service (Mock Mode)...")
    
    try:
        # Test just the test card data function (doesn't require credentials)
        from services.adyen_service import AdyenPaymentService
        
        # This will fail because we don't have credentials, but we can test the structure
        try:
            adyen_service = AdyenPaymentService()
            print("⚠️  Adyen service initialized (may have credential warnings)")
        except Exception as e:
            print(f"⚠️  Expected Adyen credential error: {str(e)[:100]}...")
        
        # Test test card data (doesn't require credentials)
        from services.adyen_service import AdyenPaymentService
        service = AdyenPaymentService.__new__(AdyenPaymentService)  # Create without __init__
        test_cards = service.get_test_card_numbers()
        
        print(f"✅ Test cards available:")
        print(f"   Success cards: {len(test_cards['success_cards'])}")
        print(f"   3DS cards: {len(test_cards['3ds_cards'])}")
        print(f"   Failure cards: {len(test_cards['failure_cards'])}")
        
        # Show a sample card
        sample_card = test_cards['success_cards'][0]
        print(f"   Sample: {sample_card['type']} ending in {sample_card['number'][-4:]}")
        
        print("\n🎉 Adyen Service structure test completed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Adyen test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Run all demo tests"""
    print("🚀 SHELTR-AI Adyen Demo Integration Test")
    print("=" * 50)
    
    # Test 1: Demo Participant Service
    success1 = await test_demo_participant_service()
    
    # Test 2: Adyen Service Structure
    success2 = await test_adyen_service_mock()
    
    print("\n" + "=" * 50)
    if success1 and success2:
        print("🎉 ALL TESTS PASSED! Demo integration is ready.")
        print("\n📋 Next Steps:")
        print("1. Set up Adyen test credentials in environment variables")
        print("2. Start the FastAPI backend server")
        print("3. Test the frontend QR generation")
        print("4. Complete end-to-end payment flow with test cards")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)