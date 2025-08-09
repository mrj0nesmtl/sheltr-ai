"use client";

import React, { useState } from 'react';
import { Building2, MapPin, Phone, Globe, Upload, Users, Bed, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ShelterOnboardingData {
  // Basic Shelter Information
  shelterName: string;
  shelterType: 'emergency' | 'transitional' | 'permanent' | 'specialized' | 'other';
  description: string;
  
  // Location Information
  address: string;
  city: string;
  province: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Contact Information
  phone: string;
  website?: string;
  emergencyContact: string;
  
  // Capacity & Services
  totalCapacity: number;
  currentOccupancy: number;
  services: string[];
  specializations: string[];
  
  // Operating Information
  operatingHours: string;
  checkInTime: string;
  checkOutTime: string;
  ageRestrictions?: string;
  genderRestrictions?: 'all' | 'men' | 'women' | 'youth' | 'families';
  
  // Administrative Information
  licenseNumber?: string;
  registrationNumber?: string;
  documents: File[];
  
  // Admin Information
  adminRole: string;
  yearsOfExperience: number;
  previousShelterExperience: boolean;
  
  // Additional Information
  specialNeeds: string[];
  languages: string[];
  accessibilityFeatures: string[];
  
  // Application Details
  reason: string;
  goals: string;
  timeline: string;
}

interface ShelterOnboardingFormProps {
  onSubmit: (data: ShelterOnboardingData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const SHELTER_TYPES = [
  { value: 'emergency', label: 'Emergency Shelter', description: 'Short-term overnight accommodation' },
  { value: 'transitional', label: 'Transitional Housing', description: 'Medium-term housing with support services' },
  { value: 'permanent', label: 'Permanent Supportive Housing', description: 'Long-term housing with ongoing support' },
  { value: 'specialized', label: 'Specialized Shelter', description: 'Specific populations (youth, families, etc.)' },
  { value: 'other', label: 'Other', description: 'Other type of housing service' }
];

const AVAILABLE_SERVICES = [
  'Meals', 'Clothing', 'Showers', 'Laundry', 'Case Management', 'Mental Health Services',
  'Substance Abuse Counseling', 'Job Training', 'Healthcare', 'Childcare', 'Transportation',
  'Legal Aid', 'Benefits Assistance', 'Housing Search', 'Life Skills Training'
];

const SPECIAL_NEEDS = [
  'Mental Health', 'Substance Abuse', 'Physical Disabilities', 'Veterans', 'LGBTQ+',
  'Seniors', 'Youth', 'Families with Children', 'Single Mothers', 'Domestic Violence Survivors'
];

const LANGUAGES = [
  'English', 'French', 'Spanish', 'Arabic', 'Mandarin', 'Hindi', 'Portuguese', 'Russian',
  'German', 'Japanese', 'Korean', 'Vietnamese', 'Tagalog', 'Other'
];

const ACCESSIBILITY_FEATURES = [
  'Wheelchair Accessible', 'Elevator Access', 'Accessible Bathrooms', 'Visual Aids',
  'Hearing Assistance', 'Service Animal Friendly', 'Ground Floor Access'
];

export const ShelterOnboardingForm: React.FC<ShelterOnboardingFormProps> = ({
  onSubmit,
  onBack,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ShelterOnboardingData>({
    shelterName: '',
    shelterType: 'emergency',
    description: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    website: '',
    emergencyContact: '',
    totalCapacity: 0,
    currentOccupancy: 0,
    services: [],
    specializations: [],
    operatingHours: '24/7',
    checkInTime: '18:00',
    checkOutTime: '08:00',
    genderRestrictions: 'all',
    documents: [],
    adminRole: '',
    yearsOfExperience: 0,
    previousShelterExperience: false,
    specialNeeds: [],
    languages: ['English'],
    accessibilityFeatures: [],
    reason: '',
    goals: '',
    timeline: ''
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const totalSteps = 6;

  const handleInputChange = (field: keyof ShelterOnboardingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field: keyof ShelterOnboardingData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const validateCurrentStep = (): boolean => {
    const errors: {[key: string]: string} = {};

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.shelterName.trim()) errors.shelterName = 'Shelter name is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        break;
        
      case 2: // Location & Contact
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.province.trim()) errors.province = 'Province is required';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        break;
        
      case 3: // Capacity & Services
        if (formData.totalCapacity <= 0) errors.totalCapacity = 'Total capacity must be greater than 0';
        if (formData.services.length === 0) errors.services = 'At least one service must be selected';
        break;
        
      case 4: // Operations
        if (!formData.operatingHours.trim()) errors.operatingHours = 'Operating hours are required';
        if (!formData.checkInTime.trim()) errors.checkInTime = 'Check-in time is required';
        if (!formData.checkOutTime.trim()) errors.checkOutTime = 'Check-out time is required';
        break;
        
      case 5: // Admin Information
        if (!formData.adminRole.trim()) errors.adminRole = 'Your role is required';
        if (formData.yearsOfExperience < 0) errors.yearsOfExperience = 'Years of experience cannot be negative';
        break;
        
      case 6: // Application Details
        if (!formData.reason.trim()) errors.reason = 'Reason for joining is required';
        if (!formData.goals.trim()) errors.goals = 'Goals are required';
        if (!formData.timeline.trim()) errors.timeline = 'Timeline is required';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      await onSubmit(formData);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Basic Shelter Information</h3>
        <p className="text-gray-600 dark:text-gray-400">Tell us about your shelter</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shelter Name *
        </label>
        <input
          type="text"
          value={formData.shelterName}
          onChange={(e) => handleInputChange('shelterName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.shelterName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Downtown Community Shelter"
        />
        {validationErrors.shelterName && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.shelterName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shelter Type *
        </label>
        <select
          value={formData.shelterType}
          onChange={(e) => handleInputChange('shelterType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {SHELTER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          {SHELTER_TYPES.find(t => t.value === formData.shelterType)?.description}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Brief description of your shelter, mission, and the population you serve..."
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Location & Contact Information</h3>
        <p className="text-gray-600 dark:text-gray-400">Where is your shelter located?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.address ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="123 Main Street"
        />
        {validationErrors.address && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              validationErrors.city ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Montreal"
          />
          {validationErrors.city && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Province *
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => handleInputChange('province', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              validationErrors.province ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="QC"
          />
          {validationErrors.province && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Postal Code
        </label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="H2X 3X4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.phone ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="+1 (514) 555-0123"
        />
        {validationErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://www.yourshelter.org"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Emergency Contact
        </label>
        <input
          type="tel"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="+1 (514) 555-0911"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Capacity & Services</h3>
        <p className="text-gray-600 dark:text-gray-400">What services do you provide?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Capacity *
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalCapacity}
            onChange={(e) => handleInputChange('totalCapacity', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              validationErrors.totalCapacity ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="50"
          />
          {validationErrors.totalCapacity && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.totalCapacity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Occupancy
          </label>
          <input
            type="number"
            min="0"
            max={formData.totalCapacity}
            value={formData.currentOccupancy}
            onChange={(e) => handleInputChange('currentOccupancy', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="35"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Services Provided * <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
          {AVAILABLE_SERVICES.map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={(e) => handleArrayChange('services', service, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
        {validationErrors.services && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.services}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Special Populations Served <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
          {SPECIAL_NEEDS.map((need) => (
            <label key={need} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.specialNeeds.includes(need)}
                onChange={(e) => handleArrayChange('specialNeeds', need, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{need}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Bed className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Operating Information</h3>
        <p className="text-gray-600 dark:text-gray-400">How does your shelter operate?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Operating Hours *
        </label>
        <input
          type="text"
          value={formData.operatingHours}
          onChange={(e) => handleInputChange('operatingHours', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.operatingHours ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="24/7 or 7:00 PM - 7:00 AM"
        />
        {validationErrors.operatingHours && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.operatingHours}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Check-in Time *
          </label>
          <input
            type="time"
            value={formData.checkInTime}
            onChange={(e) => handleInputChange('checkInTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              validationErrors.checkInTime ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.checkInTime && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.checkInTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Check-out Time *
          </label>
          <input
            type="time"
            value={formData.checkOutTime}
            onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              validationErrors.checkOutTime ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.checkOutTime && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.checkOutTime}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender Restrictions
        </label>
        <select
          value={formData.genderRestrictions}
          onChange={(e) => handleInputChange('genderRestrictions', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Genders</option>
          <option value="men">Men Only</option>
          <option value="women">Women Only</option>
          <option value="youth">Youth Only</option>
          <option value="families">Families Only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Age Restrictions
        </label>
        <input
          type="text"
          value={formData.ageRestrictions}
          onChange={(e) => handleInputChange('ageRestrictions', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="18+, 13-25, No restrictions, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Languages Spoken <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
          {LANGUAGES.map((language) => (
            <label key={language} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.languages.includes(language)}
                onChange={(e) => handleArrayChange('languages', language, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Accessibility Features <span className="text-gray-500">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-300 rounded-md p-3">
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.accessibilityFeatures.includes(feature)}
                onChange={(e) => handleArrayChange('accessibilityFeatures', feature, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Administrator Information</h3>
        <p className="text-gray-600 dark:text-gray-400">Tell us about your role and experience</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Role at the Shelter *
        </label>
        <input
          type="text"
          value={formData.adminRole}
          onChange={(e) => handleInputChange('adminRole', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.adminRole ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Executive Director, Program Manager, Operations Manager, etc."
        />
        {validationErrors.adminRole && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.adminRole}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Years of Experience in Social Services *
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={formData.yearsOfExperience}
          onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="5"
        />
        {validationErrors.yearsOfExperience && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.yearsOfExperience}</p>
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.previousShelterExperience}
            onChange={(e) => handleInputChange('previousShelterExperience', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            I have previous experience managing shelter operations
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          License/Registration Numbers <span className="text-gray-500">(if applicable)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="License Number"
          />
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Registration Number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Check className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Application Details</h3>
        <p className="text-gray-600 dark:text-gray-400">Final questions about your application</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Why do you want to join SHELTR? *
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.reason ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Explain how SHELTR aligns with your mission and how it could benefit your organization..."
        />
        {validationErrors.reason && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.reason}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What are your goals with SHELTR? *
        </label>
        <textarea
          value={formData.goals}
          onChange={(e) => handleInputChange('goals', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.goals ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe your specific goals for implementing SHELTR in your operations..."
        />
        {validationErrors.goals && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.goals}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Implementation Timeline *
        </label>
        <select
          value={formData.timeline}
          onChange={(e) => handleInputChange('timeline', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            validationErrors.timeline ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select timeline...</option>
          <option value="immediate">Immediate (Within 1 month)</option>
          <option value="short">Short-term (1-3 months)</option>
          <option value="medium">Medium-term (3-6 months)</option>
          <option value="long">Long-term (6+ months)</option>
        </select>
        {validationErrors.timeline && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.timeline}</p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📋 What happens next?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Your application will be reviewed by our team</li>
          <li>• We may contact you for additional information</li>
          <li>• Approval typically takes 3-5 business days</li>
          <li>• You'll receive email updates on your application status</li>
          <li>• Once approved, you'll gain access to the full SHELTR platform</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Shelter Registration</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Register your shelter to join the SHELTR network
              </p>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Application
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderProgressBar()}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}

            <div className="flex justify-between pt-6 border-t">
              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Back to Basic Registration
                </Button>
              </div>

              <div>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Application...
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
