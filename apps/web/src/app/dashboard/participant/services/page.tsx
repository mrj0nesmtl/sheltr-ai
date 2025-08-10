"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceBooking } from '@/components/ServiceBooking';
import { useState } from 'react';
import { 
  CheckCircle
} from 'lucide-react';

export default function ParticipantServices() {
  const { user, hasRole } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Check if user has participant or super admin access
  if (!hasRole('participant') && !hasRole('super_admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Participant access required for this page.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please Log In
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to be logged in to access services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Services & Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse and book services to support your journey
        </p>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Service booked successfully! Check your bookings tab for details.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Booking Component */}
      <ServiceBooking 
        shelterId={user.customClaims?.shelter_id || 'oldbrew'} 
        participantId={user.uid}
        onBookingComplete={(booking) => {
          console.log('Service booking completed:', booking);
          setBookingSuccess(true);
          setTimeout(() => setBookingSuccess(false), 5000);
        }}
        showMyBookings={true}
      />
    </div>
  );
}