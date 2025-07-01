import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Breadcrumbs from './Breadcrumbs';
import { Calendar, MapPin, Users, Trophy, Clock, Target, Award, ChevronRight, FileText, CheckCircle, XCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTournament();
  }, [name]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('name', name)
        .eq('is_team_tournament', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Tournament not found');
        } else {
          throw error;
        }
      }
      
      setTournament(data);
    } catch (error: any) {
      console.error('Error fetching tournament:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: name || 'Tournament', current: true }
  ];

  // Generate regions data from tournament data with realistic numbers
  const regions: RegionData[] = tournament?.region_locations?.map((rl: any) => ({
    name: rl.region,
    locations: rl.locations.map((location: string, idx: number) => {
      // Generate realistic data based on location index
      const baseSignUp = 80 + Math.floor(Math.random() * 60); // 80-140 players
      const baseCategories = 6 + Math.floor(Math.random() * 6); // 6-12 categories
      const baseSessions = 2 + Math.floor(Math.random() * 3); // 2-5 sessions
      const baseDraws = 4 + Math.floor(Math.random() * 5); // 4-9 draws
      
      return {
        name: location,
        signUp: baseSignUp - (idx * 10), // Fewer signups for secondary locations
        categories: baseCategories - Math.min(idx, baseCategories - 1), // At least 1 category
        sessions: baseSessions - Math.min(idx, baseSessions - 1), // At least 1 session
        draws: baseDraws - Math.min(idx * 2, baseDraws - 1), // At least 1 draw
        planning: "Planning",
        managing: "Managing"
      };
    })
  })) || [];

  const getTournamentStatusClass = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Not Active':
        return 'bg-gray-100 text-gray-800';
      case 'Ended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationClass = (classification: string) => {
    switch (classification) {
      case 'Professional':
        return 'bg-blue-100 text-blue-800';
      case 'Amateur':
        return 'bg-green-100 text-green-800';
      case 'Junior':
        return 'bg-orange-100 text-orange-800';
      case 'Senior':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (error || !tournament) {
    return (
      <div className="p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Tournament not found</h3>
            <p className="text-gray-600 mt-2">{error || "The tournament you're looking for doesn't exist."}</p>
            <div className="mt-4">
              <Link
                to="/tournaments"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Tournaments
              </Link>
            </div>
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
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTournamentStatusClass(tournament.status)}`}>
                  {tournament.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClassificationClass(tournament.classification)}`}>
                  {tournament.classification}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Individual Tournament
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{tournament.region_locations.map(rl => rl.region).join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to={`/tournaments/${encodeURIComponent(tournament.name)}/edit`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Tournament
              </Link>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Participants</p>
              <p className="text-2xl font-bold text-blue-800">
                {regions.reduce((sum, region) => 
                  sum + region.locations.reduce((locSum, loc) => locSum + loc.signUp, 0), 0)}
              </p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Categories</p>
              <p className="text-2xl font-bold text-green-800">
                {regions.reduce((sum, region) => 
                  sum + region.locations.reduce((locSum, loc) => locSum + loc.categories, 0), 0)}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Draws</p>
              <p className="text-2xl font-bold text-purple-800">
                {regions.reduce((sum, region) => 
                  sum + region.locations.reduce((locSum, loc) => locSum + loc.draws, 0), 0)}
              </p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 flex items-center">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Sessions</p>
              <p className="text-2xl font-bold text-orange-800">
                {regions.reduce((sum, region) => 
                  sum + region.locations.reduce((locSum, loc) => locSum + loc.sessions, 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {regions.map((region) => (
            <div key={region.name} className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                {region.name} Region
              </h2>
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
                        <tr key={location.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {idx + 1}. {location.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/signup`}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              {location.signUp}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/categories`}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              {location.categories}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/draws`}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              {location.draws}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <span className="font-medium">{location.sessions}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/planning`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <span>View Planning</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/tournaments/${encodeURIComponent(name!)}/managing`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <span>View Management</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
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

        {/* Tournament Status Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournament Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Completion Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sign-up Phase</span>
                  <span className="flex items-center">
                    {tournament.status === 'Upcoming' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                    )}
                    <span className={tournament.status === 'Upcoming' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {tournament.status === 'Upcoming' ? 'Active' : 'Completed'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tournament Setup</span>
                  <span className="flex items-center">
                    {tournament.status === 'Upcoming' || tournament.status === 'In Progress' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                    )}
                    <span className={tournament.status === 'Upcoming' || tournament.status === 'In Progress' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {tournament.status === 'Upcoming' ? 'In Progress' : tournament.status === 'In Progress' ? 'Completed' : 'Completed'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Matches</span>
                  <span className="flex items-center">
                    {tournament.status === 'In Progress' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    ) : tournament.status === 'Ended' ? (
                      <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                    )}
                    <span className={tournament.status === 'In Progress' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {tournament.status === 'In Progress' ? 'Active' : tournament.status === 'Ended' ? 'Completed' : 'Not Started'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Results</span>
                  <span className="flex items-center">
                    {tournament.status === 'Ended' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-1" />
                    )}
                    <span className={tournament.status === 'Ended' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {tournament.status === 'Ended' ? 'Published' : 'Not Available'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/tournaments/${encodeURIComponent(name!)}/signup`}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Participants
                </Link>
                <Link
                  to={`/tournaments/${encodeURIComponent(name!)}/draws`}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Draws
                </Link>
                <Link
                  to={`/tournaments/${encodeURIComponent(name!)}/schedule`}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Matches
                </Link>
                <Link
                  to={`/tournaments/${encodeURIComponent(name!)}/results`}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Enter Results
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Edit(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}