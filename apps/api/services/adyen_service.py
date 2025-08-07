# SHELTR Adyen Payment Service
# Based on: https://github.com/adyen-examples/adyen-node-online-payments/tree/main/giving-example

import os
import json
import time
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional

import Adyen
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class AdyenPaymentService:
    """
    SHELTR-specific Adyen payment service for QR code donations
    Implements SmartFund™ 80-15-5 distribution model
    """
    
    def __init__(self):
        """Initialize Adyen client with SHELTR configuration"""
        try:
            # Adyen client setup
            self.adyen = Adyen.Adyen()
            self.adyen.client.xapikey = os.getenv('ADYEN_API_KEY')
            
            # Set environment (TEST for development, LIVE for production)
            environment = os.getenv('ADYEN_ENVIRONMENT', 'TEST')
            self.adyen.client.platform = environment.lower()
            
            # Configuration
            self.merchant_account = os.getenv('ADYEN_MERCHANT_ACCOUNT')
            self.client_key = os.getenv('ADYEN_CLIENT_KEY')
            self.hmac_key = os.getenv('ADYEN_HMAC_KEY')
            self.frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            
            # Validate required configuration
            required_vars = [
                'ADYEN_API_KEY', 'ADYEN_MERCHANT_ACCOUNT', 
                'ADYEN_CLIENT_KEY', 'ADYEN_HMAC_KEY'
            ]
            
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            if missing_vars:
                raise ValueError(f"Missing required Adyen environment variables: {', '.join(missing_vars)}")
                
            logger.info("✅ Adyen payment service initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Adyen service: {e}")
            raise
    
    async def get_payment_methods(self) -> Dict[str, Any]:
        """
        Get available payment methods for SHELTR donations
        """
        try:
            request = {
                "channel": "Web",
                "merchantAccount": self.merchant_account,
                "countryCode": "US",  # Primary market
                "amount": {
                    "currency": "USD",
                    "value": 10000  # $100 in minor units for method detection
                }
            }
            
            result = self.adyen.checkout.payment_methods(request)
            
            logger.info("Payment methods retrieved successfully")
            return result
            
        except Exception as e:
            logger.error(f"Failed to get payment methods: {e}")
            raise HTTPException(status_code=500, detail=f"Payment methods error: {str(e)}")
    
    async def create_demo_payment_session(
        self, 
        participant_id: str,
        amount: float,
        donor_info: Optional[Dict[str, str]] = None,
        demo_session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create Adyen payment session for SHELTR demo donation
        """
        try:
            # Generate unique reference
            order_ref = f"SHELTR-DEMO-{int(time.time())}-{str(uuid.uuid4())[:8]}"
            
            # Convert amount to minor units (cents)
            amount_minor = int(amount * 100)
            
            # Payment request
            request = {
                "amount": {
                    "currency": "USD",
                    "value": amount_minor
                },
                "reference": order_ref,
                "merchantAccount": self.merchant_account,
                "channel": "Web",
                "origin": self.frontend_url,
                "returnUrl": f"{self.frontend_url}/donation/success?ref={order_ref}",
                "countryCode": "US",
                "shopperLocale": "en_US",
                "additionalData": {
                    "allow3DS2": True,
                    "participant_id": participant_id,
                    "sheltr_demo": "true",
                    "sheltr_smartfund": "true",
                    "demo_session_id": demo_session_id or str(uuid.uuid4()),
                    "amount_breakdown": json.dumps({
                        "total": amount,
                        "direct": round(amount * 0.80, 2),      # 80% direct
                        "housing": round(amount * 0.15, 2),     # 15% housing
                        "operations": round(amount * 0.05, 2)   # 5% operations
                    })
                }
            }
            
            # Add donor info if provided
            if donor_info:
                request["shopperEmail"] = donor_info.get("email")
                request["shopperName"] = {
                    "firstName": donor_info.get("firstName", ""),
                    "lastName": donor_info.get("lastName", "")
                }
            
            # Make payment request
            result = self.adyen.checkout.payments(request)
            
            # Log successful session creation
            logger.info(f"Demo payment session created: {order_ref} for ${amount}")
            
            return {
                "session_data": result,
                "reference": order_ref,
                "amount": amount,
                "participant_id": participant_id,
                "smartfund_breakdown": {
                    "direct": round(amount * 0.80, 2),
                    "housing": round(amount * 0.15, 2), 
                    "operations": round(amount * 0.05, 2)
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to create demo payment session: {e}")
            raise HTTPException(
                status_code=500, 
                detail=f"Payment session creation failed: {str(e)}"
            )
    
    async def handle_payment_details(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle additional payment details (3DS, redirects, etc.)
        """
        try:
            request = {
                "details": payment_data.get("details"),
                "paymentData": payment_data.get("paymentData")
            }
            
            result = self.adyen.checkout.payments_details(request)
            
            logger.info(f"Payment details processed: {result.get('resultCode')}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to handle payment details: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Payment details processing failed: {str(e)}"
            )
    
    def verify_webhook_signature(self, notification: Dict[str, Any]) -> bool:
        """
        Verify HMAC signature for Adyen webhook notifications
        """
        try:
            # Implementation of HMAC verification
            # This is a simplified version - in production, use Adyen's official HMAC validation
            
            # Extract required fields
            psp_reference = notification.get("pspReference", "")
            original_reference = notification.get("originalReference", "")
            merchant_reference = notification.get("merchantReference", "")
            merchant_account = notification.get("merchantAccountCode", "")
            amount_value = notification.get("amount", {}).get("value", "")
            amount_currency = notification.get("amount", {}).get("currency", "")
            event_code = notification.get("eventCode", "")
            success = notification.get("success", "")
            
            # Create payload for HMAC calculation
            payload_list = [
                psp_reference, original_reference, merchant_reference,
                merchant_account, str(amount_value), amount_currency,
                event_code, success
            ]
            
            # Join with colon and encode
            payload = ":".join(payload_list).encode('utf-8')
            
            # Calculate HMAC (simplified - use proper implementation in production)
            import hmac
            import hashlib
            import base64
            
            hmac_key_bytes = base64.b64decode(self.hmac_key)
            signature = hmac.new(hmac_key_bytes, payload, hashlib.sha256).digest()
            expected_signature = base64.b64encode(signature).decode('utf-8')
            
            received_signature = notification.get("additionalData", {}).get("hmacSignature", "")
            
            is_valid = hmac.compare_digest(expected_signature, received_signature)
            
            if is_valid:
                logger.info(f"✅ Valid webhook signature for {merchant_reference}")
            else:
                logger.warning(f"❌ Invalid webhook signature for {merchant_reference}")
            
            return is_valid
            
        except Exception as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return False
    
    async def process_smartfund_distribution(self, payment_notification: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process SmartFund™ distribution based on payment notification
        """
        try:
            # Extract payment details
            merchant_reference = payment_notification.get("merchantReference")
            amount_value = payment_notification.get("amount", {}).get("value", 0)
            amount_currency = payment_notification.get("amount", {}).get("currency", "USD")
            
            # Convert from minor units
            total_amount = amount_value / 100
            
            # Calculate SmartFund distribution (80-15-5)
            distribution = {
                "total": total_amount,
                "direct": round(total_amount * 0.80, 2),      # 80% to participant
                "housing": round(total_amount * 0.15, 2),     # 15% to housing fund
                "operations": round(total_amount * 0.05, 2),  # 5% to operations
                "currency": amount_currency,
                "reference": merchant_reference,
                "processed_at": datetime.now(timezone.utc).isoformat(),
                "status": "completed"
            }
            
            logger.info(f"SmartFund distribution processed: {merchant_reference} - ${total_amount}")
            
            # In production, this would:
            # 1. Transfer direct amount to participant wallet
            # 2. Add housing amount to housing fund pool
            # 3. Record operations revenue
            # 4. Update participant total_received
            # 5. Send notifications to participant and donor
            
            return distribution
            
        except Exception as e:
            logger.error(f"SmartFund distribution failed: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"SmartFund distribution error: {str(e)}"
            )
    
    def get_test_card_numbers(self) -> Dict[str, Any]:
        """
        Get Adyen test card numbers for demo purposes
        """
        return {
            "success_cards": [
                {
                    "number": "4111111111111111",
                    "type": "Visa",
                    "expiryMonth": "03",
                    "expiryYear": "2030",
                    "cvc": "737",
                    "description": "Standard Visa test card"
                },
                {
                    "number": "5555444433331111", 
                    "type": "Mastercard",
                    "expiryMonth": "03",
                    "expiryYear": "2030", 
                    "cvc": "737",
                    "description": "Standard Mastercard test card"
                },
                {
                    "number": "370000000000002",
                    "type": "American Express",
                    "expiryMonth": "03",
                    "expiryYear": "2030",
                    "cvc": "7373",
                    "description": "American Express test card"
                }
            ],
            "3ds_cards": [
                {
                    "number": "4212345678901237",
                    "type": "Visa",
                    "expiryMonth": "03", 
                    "expiryYear": "2030",
                    "cvc": "737",
                    "description": "3D Secure 2 challenge flow"
                }
            ],
            "failure_cards": [
                {
                    "number": "4000300011112220",
                    "type": "Visa",
                    "expiryMonth": "03",
                    "expiryYear": "2030", 
                    "cvc": "737",
                    "description": "Generic Decline"
                }
            ]
        }