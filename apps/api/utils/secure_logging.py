"""
Secure Logging Utilities for SHELTR API
Prevents log injection attacks by sanitizing user input before logging
"""

import re
import base64
import logging
from typing import Any, Union, Dict, Optional

# Configure secure logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def sanitize_for_logging(input_value: Any) -> str:
    """
    Sanitizes user input to prevent log injection attacks
    
    Args:
        input_value: The input to sanitize
        
    Returns:
        Sanitized string safe for logging
    """
    if input_value is None:
        return '[null]'
    
    try:
        str_value = str(input_value)
    except Exception:
        return '[unprintable]'
    
    # Remove or escape dangerous characters that could be used for log injection
    str_value = (
        str_value
        # Remove ANSI escape sequences
        .replace('\x1b', '')
        .replace('\x1B', '')
        # Remove carriage returns and line feeds that could break log format
        .replace('\r', ' ')
        .replace('\n', ' ')
        .replace('\f', ' ')
        .replace('\v', ' ')
        # Escape tab characters
        .replace('\t', '\\t')
        # Limit length to prevent log flooding
        [:1000]
    )
    
    # If the string contains suspicious patterns, further sanitize
    if _contains_suspicious_patterns(str_value):
        # Base64 encode suspicious content to make it safe
        encoded = base64.b64encode(str_value.encode('utf-8')).decode('ascii')
        return f"[SANITIZED:{encoded[:100]}]"
    
    return str_value

def _contains_suspicious_patterns(text: str) -> bool:
    """
    Checks if a string contains patterns commonly used in log injection attacks
    """
    suspicious_patterns = [
        # Script injection patterns
        re.compile(r'<script', re.IGNORECASE),
        re.compile(r'javascript:', re.IGNORECASE),
        # Log format manipulation
        re.compile(r'\[ERROR\]', re.IGNORECASE),
        re.compile(r'\[WARN\]', re.IGNORECASE),
        re.compile(r'\[INFO\]', re.IGNORECASE),
        # Shell injection patterns
        re.compile(r'\$\('),
        re.compile(r'`[^`]*`'),
        # Path traversal
        re.compile(r'\.\.\/'),
        # SQL injection patterns in logs
        re.compile(r'union\s+select', re.IGNORECASE),
        re.compile(r'drop\s+table', re.IGNORECASE),
    ]
    
    return any(pattern.search(text) for pattern in suspicious_patterns)

class SecureLogger:
    """
    Secure logging class that automatically sanitizes input
    """
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def info(self, message: str, *args: Any, **kwargs: Any) -> None:
        """Log info message with sanitized arguments"""
        sanitized_args = [sanitize_for_logging(arg) for arg in args]
        sanitized_kwargs = {k: sanitize_for_logging(v) for k, v in kwargs.items()}
        self.logger.info(sanitize_for_logging(message), *sanitized_args, **sanitized_kwargs)
    
    def warning(self, message: str, *args: Any, **kwargs: Any) -> None:
        """Log warning message with sanitized arguments"""
        sanitized_args = [sanitize_for_logging(arg) for arg in args]
        sanitized_kwargs = {k: sanitize_for_logging(v) for k, v in kwargs.items()}
        self.logger.warning(sanitize_for_logging(message), *sanitized_args, **sanitized_kwargs)
    
    def error(self, message: str, *args: Any, **kwargs: Any) -> None:
        """Log error message with sanitized arguments"""
        sanitized_args = [sanitize_for_logging(arg) for arg in args]
        sanitized_kwargs = {k: sanitize_for_logging(v) for k, v in kwargs.items()}
        self.logger.error(sanitize_for_logging(message), *sanitized_args, **sanitized_kwargs)
    
    def debug(self, message: str, *args: Any, **kwargs: Any) -> None:
        """Log debug message with sanitized arguments"""
        sanitized_args = [sanitize_for_logging(arg) for arg in args]
        sanitized_kwargs = {k: sanitize_for_logging(v) for k, v in kwargs.items()}
        self.logger.debug(sanitize_for_logging(message), *sanitized_args, **sanitized_kwargs)
    
    def critical(self, message: str, *args: Any, **kwargs: Any) -> None:
        """Log critical message with sanitized arguments"""
        sanitized_args = [sanitize_for_logging(arg) for arg in args]
        sanitized_kwargs = {k: sanitize_for_logging(v) for k, v in kwargs.items()}
        self.logger.critical(sanitize_for_logging(message), *sanitized_args, **sanitized_kwargs)

# SHELTR-specific secure logging functions
def log_shelter_action(action: str, shelter_id: str, details: Optional[Any] = None) -> None:
    """Log shelter-related actions securely"""
    logger = SecureLogger("sheltr.shelter")
    logger.info(
        f"🏠 [SHELTER] {action} - ID: {shelter_id}",
        details if details else ""
    )

def log_participant_action(action: str, participant_id: str, details: Optional[Any] = None) -> None:
    """Log participant-related actions securely"""
    logger = SecureLogger("sheltr.participant")
    logger.info(
        f"👤 [PARTICIPANT] {action} - ID: {participant_id}",
        details if details else ""
    )

def log_donation_action(action: str, amount: float, participant_id: Optional[str] = None) -> None:
    """Log donation-related actions securely"""
    logger = SecureLogger("sheltr.donation")
    participant_info = f" - Participant: {participant_id}" if participant_id else ""
    logger.info(
        f"💰 [DONATION] {action} - Amount: ${amount}{participant_info}"
    )

def log_security_event(event: str, details: Optional[Any] = None) -> None:
    """Log security events with high priority"""
    logger = SecureLogger("sheltr.security")
    logger.warning(
        f"🔒 [SECURITY] {event}",
        details if details else ""
    )

def log_api_request(method: str, endpoint: str, user_id: Optional[str] = None, 
                   status_code: Optional[int] = None) -> None:
    """Log API requests securely"""
    logger = SecureLogger("sheltr.api")
    user_info = f" - User: {user_id}" if user_id else ""
    status_info = f" - Status: {status_code}" if status_code else ""
    logger.info(
        f"🌐 [API] {method} {endpoint}{user_info}{status_info}"
    )

def sanitize_url(url: str) -> str:
    """
    Sanitizes URLs to prevent malicious redirects
    
    Args:
        url: The URL to sanitize
        
    Returns:
        Sanitized URL or safe fallback
    """
    from urllib.parse import urlparse
    
    try:
        parsed = urlparse(url)
        
        # Only allow specific protocols
        allowed_protocols = ['http', 'https', 'mailto']
        if parsed.scheme not in allowed_protocols:
            return '#'  # Return safe fallback
        
        # Block common malicious domains/patterns
        blocked_patterns = [
            re.compile(r'bit\.ly', re.IGNORECASE),
            re.compile(r'tinyurl', re.IGNORECASE),
            re.compile(r'localhost(?!:8000)', re.IGNORECASE),  # Block localhost except for development
            re.compile(r'127\.0\.0\.1'),
            re.compile(r'0\.0\.0\.0'),
        ]
        
        if any(pattern.search(parsed.netloc) for pattern in blocked_patterns):
            return '#'
        
        return url
    except Exception:
        # If URL parsing fails, return safe fallback
        return '#'

# Factory function to create secure loggers
def get_secure_logger(name: str) -> SecureLogger:
    """
    Factory function to create a secure logger instance
    
    Args:
        name: Logger name
        
    Returns:
        SecureLogger instance
    """
    return SecureLogger(name)

# Example usage:
# logger = get_secure_logger(__name__)
# logger.info("User logged in with ID: %s", user_id)
# 
# log_shelter_action("Metrics fetched", shelter_id)
# log_donation_action("Payment completed", amount, participant_id)
# log_security_event("Suspicious activity detected", suspicious_data)
