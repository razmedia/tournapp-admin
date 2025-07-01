import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Breadcrumbs from './Breadcrumbs';

interface RegionData {
  name: string;
  locations: {
    name: string;
    signUp: number;
    categories: number;
    sessions: number;
    draws: number;
    planning: string;
    managing: string;
  }[];
}

interface Tournament {
  id: string;
  name: string;
  classification: string;
  start_date: string;
  end_date: string;
  status: string;
  region_locations: any[];
  is_team_tournament: boolean;
}

export default function TournamentDashboard() {
  const { name } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournament();
  }, [name]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('name', name)
        .single();

      if (error) throw error;
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: name || 'Tournament', current: true }
  ];

  // Generate regions data from tournament data
  const regions: RegionData[] = tournament?.region_locations?.map((rl: any) => ({
    name: rl.region,
    locations: rl.locations.map((location: string, idx: number) => ({
      name: location,
      signUp: 120 - (idx * 20), // Mock data - replace with real data
      categories: 10,
      sessions: 3 - idx,
      draws: 8 - (idx * 2),
      planning: "planning",
      managing: "Managing"
    }))
  })) || [];

  if (loading) {
    return (
      <div className="p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading tournament...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Tournament not found</h3>
            <p className="text-gray-600">The tournament you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
              <p className="text-lg text-gray-600 mt-1">Tournament Dashboard</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Classification: {tournament.classification}</span>
                <span>Status: {tournament.status}</span>
                <span>Type: {tournament.is_team_tournament ? 'Team' : 'Individual'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Doubles
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {regions.map((region) => (
            <div key={region.name} className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{region.name} Region</h2>
              {region.locations.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sign up</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Draws</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planning</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Managing</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {region.locations.map((location, idx) => (
                        <tr key={location.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {idx + 1}. {location.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/signup`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {location.signUp}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/categories`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {location.categories}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/draws`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {location.draws}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {location.sessions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/planning`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {location.planning}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/managing`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {location.managing}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}