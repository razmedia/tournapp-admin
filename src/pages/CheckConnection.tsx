import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Database, CheckCircle, XCircle, RefreshCw, AlertTriangle, Server, Key } from 'lucide-react';

export default function CheckConnection() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationCount, setLocationCount] = useState<number | null>(null);
  const [tournamentCount, setTournamentCount] = useState<number | null>(null);
  const [envVars, setEnvVars] = useState<{url: string, anonKey: string}>({
    url: import.meta.env.VITE_SUPABASE_URL || 'Not set',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'Not set'
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setStatus('checking');
    setErrorMessage(null);
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
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
            <div className={`p-3 rounded-full ${
              status === 'checking' ? 'bg-yellow-100 text-yellow-600' :
              status === 'connected' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {status === 'checking' ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : status === 'connected' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
            </div>
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
              <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Locations Count</p>
                  <p className="text-2xl font-bold text-primary-600">{locationCount}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tournaments Count</p>
                  <p className="text-2xl font-bold text-primary-600">{tournamentCount}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <Server className="h-4 w-4 mr-2 text-gray-500" />
              Environment Variables
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-mono">VITE_SUPABASE_URL</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${envVars.url === 'Not set' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {envVars.url === 'Not set' ? 'Not set' : 'Set correctly'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-mono">VITE_SUPABASE_ANON_KEY</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${envVars.anonKey === 'Not set' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {envVars.anonKey}
                </span>
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">Troubleshooting Steps</h5>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-700 list-disc list-inside">
                    <li>Check if your Supabase project is active and not paused</li>
                    <li>Verify that your environment variables are set correctly</li>
                    <li>Ensure your Supabase URL and anon key are valid</li>
                    <li>Check if your Supabase project has the required tables</li>
                    <li>Verify network connectivity to Supabase servers</li>
                  </ul>
                  <p className="mt-2 text-sm text-yellow-700">
                    For Netlify deployments, make sure to set these environment variables in your Netlify project settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={checkConnection} 
            className="mt-4 flex items-center"
            loading={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Connection Again
          </Button>
        </div>
      </Card>

      {/* Netlify Environment Variables Guide */}
      <Card title="Setting Up Environment Variables in Netlify">
        <div className="space-y-4">
          <p className="text-text-secondary">
            Follow these steps to set up your Supabase environment variables in Netlify:
          </p>
          
          <ol className="space-y-4 list-decimal list-inside">
            <li className="text-text-primary">
              <span className="font-medium">Log in to your Netlify account</span>
              <p className="text-sm text-text-muted ml-6 mt-1">Go to the Netlify dashboard and select your project.</p>
            </li>
            
            <li className="text-text-primary">
              <span className="font-medium">Navigate to Site settings</span>
              <p className="text-sm text-text-muted ml-6 mt-1">Click on "Site settings" in the site navigation.</p>
            </li>
            
            <li className="text-text-primary">
              <span className="font-medium">Go to Environment variables</span>
              <p className="text-sm text-text-muted ml-6 mt-1">Select "Environment variables" from the Build & deploy section.</p>
            </li>
            
            <li className="text-text-primary">
              <span className="font-medium">Add environment variables</span>
              <p className="text-sm text-text-muted ml-6 mt-1">Click "Add variable" and add the following variables:</p>
              <div className="ml-6 mt-2 space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-mono text-sm">VITE_SUPABASE_URL</p>
                  <p className="text-xs text-text-muted mt-1">Your Supabase project URL (from Supabase dashboard)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-mono text-sm">VITE_SUPABASE_ANON_KEY</p>
                  <p className="text-xs text-text-muted mt-1">Your Supabase anon/public key (from Supabase dashboard)</p>
                </div>
              </div>
            </li>
            
            <li className="text-text-primary">
              <span className="font-medium">Save and deploy</span>
              <p className="text-sm text-text-muted ml-6 mt-1">Click "Save" and trigger a new deployment to apply the environment variables.</p>
            </li>
          </ol>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Finding Your Supabase Credentials</p>
                <p className="text-sm text-blue-700 mt-1">
                  You can find your Supabase URL and anon key in the Supabase dashboard under Project Settings → API. Look for the "Project URL" and "anon/public" key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
```