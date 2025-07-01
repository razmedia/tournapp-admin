import React, { useState } from 'react';
import Tabs from '../components/UI/Tabs';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { Plus, Edit, Trash2, Award, Trophy, Target, Calendar, Users, Star, TrendingUp, Download, Upload, Filter, Search, X } from 'lucide-react';

export default function Ranking() {
  const [isCreatePointsModalOpen, setIsCreatePointsModalOpen] = useState(false);
  const [isEditPointsModalOpen, setIsEditPointsModalOpen] = useState(false);
  const [selectedPointsRule, setSelectedPointsRule] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for ranking points
  const mockPointsRules = [
    {
      id: 'RP001',
      name: 'Tournament Winner',
      category: 'Tournament',
      classification: 'Juniors',
      points: 100,
      description: 'Points awarded for winning a tournament',
      status: 'active',
      createdDate: '2025-01-15',
      lastModified: '2025-01-15',
      applicableEvents: ['Singles', 'Doubles'],
      minimumParticipants: 8,
      validityPeriod: 365, // days
    },
    {
      id: 'RP002',
      name: 'Tournament Runner-up',
      category: 'Tournament',
      classification: 'Juniors',
      points: 70,
      description: 'Points awarded for reaching tournament final',
      status: 'active',
      createdDate: '2025-01-15',
      lastModified: '2025-01-15',
      applicableEvents: ['Singles', 'Doubles'],
      minimumParticipants: 8,
      validityPeriod: 365,
    },
    {
      id: 'RP003',
      name: 'Semi-finalist',
      category: 'Tournament',
      classification: 'Juniors',
      points: 50,
      description: 'Points awarded for reaching tournament semi-final',
      status: 'active',
      createdDate: '2025-01-15',
      lastModified: '2025-01-15',
      applicableEvents: ['Singles', 'Doubles'],
      minimumParticipants: 8,
      validityPeriod: 365,
    },
    {
      id: 'RP004',
      name: 'League Champion',
      category: 'League',
      classification: 'Seniors',
      points: 80,
      description: 'Points awarded for winning a league',
      status: 'active',
      createdDate: '2025-01-10',
      lastModified: '2025-01-10',
      applicableEvents: ['Singles'],
      minimumParticipants: 6,
      validityPeriod: 365,
    },
    {
      id: 'RP005',
      name: 'Match Victory Bonus',
      category: 'Match',
      classification: 'All',
      points: 5,
      description: 'Bonus points for each match victory',
      status: 'active',
      createdDate: '2025-01-05',
      lastModified: '2025-01-05',
      applicableEvents: ['Singles', 'Doubles'],
      minimumParticipants: 2,
      validityPeriod: 180,
    },
  ];

  const mockRankingOverview = [
    {
      orgId: 'o1',
      orgName: 'Tennis Federation',
      tourId: 't1',
      tourName: 'Summer Open 2025',
      totalPlayers: 50,
      topRank: 1,
    },
  ];

  const mockPlayerRankings = [
    {
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      rank: 1,
      points: 1000,
      lastUpdated: '2025-06-19',
      pointsBreakdown: {
        tournaments: 850,
        leagues: 100,
        matches: 50,
      },
      recentActivity: [
        { event: 'Summer Open 2025', points: 100, date: '2025-06-15' },
        { event: 'City League', points: 80, date: '2025-06-10' },
      ],
    },
    {
      id: 'u2',
      firstName: 'Jane',
      lastName: 'Smith',
      rank: 2,
      points: 800,
      lastUpdated: '2025-06-18',
      pointsBreakdown: {
        tournaments: 600,
        leagues: 150,
        matches: 50,
      },
      recentActivity: [
        { event: 'Summer Open 2025', points: 70, date: '2025-06-15' },
        { event: 'Regional Championship', points: 50, date: '2025-06-05' },
      ],
    },
  ];

  const [pointsFormData, setPointsFormData] = useState({
    name: '',
    category: 'Tournament',
    classification: 'Juniors',
    points: 0,
    description: '',
    status: 'active',
    applicableEvents: [] as string[],
    minimumParticipants: 2,
    validityPeriod: 365,
  });

  const handleAction = (action: string, item: any) => {
    if (action === 'viewHistory') {
      alert(`View history for player: ${item.firstName} ${item.lastName}`);
    } else if (action === 'edit') {
      setSelectedPointsRule(item);
      setPointsFormData({
        name: item.name,
        category: item.category,
        classification: item.classification,
        points: item.points,
        description: item.description,
        status: item.status,
        applicableEvents: item.applicableEvents || [],
        minimumParticipants: item.minimumParticipants || 2,
        validityPeriod: item.validityPeriod || 365,
      });
      setIsEditPointsModalOpen(true);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete the points rule "${item.name}"?`)) {
        alert(`Deleted points rule: ${item.name}`);
      }
    }
  };

  const handlePointsFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setPointsFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleEventChange = (event: string, checked: boolean) => {
    setPointsFormData(prev => ({
      ...prev,
      applicableEvents: checked 
        ? [...prev.applicableEvents, event]
        : prev.applicableEvents.filter(e => e !== event)
    }));
  };

  const handleSavePointsRule = () => {
    console.log('Saving points rule:', pointsFormData);
    setIsCreatePointsModalOpen(false);
    setIsEditPointsModalOpen(false);
    setSelectedPointsRule(null);
    resetPointsForm();
  };

  const resetPointsForm = () => {
    setPointsFormData({
      name: '',
      category: 'Tournament',
      classification: 'Juniors',
      points: 0,
      description: '',
      status: 'active',
      applicableEvents: [],
      minimumParticipants: 2,
      validityPeriod: 365,
    });
  };

  const filteredPointsRules = mockPointsRules.filter(rule => {
    const matchesSearch = !searchQuery || 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const rankingOverviewTab = (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ranking Overview</h2>
      <Card>
        <Table
          columns={[
            { header: 'Organization ID', key: 'orgId' },
            { header: 'Organization Name', key: 'orgName' },
            { header: 'Tournament ID', key: 'tourId' },
            { header: 'Tournament Name', key: 'tourName' },
            { header: 'Total Players', key: 'totalPlayers' },
            { header: 'Top Rank', key: 'topRank' },
          ]}
          data={mockRankingOverview}
        />
      </Card>
    </div>
  );

  const playerRankingsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Player Rankings</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Rankings
          </Button>
          <Button variant="secondary" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recalculate Points
          </Button>
        </div>
      </div>
      
      <Card>
        <Table
          columns={[
            { header: 'Player ID', key: 'id' },
            { header: 'First Name', key: 'firstName' },
            { header: 'Last Name', key: 'lastName' },
            { 
              header: 'Rank', 
              key: 'rank',
              render: (value: number) => (
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-primary">#{value}</span>
                </div>
              )
            },
            { 
              header: 'Total Points', 
              key: 'points',
              render: (value: number) => (
                <span className="font-semibold text-success-600">{value}</span>
              )
            },
            { 
              header: 'Points Breakdown',
              key: 'pointsBreakdown',
              render: (_, row: any) => (
                <div className="text-xs space-y-1">
                  <div>Tournaments: {row.pointsBreakdown.tournaments}</div>
                  <div>Leagues: {row.pointsBreakdown.leagues}</div>
                  <div>Matches: {row.pointsBreakdown.matches}</div>
                </div>
              )
            },
            { header: 'Last Updated', key: 'lastUpdated' },
          ]}
          data={mockPlayerRankings}
          actions={[
            { label: 'View History', action: 'viewHistory' },
          ]}
          onAction={handleAction}
        />
      </Card>
    </div>
  );

  const rankingPointsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ranking Points Management</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Rules
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Rules
          </Button>
          <Button onClick={() => setIsCreatePointsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Points Rule
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="Tournament">Tournament</option>
            <option value="League">League</option>
            <option value="Match">Match</option>
            <option value="Special">Special</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </Card>

      {/* Points Rules Table */}
      <Card>
        <Table
          columns={[
            { header: 'Rule ID', key: 'id', width: '100px' },
            { header: 'Name', key: 'name' },
            { 
              header: 'Category', 
              key: 'category',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'Tournament' ? 'bg-blue-100 text-blue-800' :
                  value === 'League' ? 'bg-green-100 text-green-800' :
                  value === 'Match' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {value}
                </span>
              )
            },
            { header: 'Classification', key: 'classification' },
            { 
              header: 'Points', 
              key: 'points',
              render: (value: number) => (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{value}</span>
                </div>
              )
            },
            { 
              header: 'Status', 
              key: 'status',
              render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'active' ? 'bg-success-100 text-success-800' :
                  value === 'inactive' ? 'bg-danger-100 text-danger-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {value}
                </span>
              )
            },
            { header: 'Min. Participants', key: 'minimumParticipants' },
            { 
              header: 'Validity (Days)', 
              key: 'validityPeriod',
              render: (value: number) => `${value} days`
            },
            { header: 'Last Modified', key: 'lastModified' },
          ]}
          data={filteredPointsRules}
          actions={[
            { label: 'Edit', action: 'edit', variant: 'secondary' as const, icon: <Edit className="h-4 w-4" /> },
            { label: 'Delete', action: 'delete', variant: 'danger' as const, icon: <Trash2 className="h-4 w-4" /> },
          ]}
          onAction={handleAction}
          emptyMessage={searchQuery ? `No rules found matching "${searchQuery}"` : "No ranking points rules available"}
        />
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{mockPointsRules.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockPointsRules.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Max Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...mockPointsRules.map(r => r.points))}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(mockPointsRules.map(r => r.category)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const PointsRuleForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSavePointsRule(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Rule Name *
          </label>
          <input
            type="text"
            name="name"
            value={pointsFormData.name}
            onChange={handlePointsFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Tournament Winner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Category *
          </label>
          <select
            name="category"
            value={pointsFormData.category}
            onChange={handlePointsFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Tournament">Tournament</option>
            <option value="League">League</option>
            <option value="Match">Match</option>
            <option value="Special">Special Event</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Classification *
          </label>
          <select
            name="classification"
            value={pointsFormData.classification}
            onChange={handlePointsFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Classifications</option>
            <option value="Juniors">Juniors</option>
            <option value="Seniors">Seniors</option>
            <option value="Handicapped">Handicapped</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Points Awarded *
          </label>
          <input
            type="number"
            name="points"
            value={pointsFormData.points}
            onChange={handlePointsFormChange}
            required
            min="0"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={pointsFormData.description}
          onChange={handlePointsFormChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe when and how these points are awarded..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Applicable Events
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Singles', 'Doubles', 'Mixed Doubles', 'Team'].map((event) => (
            <label key={event} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={pointsFormData.applicableEvents.includes(event)}
                onChange={(e) => handleEventChange(event, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-text-primary">{event}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Minimum Participants
          </label>
          <input
            type="number"
            name="minimumParticipants"
            value={pointsFormData.minimumParticipants}
            onChange={handlePointsFormChange}
            min="2"
            max="128"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum participants required for points to be awarded</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Validity Period (Days)
          </label>
          <input
            type="number"
            name="validityPeriod"
            value={pointsFormData.validityPeriod}
            onChange={handlePointsFormChange}
            min="30"
            max="730"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">How long these points remain valid</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Status
          </label>
          <select
            name="status"
            value={pointsFormData.status}
            onChange={handlePointsFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreatePointsModalOpen(false);
            setIsEditPointsModalOpen(false);
            setSelectedPointsRule(null);
            resetPointsForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedPointsRule ? 'Update Rule' : 'Create Rule'}
        </Button>
      </div>
    </form>
  );

  const tabs = [
    { id: 'overview', label: 'Ranking Overview', content: rankingOverviewTab },
    { id: 'players', label: 'Player Rankings', content: playerRankingsTab },
    { id: 'points', label: 'Ranking Points', content: rankingPointsTab },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Ranking</h1>
        <p className="text-gray-600">View and manage player rankings and points system</p>
      </div>

      <Tabs tabs={tabs} />

      {/* Create Points Rule Modal */}
      <Modal
        isOpen={isCreatePointsModalOpen}
        onClose={() => {
          setIsCreatePointsModalOpen(false);
          resetPointsForm();
        }}
        title="Create New Points Rule"
        size="lg"
      >
        <PointsRuleForm />
      </Modal>

      {/* Edit Points Rule Modal */}
      <Modal
        isOpen={isEditPointsModalOpen}
        onClose={() => {
          setIsEditPointsModalOpen(false);
          setSelectedPointsRule(null);
          resetPointsForm();
        }}
        title="Edit Points Rule"
        size="lg"
      >
        <PointsRuleForm />
      </Modal>
    </div>
  );
}