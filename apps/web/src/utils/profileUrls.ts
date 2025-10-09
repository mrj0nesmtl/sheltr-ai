// Utility functions for handling profile URLs in development vs production

/**
 * Gets the base URL for the current environment
 * - Development: http://localhost:3000
 * - Production: https://sheltr-ai.web.app
 */
export function getBaseUrl(): string {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side: check environment
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  return 'https://sheltr-ai.web.app';
}

/**
 * Generates a participant profile URL for the current environment
 */
export function getParticipantProfileUrl(participantId: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/participant/${participantId}`;
}

/**
 * Generates a donation URL for the current environment
 */
export function getDonationUrl(participantId: string, isDemo: boolean = false): string {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams();
  
  if (isDemo) {
    params.set('demo', 'true');
  }
  params.set('participant', participantId);
  
  return `${baseUrl}/donate?${params.toString()}`;
}

/**
 * Generates a QR code URL pointing to the participant's profile
 * NOTE: QR codes ALWAYS use production URL, even in development,
 * because they need to be scannable by external users
 */
export function generateProfileQRCodeUrl(participantId: string, size: number = 128): string {
  const productionUrl = `https://sheltr-ai.web.app/participant/${participantId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(productionUrl)}&format=png`;
}

/**
 * Generates a QR code URL pointing to the donation page
 * NOTE: QR codes ALWAYS use production URL, even in development,
 * because they need to be scannable by external users
 */
export function generateDonationQRCodeUrl(participantId: string, size: number = 128, isDemo: boolean = false): string {
  const params = new URLSearchParams();
  if (isDemo) {
    params.set('demo', 'true');
  }
  params.set('participant', participantId);
  
  const productionUrl = `https://sheltr-ai.web.app/donate?${params.toString()}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(productionUrl)}&format=png`;
}

/**
 * Gets the appropriate sharing URL (always production for sharing)
 */
export function getSharingUrl(participantId: string): string {
  return `https://sheltr-ai.web.app/participant/${participantId}`;
}
