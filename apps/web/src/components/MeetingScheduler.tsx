/**
 * Meeting Scheduler Component
 * Reusable component for scheduling meetings with different contexts
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { CalendarService, SchedulingResult } from '@/services/calendarService';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'investor' | 'general';
}

export function MeetingScheduler({ isOpen, onClose, variant = 'general' }: MeetingSchedulerProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  
  // Form state
  const [meetingForm, setMeetingForm] = useState({
    name: '',
    email: '',
    company: '',
    meetingType: '', // For general meetings
    investmentRange: '', // For investor meetings
    preferredDate: '',
    preferredTime: '',
    timezone: 'America/New_York',
    additionalNotes: '',
  });

  const calendarService = new CalendarService();

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingForm.name || !meetingForm.email || !meetingForm.preferredDate || !meetingForm.preferredTime) {
      setSchedulingResult({
        success: false,
        message: 'Please fill out all required fields.'
      });
      return;
    }

    setIsScheduling(true);
    setSchedulingResult(null);

    try {
      const meetingData = {
        name: meetingForm.name,
        email: meetingForm.email,
        company: meetingForm.company || undefined,
        meetingType: variant === 'general' ? meetingForm.meetingType : 'Investor Meeting',
        investmentRange: variant === 'investor' ? meetingForm.investmentRange : undefined,
        preferredDate: meetingForm.preferredDate,
        preferredTime: meetingForm.preferredTime,
        timezone: meetingForm.timezone,
        additionalNotes: meetingForm.additionalNotes || undefined,
      };

      const result = await calendarService.scheduleMeeting(meetingData);
      setSchedulingResult(result);

      if (result.success) {
        // Reset form on success
        setMeetingForm({
          name: '',
          email: '',
          company: '',
          meetingType: '',
          investmentRange: '',
          preferredDate: '',
          preferredTime: '',
          timezone: 'America/New_York',
          additionalNotes: '',
        });
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setSchedulingResult({
        success: false,
        message: 'Failed to schedule meeting. Please try again or contact us directly.'
      });
    } finally {
      setIsScheduling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {variant === 'investor' ? 'Schedule Investor Meeting' : 'Schedule a Meeting'}
                </CardTitle>
                <CardDescription>
                  {variant === 'investor' 
                    ? 'Book a 45-minute discussion about SHELTR investment opportunity'
                    : 'Book a 45-minute discussion about SHELTR platform and partnerships'
                  }
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {schedulingResult && (
              <div className={`mb-6 p-4 rounded-lg ${
                schedulingResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                  : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {schedulingResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{schedulingResult.message}</span>
                </div>
                {schedulingResult.success && schedulingResult.meetingLink && (
                  <div className="mt-2">
                    <a 
                      href={schedulingResult.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Join Meeting Link
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleScheduleMeeting} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={meetingForm.name}
                    onChange={(e) => setMeetingForm({...meetingForm, name: e.target.value})}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={meetingForm.email}
                    onChange={(e) => setMeetingForm({...meetingForm, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={meetingForm.company}
                    onChange={(e) => setMeetingForm({...meetingForm, company: e.target.value})}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  {variant === 'investor' ? (
                    <>
                      <Label htmlFor="investmentRange">Investment Range</Label>
                      <select
                        id="investmentRange"
                        value={meetingForm.investmentRange}
                        onChange={(e) => setMeetingForm({...meetingForm, investmentRange: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      >
                        <option value="">Select range</option>
                        <option value="$1K-$10K">$1,000 - $10,000</option>
                        <option value="$10K-$50K">$10,000 - $50,000</option>
                        <option value="$100K-$250K">$100,000 - $250,000</option>
                        <option value="$250K+">$250,000+</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <Label htmlFor="meetingType">Meeting Type</Label>
                      <select
                        id="meetingType"
                        value={meetingForm.meetingType}
                        onChange={(e) => setMeetingForm({...meetingForm, meetingType: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      >
                        <option value="">Select type</option>
                        <option value="Partnership">Partnership Discussion</option>
                        <option value="Shelter Integration">Shelter Integration</option>
                        <option value="Donor Relations">Donor Relations</option>
                        <option value="Technical Demo">Technical Demo</option>
                        <option value="Media Inquiry">Media Inquiry</option>
                        <option value="General Consultation">General Consultation</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={meetingForm.preferredDate}
                    onChange={(e) => setMeetingForm({...meetingForm, preferredDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time (EST) *</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={meetingForm.preferredTime}
                    onChange={(e) => setMeetingForm({...meetingForm, preferredTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <textarea
                  id="additionalNotes"
                  value={meetingForm.additionalNotes}
                  onChange={(e) => setMeetingForm({...meetingForm, additionalNotes: e.target.value})}
                  placeholder="Any specific topics you'd like to discuss or questions you have..."
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isScheduling}
                  className="flex-1"
                >
                  {isScheduling ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
