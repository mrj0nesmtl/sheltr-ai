"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { populateShelters, clearShelterData } from '@/scripts/populate-shelters';
import { 
  investigateDatabaseStructure as investigateDB, 
  cleanAndPopulateRealData 
} from '@/scripts/populate-montreal-shelters';
import { Database, Trash2, RefreshCw, CheckCircle, AlertCircle, Search, MapPin } from 'lucide-react';

interface DataPopulatorProps {
  onDataUpdated?: () => void;
}

export default function DataPopulator({ onDataUpdated }: DataPopulatorProps) {
  const [isPopulating, setIsPopulating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [isPopulatingReal, setIsPopulatingReal] = useState(false);
  const [lastAction, setLastAction] = useState<'populate' | 'clear' | 'investigate' | 'real' | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleInvestigateDatabase = async () => {
    setIsInvestigating(true);
    setMessage('');
    
    try {
      await investigateDB();
      setLastAction('investigate');
      setMessage('🔍 Database investigation complete! Check console for details.');
    } catch (error) {
      console.error('Error investigating database:', error);
      setMessage('❌ Error investigating database. Check console for details.');
    } finally {
      setIsInvestigating(false);
    }
  };

  const handlePopulateRealData = async () => {
    setIsPopulatingReal(true);
    setMessage('');
    
    try {
      await cleanAndPopulateRealData();
      setLastAction('real');
      setMessage('🇨🇦 Successfully populated with real Montreal shelter data!');
      onDataUpdated?.();
    } catch (error) {
      console.error('Error populating real data:', error);
      setMessage('❌ Error populating real data. Check console for details.');
    } finally {
      setIsPopulatingReal(false);
    }
  };

  const handlePopulateData = async () => {
    setIsPopulating(true);
    setMessage('');
    
    try {
      await populateShelters();
      setLastAction('populate');
      setMessage('✅ Successfully populated mock shelter data in Firestore!');
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

  const isAnyLoading = isPopulating || isClearing || isInvestigating || isPopulatingReal;

  return (
    <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-600" />
          Database Management & Population
        </CardTitle>
        <CardDescription>
          Investigate current data and populate with real Montreal shelter information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <div className={`p-3 rounded-lg border ${
            message.includes('✅') || message.includes('🇨🇦')
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100'
              : message.includes('🧹') || message.includes('🔍')
              ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
          }`}>
            <div className="flex items-center">
              {(message.includes('✅') || message.includes('🇨🇦')) && <CheckCircle className="h-4 w-4 mr-2" />}
              {message.includes('❌') && <AlertCircle className="h-4 w-4 mr-2" />}
              {(message.includes('🧹') || message.includes('🔍')) && <RefreshCw className="h-4 w-4 mr-2" />}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Priority Section: Real Montreal Data */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">🇨🇦 Real Montreal Shelter Data</h3>
          </div>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">
            <strong>RECOMMENDED:</strong> Clean database and populate with 10 real Montreal shelters including contact info and precise coordinates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={handleInvestigateDatabase}
              disabled={isAnyLoading}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {isInvestigating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Investigating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Investigate Database
                </>
              )}
            </Button>
            <Button 
              onClick={handlePopulateRealData}
              disabled={isAnyLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPopulatingReal ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Populating Real Data...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Clean & Populate Real Data
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Legacy Section: Mock Data */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Legacy Mock Data (Old System)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Add Mock Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add mixed mock shelter data (old system)
              </p>
              <Button 
                onClick={handlePopulateData}
                disabled={isAnyLoading}
                variant="outline"
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
                    Populate Mock Data
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Clear All Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remove all existing shelter data
              </p>
              <Button 
                onClick={handleClearData}
                disabled={isAnyLoading}
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
                    Clear All Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">🇨🇦 Real Montreal Shelter Data Includes:</div>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li><strong>Resilience Montreal</strong> - 4000 Sainte-Catherine St West</li>
                <li><strong>Old Brewery Mission</strong> - 915 Clark Street</li>
                <li><strong>Maison du Père</strong> - 550 Boulevard René-Lévesque East</li>
                <li><strong>Welcome Hall Mission</strong> - 4755 Acorn Street</li>
                <li><strong>YWCA Montreal</strong> - 1355 Boulevard René-Lévesque West</li>
                <li><strong>Le Chaînon</strong> - 4373 Avenue de l'Esplanade</li>
                <li><strong>+ 4 more Montreal shelters</strong> with real contact information</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 