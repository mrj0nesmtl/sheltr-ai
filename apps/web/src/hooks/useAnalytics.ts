"use client";

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, string | number | boolean>;
}

export const useAnalytics = () => {
  useEffect(() => {
    // Analytics is initialized when component mounts
    if (analytics) {
      console.log('📊 Google Analytics initialized for SHELTR');
    }
  }, []);

  const trackEvent = (event: AnalyticsEvent) => {
    if (!analytics) {
      console.warn('Analytics not available (likely server-side rendering)');
      return;
    }

    try {
      const eventParams: Record<string, string | number | boolean> = {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters
      };

      // Remove undefined values
      Object.keys(eventParams).forEach(key => {
        if (eventParams[key] === undefined) {
          delete eventParams[key];
        }
      });

      logEvent(analytics, event.action, eventParams);
      console.log('📊 Analytics event tracked:', event.action, eventParams);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (pageName: string, pageTitle?: string) => {
    if (!analytics) return;

    try {
      logEvent(analytics, 'page_view', {
        page_title: pageTitle || pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      console.log('📊 Page view tracked:', pageName);
    } catch (error) {
      console.error('Page view tracking error:', error);
    }
  };

  const trackUser = (userId: string, properties?: Record<string, string | number | boolean>) => {
    if (!analytics) return;

    try {
      setUserId(analytics, userId);
      if (properties) {
        setUserProperties(analytics, properties);
      }
      console.log('📊 User tracked:', userId);
    } catch (error) {
      console.error('User tracking error:', error);
    }
  };

  const trackDonation = (amount: number, participantId: string, method: string = 'demo') => {
    trackEvent({
      action: 'purchase',
      category: 'donation',
      value: amount,
      customParameters: {
        currency: 'USD',
        participant_id: participantId,
        payment_method: method,
        platform: 'SHELTR'
      }
    });
  };

  const trackShelterInteraction = (action: string, shelterId?: string) => {
    trackEvent({
      action: action,
      category: 'shelter_interaction',
      customParameters: {
        shelter_id: shelterId
      }
    });
  };

  const trackUserRegistration = (method: string, role: string) => {
    trackEvent({
      action: 'sign_up',
      category: 'authentication',
      customParameters: {
        method: method,
        user_role: role
      }
    });
  };

  const trackQRScan = (participantId: string) => {
    trackEvent({
      action: 'qr_scan',
      category: 'engagement',
      customParameters: {
        participant_id: participantId,
        scan_type: 'donation_qr'
      }
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUser,
    trackDonation,
    trackShelterInteraction,
    trackUserRegistration,
    trackQRScan,
    isAvailable: !!analytics
  };
};

// Predefined event tracking functions for common SHELTR actions
export const trackingSheltr = {
  // Page views
  viewHomepage: () => ({ action: 'page_view', category: 'navigation', label: 'homepage' }),
  viewDashboard: (role: string) => ({ action: 'page_view', category: 'dashboard', label: role }),
  viewDonationFlow: () => ({ action: 'page_view', category: 'donation', label: 'scan_give' }),
  
  // User actions
  scanQR: (participantId: string) => ({ action: 'qr_scan', category: 'engagement', customParameters: { participant_id: participantId } }),
  completeDonation: (amount: number) => ({ action: 'purchase', category: 'donation', value: amount }),
  shareProfile: (participantId: string) => ({ action: 'share', category: 'social', customParameters: { participant_id: participantId } }),
  
  // Authentication
  login: (method: string) => ({ action: 'login', category: 'authentication', customParameters: { method } }),
  register: (role: string) => ({ action: 'sign_up', category: 'authentication', customParameters: { user_role: role } }),
  
  // Platform interactions
  viewShelterProfile: (shelterId: string) => ({ action: 'view_shelter', category: 'shelter_interaction', customParameters: { shelter_id: shelterId } }),
  exportData: (dataType: string) => ({ action: 'export_data', category: 'admin', customParameters: { data_type: dataType } })
};
