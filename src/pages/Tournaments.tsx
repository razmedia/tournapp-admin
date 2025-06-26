import React, { useState } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useDataPersistence } from '../context/DataPersistenceContext';
import { Tournament } from '../types';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Trophy, Clock, Target, Award } from 'lucide-react';

// Generate UUID function
const generateUUID = () => {
  return 'T' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export default function Tournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useDataPersistence();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    tournament: Tournament | null;
  }>({
    isOpen: false,
    tournament: null
  });
  const [formData, setFormData] = useState({
    name: '',
    organization: 'Tennis Federation',
    status: 'create',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    courtSize: 'Full Court',
    ballType: 'Yellow',
  });

  const columns = [
    { header: 'ID', key: 'id', width: '80px' },
    { header: 'Name', key: 'name' },
    { header: 'Organization', key: 'organization' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'ongoing' ? 'bg-success-100 text-success-800' :
          value === 'sign up' ? 'bg-primary-100 text-primary-800' :
          value === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      )
    },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { header: 'Location', key: 'location' },
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
      setFormData({
        name: tournament.name,
        organization: tournament.organization,
        status: tournament.status,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        location: tournament.location,
        description: tournament.description || '',
        courtSize: tournament.courtSize || 'Full Court',
        ballType: tournament.ballType || 'Yellow',
      });
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

  const handleSave = () => {
    const tournamentData: Tournament = {
      id: selectedTournament?.id || generateUUID(),
      name: formData.name,
      organization: formData.organization,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      description: formData.description,
      courtSize: formData.courtSize,
      ballType: formData.ballType,
      participants: selectedTournament?.participants || [],
      matches: selectedTournament?.matches || [],
    };

    if (selectedTournament && isEditModalOpen) {
      updateTournament(selectedTournament.id, tournamentData);
    } else {
      addTournament(tournamentData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTournament(null);
    resetForm();
  };

  const handleCreateTournament = () => {
    setSelectedTournament(null);
    resetForm();
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      organization: 'Tennis Federation',
      status: 'create',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      courtSize: 'Full Court',
      ballType: 'Yellow',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDeleteDetails = (tournament: Tournament) => {
    const details = [
      'Tournament structure and format settings',
      'All match schedules and results',
      'Player and team registrations'
    ];

    if (tournament.participants && tournament.participants.length > 0) {
      details.push(`${tournament.participants.length} registered participants`);
    }

    if (tournament.matches && tournament.matches.length > 0) {
      details.push(`${tournament.matches.length} scheduled/completed matches`);
    }

    if (tournament.status === 'ongoing') {
      details.push('⚠️ Tournament is currently ongoing');
    }

    details.push('Tournament history and statistics');
    details.push('Associated rankings and points');

    return details;
  };

  const TournamentForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter tournament name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Organization
          </label>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Tennis Federation">Tennis Federation</option>
            <option value="City Club">City Club</option>
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
            name="startDate"
            value={formData.startDate}
            onChange={handleFormChange}
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
            name="endDate"
            value={formData.endDate}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleFormChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Tournament location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Court Size
          </label>
          <select
            name="courtSize"
            value={formData.courtSize}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Full Court">Full Court</option>
            <option value="Half Court">Half Court</option>
            <option value="3/4 Court">3/4 Court</option>
            <option value="Mini Tennis">Mini Tennis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Ball Type
          </label>
          <select
            name="ballType"
            value={formData.ballType}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Orange">Orange</option>
            <option value="Red">Red</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
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
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedTournament ? 'Update Tournament' : 'Create Tournament'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tournaments</h1>
          <p className="text-text-secondary mt-1">Manage tournaments and competitions</p>
        </div>
        <Button onClick={handleCreateTournament} className="flex items-center" data-action="add-tournament">
          <Plus className="h-4 w-4 mr-2" />
          Add Tournament
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={tournaments}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
        />
      </Card>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Tournament"
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
        }}
        title="Edit Tournament"
        size="lg"
      >
        <TournamentForm />
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
                <p className="text-text-secondary">{selectedTournament.organization}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTournament.status === 'ongoing' ? 'bg-success-100 text-success-800' :
                    selectedTournament.status === 'sign up' ? 'bg-primary-100 text-primary-800' :
                    selectedTournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-warning-100 text-warning-800'
                  }`}>
                    {selectedTournament.status}
                  </span>
                  <div className="flex items-center text-sm text-text-muted">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedTournament.location}
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
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Duration</p>
                      <p className="text-text-primary">
                        {selectedTournament.startDate} to {selectedTournament.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Location</p>
                      <p className="text-text-primary">{selectedTournament.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Court Size</p>
                      <p className="text-text-primary">{selectedTournament.courtSize || 'Full Court'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-3 rounded-full bg-yellow-400"></div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Ball Type</p>
                      <p className="text-text-primary">{selectedTournament.ballType || 'Yellow'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Tournament Statistics
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {selectedTournament.participants?.length || 0}
                    </div>
                    <div className="text-sm text-text-secondary">Participants</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-success-600">
                      {selectedTournament.matches?.length || 0}
                    </div>
                    <div className="text-sm text-text-secondary">Matches</div>
                  </div>
                </div>

                {selectedTournament.description && (
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">Description</p>
                    <p className="text-text-primary text-sm leading-relaxed">
                      {selectedTournament.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Section */}
            {selectedTournament.participants && selectedTournament.participants.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Participants ({selectedTournament.participants.length})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTournament.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          participant.role === 'Player' ? 'bg-primary-100 text-primary-700' :
                          participant.role === 'Coach' ? 'bg-success-100 text-success-700' :
                          'bg-warning-100 text-warning-700'
                        }`}>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{participant.name}</p>
                          <p className="text-xs text-text-muted">{participant.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Quick Actions
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="secondary" size="sm" className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Participants
                </Button>
                <Button variant="secondary" size="sm" className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Matches
                </Button>
                <Button variant="secondary" size="sm" className="flex items-center justify-center">
                  <Award className="h-4 w-4 mr-2" />
                  View Results
                </Button>
                <Button variant="secondary" size="sm" className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Publish Times
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedTournament(selectedTournament);
                  setFormData({
                    name: selectedTournament.name,
                    organization: selectedTournament.organization,
                    status: selectedTournament.status,
                    startDate: selectedTournament.startDate,
                    endDate: selectedTournament.endDate,
                    location: selectedTournament.location,
                    description: selectedTournament.description || '',
                    courtSize: selectedTournament.courtSize || 'Full Court',
                    ballType: selectedTournament.ballType || 'Yellow',
                  });
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

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, tournament: null })}
        onConfirm={handleDeleteTournament}
        title="Delete Tournament"
        message="Are you sure you want to permanently delete this tournament?"
        itemName={confirmDialog.tournament?.name}
        itemType="Tournament"
        details={confirmDialog.tournament ? getDeleteDetails(confirmDialog.tournament) : []}
      />
    </div>
  );
}