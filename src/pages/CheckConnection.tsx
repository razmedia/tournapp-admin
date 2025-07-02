import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function CheckConnection() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationCount, setLocationCount] = useState<number | null>(null);
  const [tournamentCount, setTournamentCount] = useState<number | null>(null);
  const [envVars, setEnvVars] = useState<{url: string, anonKey: string}>({
    url: import.meta.env.VITE_SUPABASE_URL || 'Not set',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'Not set'
  });

  const checkConnection = async () => {
    setStatus('checking');
    setErrorMessage(null);
    
    try {
      // Test connection by fetching count of locations
      const { count: locCount, error: locError } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });
        
      if (locError) throw locError;
      setLocationCount(locCount);
      
      // Test connection by fetching count of tournaments
      const { count: tourCount, error: tourError } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true });
        
      if (tourError) throw tourError;
      setTournamentCount(tourCount);
      
      setStatus('connected');
    } catch (error: any) {
      console.error('Connection error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Unknown error occurred');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Supabase Connection Status</h1>
        <p className="text-text-secondary mt-1">Check if your Supabase connection is working properly</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${
              status === 'checking' ? 'bg-yellow-500 animate-pulse' :
              status === 'connected' ? 'bg-green-500' :
              'bg-red-500'
            }`}></div>
            <div>
              <h3 className="text-lg font-semibold">
                {status === 'checking' ? 'Checking connection...' :
                 status === 'connected' ? 'Connected to Supabase' :
                 'Connection Error'}
              </h3>
              {status === 'connected' && (
                <p className="text-sm text-success-600">Your Supabase connection is working properly!</p>
              )}
              {status === 'error' && errorMessage && (
                <p className="text-sm text-danger-600">{errorMessage}</p>
              )}
            </div>
          </div>

          {status === 'connected' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Locations Count</p>
                <p className="text-2xl font-bold text-primary-600">{locationCount}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Tournaments Count</p>
                <p className="text-2xl font-bold text-primary-600">{tournamentCount}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-md font-medium mb-2">Environment Variables</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono">VITE_SUPABASE_URL</span>
                <span className={`text-sm ${envVars.url === 'Not set' ? 'text-danger-600' : 'text-success-600'}`}>
                  {envVars.url === 'Not set' ? 'Not set' : 'Set correctly'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono">VITE_SUPABASE_ANON_KEY</span>
                <span className={`text-sm ${envVars.anonKey === 'Not set' ? 'text-danger-600' : 'text-success-600'}`}>
                  {envVars.anonKey}
                </span>
              </div>
            </div>
          </div>

          <Button onClick={checkConnection} className="mt-4">
            Test Connection Again
          </Button>
        </div>
      </Card>
    </div>
  );
}