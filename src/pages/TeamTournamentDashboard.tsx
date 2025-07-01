import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Breadcrumbs from './Breadcrumbs';

interface RegionData {
  name: string;
  locations: {
    name: string;
    teams: number;
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

export default function TeamTournamentDashboard() {
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
      teams: 8 - (idx * 2) // Mock data - replace with real data
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
              <p className="text-lg text-gray-600 mt-1">Team Tournament Dashboard</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Classification: {tournament.classification}</span>
                <span>Status: {tournament.status}</span>
                <span>Type: Team Tournament</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {regions.map((region) => (
            <div key={region.name} className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{region.name} Region</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {region.locations.map((location, idx) => (
                      <tr key={location.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {idx + 1}. {location.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Link 
                            to={`/tournaments/${encodeURIComponent(name!)}/team-signup`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {location.teams}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}