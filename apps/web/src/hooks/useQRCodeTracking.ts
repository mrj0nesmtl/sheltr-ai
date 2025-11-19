/**
 * QR Code Tracking Hook
 * 
 * Automatically tracks QR code scans when users visit pages via QR code links.
 * Looks for ?qr=qr_xxxxx parameter in URL and records the scan.
 */

import { useEffect, useRef } from 'react';
import { PlatformQRCodeService } from '@/services/platformQRCodeService';

export function useQRCodeTracking() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Only track once per page load
    if (hasTracked.current) return;

    const trackQRScan = async () => {
      try {
        // Get QR code ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const qrId = urlParams.get('qr');

        // Validate QR code ID format
        if (qrId && qrId.startsWith('qr_')) {
          console.log('🔍 QR code scan detected:', qrId);
          
          // Record the scan
          await PlatformQRCodeService.recordScan(qrId);
          
          console.log('✅ QR code scan recorded successfully');
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('❌ Error tracking QR code scan:', error);
      }
    };

    trackQRScan();
  }, []);
}

