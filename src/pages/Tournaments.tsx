import React, { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Dialog, Transition, Menu } from '@headlessui/react';
import { supabase } from '../lib/supabase';
import Breadcrumbs from './Breadcrumbs';
import { Plus, Edit, Trash2, Filter, X, Check, Calendar, MapPin, Users, Trophy, Clock, Target, Award } from 'lucide-react';

interface RegionLocation {
  region: string;
  locations: string[];
}

interface Tournament {
  id?: string;
  name: string;
  classification: string;
  start_date: string;
  end_date: string;
  status: 'Upcoming' | 'In Progress' | 'Not Active' | 'Ended';
  region_locations: RegionLocation[];
  is_team_tournament: boolean;
  active?: boolean;
}

interface Location {
  id: string;
  name: string;
  address: string;
  region: string;
  active: boolean;
}

const getStatusColor = (status: Tournament['status']) => {
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

const emptyTournament: Tournament = {
  name: '',
  classification: '',
  start_date: '',
  end_date: '',
  status: 'Upcoming',
  region_locations: [
    { region: 'North', locations: [''] },
    { region: 'South', locations: [''] },
    { region: 'Central', locations: [''] }
  ],
  is_team_tournament: false
};

const classifications = ['Amateur', 'Professional', 'Junior', 'Senior'];
const statuses = ['Upcoming', 'In Progress', 'Not Active', 'Ended'];
const regions = ['North', 'South', 'Central'];

export default function Tournaments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showTeamTournaments, setShowTeamTournaments] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deletingTournament, setDeletingTournament] = useState<Tournament | null>(null);
  const [newTournament, setNewTournament] = useState<Tournament>(emptyTournament);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    address: '',
    region: 'North'
  });
  const [selectedFilters, setSelectedFilters] = useState<{
    classification: string[];
    status: string[];
    region: string[];
    location: string[];
  }>({
    classification: [],
    status: [],
    region: [],
    location: []
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tournaments', current: true }
  ];

  useEffect(() => {
    fetchTournaments();
    fetchLocations();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('tournaments')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tournaments:', error);
        throw new Error(`Failed to fetch tournaments: ${error.message}`);
      }
      
      setTournaments(data || []);
    } catch (error: any) {
      console.error('Error in fetchTournaments:', error);
      setError(error.message || 'Failed to fetch tournaments. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('active', true)
        .order('region', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching locations:', error);
        throw new Error(`Failed to fetch locations: ${error.message}`);
      }
      
      setLocations(data || []);
    } catch (error: any) {
      console.error('Error in fetchLocations:', error);
      setError(`Error fetching locations: ${error.message}`);
    }
  };

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const currentFilter = prev[filterType];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(v => v !== value)
        : [...currentFilter, value];
      
      return {
        ...prev,
        [filterType]: newFilter
      };
    });
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (tournament.is_team_tournament !== showTeamTournaments) return false;

    const matchesClassification = selectedFilters.classification.length === 0 || 
      selectedFilters.classification.includes(tournament.classification);

    const matchesStatus = selectedFilters.status.length === 0 || 
      selectedFilters.status.includes(tournament.status);

    const matchesRegion = selectedFilters.region.length === 0 || 
      tournament.region_locations.some(rl => selectedFilters.region.includes(rl.region));

    const matchesLocation = selectedFilters.location.length === 0 || 
      tournament.region_locations.some(rl => 
        rl.locations.some(loc => selectedFilters.location.includes(loc))
      );

    return matchesClassification && matchesStatus && matchesRegion && matchesLocation;
  });

  const getLocationsByRegion = (region: string) => {
    return locations.filter(loc => loc.region === region);
  };

  const allLocations = locations.map(loc => loc.name);

  const FilterDropdown = ({ title, options }: { title: string, options: string[] }) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
        <Filter className="h-4 w-4 mr-2" />
        {title}
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {options.map(option => (
            <Menu.Item key={option}>
              {({ active }) => (
                <label
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center px-4 py-2 text-sm text-gray-700`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[title.toLowerCase() as keyof typeof selectedFilters].includes(option)}
                    onChange={() => handleFilterChange(title.toLowerCase() as keyof typeof selectedFilters, option)}
                    className="mr-2 rounded border-gray-300"
                  />
                  {option}
                </label>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );

  const handleStatusChange = async (tournamentId: string, newStatus: Tournament['status']) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ status: newStatus })
        .eq('id', tournamentId);

      if (error) throw error;

      setTournaments(prev => prev.map(tournament =>
        tournament.id === tournamentId
          ? { ...tournament, status: newStatus }
          : tournament
      ));
      
      setSuccess(`Tournament status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error updating tournament status:', error);
      setError(error.message);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setNewTournament(tournament);
    setIsModalOpen(true);
  };

  const handleDelete = (tournament: Tournament) => {
    setDeletingTournament(tournament);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTournament) return;
    
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', deletingTournament.id);

      if (error) throw error;

      setTournaments(prev => prev.filter(t => t.id !== deletingTournament.id));
      setSuccess(`Tournament "${deletingTournament.name}" has been deleted`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error deleting tournament:', error);
      setError(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingTournament(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewTournament(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleLocationChange = (regionIndex: number, locationIndex: number, value: string) => {
    setNewTournament(prev => {
      const newRegionLocations = [...prev.region_locations];
      newRegionLocations[regionIndex] = {
        ...newRegionLocations[regionIndex],
        locations: newRegionLocations[regionIndex].locations.map((loc, idx) =>
          idx === locationIndex ? value : loc
        )
      };
      return { ...prev, region_locations: newRegionLocations };
    });
  };

  const addLocationField = (regionIndex: number) => {
    setNewTournament(prev => {
      const newRegionLocations = [...prev.region_locations];
      newRegionLocations[regionIndex] = {
        ...newRegionLocations[regionIndex],
        locations: [...newRegionLocations[regionIndex].locations, '']
      };
      return { ...prev, region_locations: newRegionLocations };
    });
  };

  const removeLocationField = (regionIndex: number, locationIndex: number) => {
    setNewTournament(prev => {
      const newRegionLocations = [...prev.region_locations];
      newRegionLocations[regionIndex] = {
        ...newRegionLocations[regionIndex],
        locations: newRegionLocations[regionIndex].locations.filter((_, idx) => idx !== locationIndex)
      };
      return { ...prev, region_locations: newRegionLocations };
    });
  };

  const handleAddNewLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          name: newLocationData.name,
          address: newLocationData.address,
          region: newLocationData.region,
          active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setLocations(prev => [...prev, data]);
      setNewLocationData({ name: '', address: '', region: 'North' });
      setIsLocationModalOpen(false);
      setSuccess(`Location "${newLocationData.name}" has been added`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error adding location:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      // Filter out empty locations and regions with no locations
      const filteredRegionLocations = newTournament.region_locations
        .map(rl => ({
          ...rl,
          locations: rl.locations.filter(loc => loc.trim() !== '')
        }))
        .filter(rl => rl.locations.length > 0);

      const tournamentData = {
        ...newTournament,
        region_locations: filteredRegionLocations
      };

      if (editingTournament) {
        const { error } = await supabase
          .from('tournaments')
          .update(tournamentData)
          .eq('id', editingTournament.id);

        if (error) throw error;
        
        setSuccess(`Tournament "${tournamentData.name}" has been updated`);
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert([tournamentData]);

        if (error) throw error;
        
        setSuccess(`Tournament "${tournamentData.name}" has been created`);
      }

      await fetchTournaments();
      setIsModalOpen(false);
      setEditingTournament(null);
      setNewTournament(emptyTournament);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving tournament:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading tournaments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold text-gray-900">Tournaments</h2>
          <p className="mt-2 text-sm text-gray-700">A list of all tournaments including their details.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Individual</span>
            <Switch
              checked={showTeamTournaments}
              onChange={setShowTeamTournaments}
              className={`${
                showTeamTournaments ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  showTeamTournaments ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="text-sm font-medium text-gray-700">Teams</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingTournament(null);
              setNewTournament({
                ...emptyTournament,
                is_team_tournament: showTeamTournaments
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tournament
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccess(null)}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-4 mb-6">
        <FilterDropdown title="Classification" options={classifications} />
        <FilterDropdown title="Status" options={statuses} />
        <FilterDropdown title="Region" options={regions} />
        <FilterDropdown title="Location" options={allLocations} />
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tournament name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Classification</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dates</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Regions</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Locations</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTournaments.length > 0 ? (
                    filteredTournaments.map((tournament) => (
                      <tr key={tournament.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <Link 
                            to={tournament.is_team_tournament ? 
                              `/tournaments/${encodeURIComponent(tournament.name)}/team` :
                              `/tournaments/${encodeURIComponent(tournament.name)}`
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {tournament.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{tournament.classification}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            <div>
                              <div>From: {new Date(tournament.start_date).toLocaleDateString()}</div>
                              <div>To: {new Date(tournament.end_date).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={tournament.status}
                            onChange={(e) => handleStatusChange(tournament.id!, e.target.value as Tournament['status'])}
                            className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 border-0 ${getStatusColor(tournament.status)}`}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Not Active">Not Active</option>
                            <option value="Ended">Ended</option>
                          </select>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {tournament.region_locations.map((rl) => (
                            <div key={rl.region} className="whitespace-nowrap flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {rl.region}
                            </div>
                          ))}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {tournament.region_locations.map((rl) => (
                            <div key={rl.region} className="whitespace-nowrap">
                              {rl.locations.join(', ')}
                            </div>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tournament.is_team_tournament 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tournament.is_team_tournament ? 'Teams' : 'Individual'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEdit(tournament)}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(tournament)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        No tournaments found. {showTeamTournaments ? 'Try switching to Individual tournaments or add a new Team tournament.' : 'Try switching to Team tournaments or add a new Individual tournament.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tournament Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center"
                  >
                    {editingTournament ? (
                      <>
                        <Edit className="h-5 w-5 mr-2 text-blue-600" />
                        Edit Tournament
                      </>
                    ) : (
                      <>
                        <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                        Add New Tournament
                      </>
                    )}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={newTournament.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Classification *</label>
                          <select
                            name="classification"
                            value={newTournament.classification}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select classification</option>
                            {classifications.map(classification => (
                              <option key={classification} value={classification}>{classification}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tournament Type *</label>
                          <select
                            name="is_team_tournament"
                            value={newTournament.is_team_tournament.toString()}
                            onChange={(e) => setNewTournament(prev => ({ ...prev, is_team_tournament: e.target.value === 'true' }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          >
                            <option value="false">Individual Tournament</option>
                            <option value="true">Team Tournament</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                          <input
                            type="date"
                            name="start_date"
                            value={newTournament.start_date}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date *</label>
                          <input
                            type="date"
                            name="end_date"
                            value={newTournament.end_date}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status *</label>
                        <select
                          name="status"
                          value={newTournament.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Locations by Region</h4>
                          <button
                            type="button"
                            onClick={() => setIsLocationModalOpen(true)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add New Location
                          </button>
                        </div>
                        
                        {newTournament.region_locations.map((regionLocation, regionIndex) => (
                          <div key={regionLocation.region} className="mb-6 p-4 border rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {regionLocation.region} Region
                            </h5>
                            {regionLocation.locations.map((location, locationIndex) => (
                              <div key={locationIndex} className="flex items-center gap-2 mb-2">
                                <select
                                  value={location}
                                  onChange={(e) => handleLocationChange(regionIndex, locationIndex, e.target.value)}
                                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required={locationIndex === 0} // First location is mandatory
                                >
                                  <option value="">Select location</option>
                                  {getLocationsByRegion(regionLocation.region).map(loc => (
                                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                                  ))}
                                </select>
                                {locationIndex === 0 && (
                                  <span className="text-red-500 text-sm">*</span>
                                )}
                                {locationIndex > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLocationField(regionIndex, locationIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addLocationField(regionIndex)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-2"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add another location
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {editingTournament ? 'Save Changes' : 'Add Tournament'}
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Location Modal */}
      <Transition appear show={isLocationModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsLocationModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center"
                  >
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Add New Location
                  </Dialog.Title>
                  <form onSubmit={handleAddNewLocation}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location Name *</label>
                        <input
                          type="text"
                          value={newLocationData.name}
                          onChange={(e) => setNewLocationData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          value={newLocationData.address}
                          onChange={(e) => setNewLocationData(prev => ({ ...prev, address: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Region *</label>
                        <select
                          value={newLocationData.region}
                          onChange={(e) => setNewLocationData(prev => ({ ...prev, region: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsLocationModalOpen(false)}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Add Location
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-600 mb-4 flex items-center"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Tournament
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the tournament "{deletingTournament?.name}"? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}