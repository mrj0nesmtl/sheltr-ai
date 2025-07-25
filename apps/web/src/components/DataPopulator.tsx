"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { populateShelters, clearShelterData } from '@/scripts/populate-shelters';
import { Database, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface DataPopulatorProps {
  onDataUpdated?: () => void;
}

export default function DataPopulator({ onDataUpdated }: DataPopulatorProps) {
  const [isPopulating, setIsPopulating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastAction, setLastAction] = useState<'populate' | 'clear' | null>(null);
  const [message, setMessage] = useState<string>('');

  const handlePopulateData = async () => {
    setIsPopulating(true);
    setMessage('');
    
    try {
      await populateShelters();
      setLastAction('populate');
      setMessage('✅ Successfully populated shelter data in Firestore!');
      onDataUpdated?.();
    } catch (error) {
      console.error('Error populating data:', error);
      setMessage('❌ Error populating data. Check console for details.');
    } finally {
      setIsPopulating(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    setMessage('');
    
    try {
      await clearShelterData();
      setLastAction('clear');
      setMessage('🧹 Successfully cleared shelter data from Firestore!');
      onDataUpdated?.();
    } catch (error) {
      console.error('Error clearing data:', error);
      setMessage('❌ Error clearing data. Check console for details.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-600" />
          Firestore Data Population
        </CardTitle>
        <CardDescription>
          Populate the database with comprehensive shelter data for testing and development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className={`p-3 rounded-lg border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100'
              : message.includes('🧹')
              ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
          }`}>
            <div className="flex items-center">
              {message.includes('✅') && <CheckCircle className="h-4 w-4 mr-2" />}
              {message.includes('❌') && <AlertCircle className="h-4 w-4 mr-2" />}
              {message.includes('🧹') && <RefreshCw className="h-4 w-4 mr-2" />}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Populate Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add comprehensive shelter network + pending applications to Firestore
            </p>
            <Button 
              onClick={handlePopulateData}
              disabled={isPopulating || isClearing}
              className="w-full"
            >
              {isPopulating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Populating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Populate Shelters
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Clear Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remove all existing shelter data from Firestore
            </p>
            <Button 
              onClick={handleClearData}
              disabled={isPopulating || isClearing}
              variant="destructive"
              className="w-full"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div><strong>Comprehensive Mock Data Includes:</strong></div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>15 shelters total:</strong> 6 US West Coast + 9 Montreal shelters with real contact info</li>
              <li><strong>Geographic coverage:</strong> Seattle, Portland, Vancouver, SF, LA, Denver, Montreal</li>
              <li><strong>Montreal shelters:</strong> Old Brewery Mission, Maison du Père, Resilience, Refuge des Jeunes, Le Chaînon, Welcome Hall Mission, and more</li>
              <li><strong>5 pending applications:</strong> Oakland, Hollywood, Phoenix + Montreal (Maison Marguerite, Rue des Femmes)</li>
              <li><strong>Real contact data:</strong> Actual phone numbers and addresses from Montreal shelter network</li>
              <li><strong>Multi-tenant structure:</strong> <code>tenants/platform/shelters</code> and <code>shelter_applications</code></li>
              <li><strong>Interactive map:</strong> Realistic coordinates for all North American locations</li>
            </ul>
            
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="flex items-center text-blue-800 dark:text-blue-200">
                🇨🇦 <strong className="ml-1">NEW:</strong> Real Montreal shelter data with authentic contact information
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 