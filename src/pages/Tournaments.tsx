import React, { useState, useMemo } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useDataPersistence } from '../context/DataPersistenceContext';
import { globalSettings } from '../data/mockData';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Trophy, Clock, Target, Award, Search, X, Filter } from 'lucide-react';

// Generate UUID function
const generateUUID = () => {
  return 'T' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

interface RegionLocation {
  region: string;
  locations: string[];
}

interface Tournament {
  id: string;
  name: string;
  classification: string;
  start_date: string;
  end_date: string;
  status: 'Upcoming' | 'In Progress' | 'Not Active' | 'Ended';
  region_locations: RegionLocation[];
  is_team_tournament: boolean;
  description?: string;
}

const getStatusColor = (status: Tournament['status']) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-warning-100 text-warning-800';
    case 'In Progress':
      return 'bg-success-100 text-success-800';
    case 'Not Active':
      return 'bg-gray-100 text-gray-800';
    case 'Ended':
      return 'bg-danger-100 text-danger-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const emptyTournament: Tournament = {
  id: '',
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
  is_team_tournament: false,
  description: ''
};

const classifications = ['Amateur', 'Professional', 'Junior', 'Senior'];
const statuses: Tournament['status'][] = ['Upcoming', 'In Progress', 'Not Active', 'Ended'];
const regions = ['North', 'South', 'Central'];

// Mock locations data - in a real app this would come from a database
const mockLocations = [
  { id: '1', name: 'Central Tennis Club', address: '123 Main St', region: 'Central', active: true },
  { id: '2', name: 'North Sports Complex', address: '456 North Ave', region: 'North', active: true },
  { id: '3', name: 'South Tennis Center', address: '789 South Blvd', region: 'South', active: true },
  { id: '4', name: 'Elite Tennis Academy', address: '321 Elite Dr', region: 'North', active: true },
  { id: '5', name: 'Community Courts', address: '654 Community Rd', region: 'Central', active: true },
  { id: '6', name: 'Riverside Tennis Club', address: '987 River St', region: 'South', active: true },
];

export default function Tournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useDataPersistence();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTeamTournaments, setShowTeamTournaments] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [newTournament, setNewTournament] = useState<Tournament>(emptyTournament);
  const [locations, setLocations] = useState(mockLocations);
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    tournament: Tournament | null;
  }>({
    isOpen: false,
    tournament: null
  });

  // Convert existing tournaments to new format if needed
  const formattedTournaments: Tournament[] = tournaments.map(t => ({
    id: t.id,
    name: t.name,
    classification: t.classification || 'Amateur',
    start_date: t.startDate,
    end_date: t.endDate,
    status: (t.status === 'ongoing' ? 'In Progress' : 
             t.status === 'sign up' ? 'Upcoming' : 
             t.status === 'completed' ? 'Ended' : 'Not Active') as Tournament['status'],
    region_locations: [
      { region: 'Central', locations: [t.location] }
    ],
    is_team_tournament: false,
    description: t.description
  }));

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

  const filteredTournaments = formattedTournaments.filter(tournament => {
    // Filter by tournament type
    if (tournament.is_team_tournament !== showTeamTournaments) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        tournament.name,
        tournament.classification,
        tournament.status,
        ...tournament.region_locations.flatMap(rl => [rl.region, ...rl.locations])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) return false;
    }

    // Classification filter
    const matchesClassification = selectedFilters.classification.length === 0 || 
      selectedFilters.classification.includes(tournament.classification);

    // Status filter
    const matchesStatus = selectedFilters.status.length === 0 || 
      selectedFilters.status.includes(tournament.status);

    // Region filter
    const matchesRegion = selectedFilters.region.length === 0 || 
      tournament.region_locations.some(rl => selectedFilters.region.includes(rl.region));

    // Location filter
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

  const columns = [
    { header: 'ID', key: 'id', width: '80px' },
    { header: 'Tournament Name', key: 'name' },
    { header: 'Classification', key: 'classification' },
    { 
      header: 'Dates', 
      key: 'dates',
      render: (_, row: Tournament) => (
        <div className="text-sm">
          <div>From: {row.start_date}</div>
          <div>To: {row.end_date}</div>
        </div>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: Tournament['status']) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      header: 'Regions', 
      key: 'regions',
      render: (_, row: Tournament) => (
        <div className="text-sm">
          {row.region_locations.map((rl, index) => (
            <div key={index}>{rl.region}</div>
          ))}
        </div>
      )
    },
    { 
      header: 'Locations', 
      key: 'locations',
      render: (_, row: Tournament) => (
        <div className="text-sm">
          {row.region_locations.map((rl, index) => (
            <div key={index}>{rl.locations.join(', ')}</div>
          ))}
        </div>
      )
    },
    { 
      header: 'Type', 
      key: 'type',
      render: (_, row: Tournament) => (
        <span className="text-sm">
          {row.is_team_tournament ? 'Teams' : 'Individual'}
        </span>
      )
    },
  ];

  const actions = [
    { 
      label: 'Edit', 
      action: 'edit', 
      variant: 'secondary' as const,
      icon: <Edit className="h-4 w-4" />
    },
    { 
      label: 'Delete', 
      action: 'delete', 
      variant: 'danger' as const,
      icon: <Trash2 className="h-4 w-4" />
    },
  ];

  const handleAction = (action: string, tournament: Tournament) => {
    if (action === 'edit') {
      setSelectedTournament(tournament);
      setEditingTournament(tournament);
      setNewTournament(tournament);
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        tournament: tournament
      });
    }
  };

  const handleDeleteTournament = () => {
    if (confirmDialog.tournament) {
      deleteTournament(confirmDialog.tournament.id);
      setConfirmDialog({ isOpen: false, tournament: null });
    }
  };

  const handleRowClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsDetailModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleAddNewLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation = {
      id: Date.now().toString(),
      ...newLocationData,
      active: true
    };
    setLocations(prev => [...prev, newLocation]);
    setNewLocationData({ name: '', address: '', region: 'North' });
    setIsLocationModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty locations and regions with no locations
    const filteredRegionLocations = newTournament.region_locations
      .map(rl => ({
        ...rl,
        locations: rl.locations.filter(loc => loc.trim() !== '')
      }))
      .filter(rl => rl.locations.length > 0);

    const tournamentData = {
      ...newTournament,
      id: newTournament.id || generateUUID(),
      region_locations: filteredRegionLocations
    };

    // Convert back to old format for storage
    const oldFormatTournament = {
      id: tournamentData.id,
      name: tournamentData.name,
      organization: 'Tennis Federation', // Default organization
      status: tournamentData.status === 'In Progress' ? 'ongoing' : 
              tournamentData.status === 'Upcoming' ? 'sign up' : 
              tournamentData.status === 'Ended' ? 'completed' : 'create',
      startDate: tournamentData.start_date,
      endDate: tournamentData.end_date,
      location: tournamentData.region_locations[0]?.locations[0] || '',
      description: tournamentData.description,
      classification: tournamentData.classification,
      courtSize: 'Full Court',
      ballType: 'Yellow',
      participants: [],
      matches: [],
    };

    if (editingTournament) {
      updateTournament(editingTournament.id, oldFormatTournament);
    } else {
      addTournament(oldFormatTournament);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingTournament(null);
    setSelectedTournament(null);
    setNewTournament(emptyTournament);
  };

  const handleCreateTournament = () => {
    setEditingTournament(null);
    setSelectedTournament(null);
    setNewTournament(emptyTournament);
    setIsCreateModalOpen(true);
  };

  const FilterDropdown = ({ title, options }: { title: string, options: string[] }) => {
    const filterKey = title.toLowerCase() as keyof typeof selectedFilters;
    const activeFilters = selectedFilters[filterKey];
    
    return (
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm"
          className={`flex items-center ${activeFilters.length > 0 ? 'bg-primary-50 border-primary-300' : ''}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          {title}
          {activeFilters.length > 0 && (
            <span className="ml-2 bg-primary-600 text-white rounded-full px-2 py-0.5 text-xs">
              {activeFilters.length}
            </span>
          )}
        </Button>
        {/* Filter dropdown implementation would go here */}
      </div>
    );
  };

  const TournamentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tournament Name *
        </label>
        <input
          type="text"
          name="name"
          value={newTournament.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter tournament name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Classification *
          </label>
          <select
            name="classification"
            value={newTournament.classification}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select classification</option>
            {classifications.map(classification => (
              <option key={classification} value={classification}>{classification}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tournament Type *
          </label>
          <select
            name="is_team_tournament"
            value={newTournament.is_team_tournament.toString()}
            onChange={(e) => setNewTournament(prev => ({ ...prev, is_team_tournament: e.target.value === 'true' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="false">Individual Tournament</option>
            <option value="true">Team Tournament</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Start Date *
          </label>
          <input
            type="date"
            name="start_date"
            value={newTournament.start_date}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            End Date *
          </label>
          <input
            type="date"
            name="end_date"
            value={newTournament.end_date}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Status *
        </label>
        <select
          name="status"
          value={newTournament.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-text-primary">Locations by Region</h4>
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => setIsLocationModalOpen(true)}
          >
            Add New Location
          </Button>
        </div>
        
        {newTournament.region_locations.map((regionLocation, regionIndex) => (
          <div key={regionLocation.region} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-text-primary mb-3">{regionLocation.region} Region</h5>
            {regionLocation.locations.map((location, locationIndex) => (
              <div key={locationIndex} className="flex items-center gap-2 mb-2">
                <select
                  value={location}
                  onChange={(e) => handleLocationChange(regionIndex, locationIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required={locationIndex === 0} // First location is mandatory
                >
                  <option value="">Select location</option>
                  {getLocationsByRegion(regionLocation.region).map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
                {locationIndex === 0 && (
                  <span className="text-danger-500 text-sm">*</span>
                )}
                {locationIndex > 0 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeLocationField(regionIndex, locationIndex)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addLocationField(regionIndex)}
              className="mt-2"
            >
              + Add another location
            </Button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={newTournament.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Tournament description..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedTournament(null);
            setEditingTournament(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingTournament ? 'Save Changes' : 'Add Tournament'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tournaments</h1>
          <p className="text-text-secondary mt-1">Manage tournaments and competitions with regional locations</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Tournament Type Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text-secondary">Individual</span>
            <button
              onClick={() => setShowTeamTournaments(!showTeamTournaments)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                showTeamTournaments ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showTeamTournaments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-text-secondary">Teams</span>
          </div>
          
          <Button onClick={handleCreateTournament} className="flex items-center" data-action="add-tournament">
            <Plus className="h-4 w-4 mr-2" />
            Add Tournament
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tournaments by name, classification, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <FilterDropdown title="Classification" options={classifications} />
          <FilterDropdown title="Status" options={statuses} />
          <FilterDropdown title="Region" options={regions} />
          <FilterDropdown title="Location" options={allLocations} />
        </div>
      </div>

      {/* Search Results Info */}
      {(searchQuery || Object.values(selectedFilters).some(f => f.length > 0)) && (
        <div className="text-sm text-text-secondary">
          Showing {filteredTournaments.length} of {formattedTournaments.length} tournaments
          {searchQuery && (
            <span className="ml-2">
              for "<span className="font-medium text-text-primary">{searchQuery}</span>"
            </span>
          )}
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          data={filteredTournaments}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No tournaments found matching "${searchQuery}"` : "No tournaments available"}
        />
      </Card>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Tournament"
        size="lg"
      >
        <TournamentForm />
      </Modal>

      {/* Edit Tournament Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTournament(null);
          setEditingTournament(null);
        }}
        title="Edit Tournament"
        size="lg"
      >
        <TournamentForm />
      </Modal>

      {/* Add Location Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Add New Location"
        size="md"
      >
        <form onSubmit={handleAddNewLocation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Location Name *
            </label>
            <input
              type="text"
              value={newLocationData.name}
              onChange={(e) => setNewLocationData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Address
            </label>
            <input
              type="text"
              value={newLocationData.address}
              onChange={(e) => setNewLocationData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Region *
            </label>
            <select
              value={newLocationData.region}
              onChange={(e) => setNewLocationData(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button 
              variant="secondary" 
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Add Location
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tournament Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTournament(null);
        }}
        title="Tournament Details"
        size="xl"
      >
        {selectedTournament && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">{selectedTournament.name}</h3>
                <p className="text-text-secondary">{selectedTournament.classification} Tournament</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTournament.status)}`}>
                    {selectedTournament.status}
                  </span>
                  <div className="flex items-center text-sm text-text-muted">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedTournament.start_date} to {selectedTournament.end_date}
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Tournament Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Tournament ID</p>
                      <p className="text-text-primary font-mono">{selectedTournament.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Classification</p>
                      <p className="text-text-primary">{selectedTournament.classification}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Tournament Type</p>
                      <p className="text-text-primary">
                        {selectedTournament.is_team_tournament ? 'Team Tournament' : 'Individual Tournament'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Duration</p>
                      <p className="text-text-primary">
                        {selectedTournament.start_date} to {selectedTournament.end_date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Locations & Regions
                </h4>
                
                <div className="space-y-3">
                  {selectedTournament.region_locations.map((regionLocation, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                        <span className="font-medium text-text-primary">{regionLocation.region} Region</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {regionLocation.locations.map((location, locIndex) => (
                          <p key={locIndex} className="text-sm text-text-secondary">• {location}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedTournament.description && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Description
                </h4>
                <p className="text-text-primary leading-relaxed">{selectedTournament.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedTournament(selectedTournament);
                  setEditingTournament(selectedTournament);
                  setNewTournament(selectedTournament);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Tournament
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    tournament: selectedTournament
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tournament
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, tournament: null })}
        onConfirm={handleDeleteTournament}
        title="Delete Tournament"
        message="Are you sure you want to permanently delete this tournament?"
        itemName={confirmDialog.tournament?.name}
        itemType="Tournament"
        details={[
          'Tournament structure and format settings',
          'All match schedules and results',
          'Player and team registrations',
          'Tournament history and statistics',
          'Associated rankings and points'
        ]}
        warningLevel="high"
        confirmText="Delete Tournament"
        cancelText="Keep Tournament"
      />
    </div>
  );
}