import React, { useState, useMemo } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useDataPersistence } from '../context/DataPersistenceContext';
import { globalSettings } from '../data/mockData';
import { Club } from '../types';
import { Edit, Trash2, Plus, MapPin, Phone, Mail, Building, Users, Wifi, WifiOff, Trophy, Calendar, Upload, X, Search } from 'lucide-react';

// Generate UUID function
const generateUUID = () => {
  return 'CLUB' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export default function Clubs() {
  const { clubs, addClub, updateClub, deleteClub } = useDataPersistence();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    club: Club | null;
  }>({
    isOpen: false,
    club: null
  });
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contact: '',
    addressStreet: '',
    addressCity: '',
    addressCountry: 'India',
    zip: '',
    facilitiesIndoor: 0,
    facilitiesOutdoor: 0,
    surface: 'Hard',
    lights: false,
    logo: '',
    manager: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Filter clubs based on search query
  const filteredClubs = useMemo(() => {
    if (!searchQuery.trim()) return clubs;
    
    const query = searchQuery.toLowerCase().trim();
    return clubs.filter(club => {
      // Search in basic fields
      const basicFields = [
        club.id,
        club.name,
        club.contact,
        club.addressStreet || '',
        club.addressCity || '',
        club.addressCountry || '',
        club.zip || '',
        club.surface || '',
        club.manager || ''
      ].join(' ').toLowerCase();

      // Search in facilities
      const facilities = `${club.facilitiesIndoor} indoor ${club.facilitiesOutdoor} outdoor ${club.surface} ${club.lights ? 'lights lighting' : 'no lights'}`.toLowerCase();
      
      // Search in counts
      const counts = `${club.coachCount || 0} coaches ${club.playerCount || 0} players`.toLowerCase();
      
      // Combine all searchable text
      const searchableText = `${basicFields} ${facilities} ${counts}`;
      
      return searchableText.includes(query);
    });
  }, [searchQuery, clubs]);

  const columns = [
    { 
      header: 'Logo', 
      key: 'logo',
      width: '80px',
      render: (value: string, row: Club) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
          {row.logo ? (
            <img 
              src={row.logo} 
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
          )}
        </div>
      )
    },
    { header: 'ID (UUID)', key: 'id', width: '120px' },
    { header: 'Name', key: 'name' },
    { header: 'Contact', key: 'contact' },
    { 
      header: 'Address', 
      key: 'address',
      render: (_, row: Club) => (
        <span className="text-sm">
          {row.addressCity}, {row.addressCountry}
        </span>
      )
    },
    { 
      header: 'Facilities', 
      key: 'facilities',
      render: (_, row: Club) => (
        <span className="text-sm">
          {row.facilitiesIndoor}I / {row.facilitiesOutdoor}O
        </span>
      )
    },
    { 
      header: 'Coaches & Players', 
      key: 'associations',
      render: (_, row: Club) => (
        <span className="text-sm">
          {row.coachCount || 0}C / {row.playerCount || 0}P
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

  const handleAction = (action: string, club: Club) => {
    if (action === 'edit') {
      setSelectedClub(club);
      setFormData({
        id: club.id,
        name: club.name,
        contact: club.contact,
        addressStreet: club.addressStreet,
        addressCity: club.addressCity,
        addressCountry: club.addressCountry,
        zip: club.zip,
        facilitiesIndoor: club.facilitiesIndoor,
        facilitiesOutdoor: club.facilitiesOutdoor,
        surface: club.surface,
        lights: club.lights,
        logo: club.logo || '',
        manager: club.manager || '',
      });
      setLogoPreview(club.logo || '');
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        club: club
      });
    }
  };

  const handleDeleteClub = () => {
    if (confirmDialog.club) {
      deleteClub(confirmDialog.club.id);
      setConfirmDialog({ isOpen: false, club: null });
    }
  };

  const getDeleteDetails = (club: Club) => {
    const details = [
      'Club profile and facility information',
      'All member registrations and associations',
      'Tournament hosting history and records'
    ];

    if (club.manager) {
      details.push(`Manager assignment: ${club.manager}`);
    }

    const totalCourts = club.facilitiesIndoor + club.facilitiesOutdoor;
    if (totalCourts > 0) {
      details.push(`${totalCourts} court facilities and booking history`);
    }

    details.push('Club rankings and performance statistics');
    details.push('Financial records and membership fees');

    return details;
  };

  const getAffectedItems = (club: Club) => {
    const totalCourts = club.facilitiesIndoor + club.facilitiesOutdoor;
    return [
      {
        label: 'Tennis Courts',
        count: totalCourts,
        icon: <Trophy className="h-4 w-4 text-green-600" />
      },
      {
        label: 'Coaches',
        count: club.coachCount || 0,
        icon: <Users className="h-4 w-4 text-blue-600" />
      },
      {
        label: 'Players',
        count: club.playerCount || 0,
        icon: <Users className="h-4 w-4 text-purple-600" />
      }
    ];
  };

  const getConsequences = (club: Club) => {
    return [
      'Members will lose their club association',
      'Scheduled tournaments and events will need reassignment',
      'Court booking history will be permanently lost',
      'Club rankings and statistics will be removed'
    ];
  };

  const handleRowClick = (club: Club) => {
    setSelectedClub(club);
    setIsDetailModalOpen(true);
  };

  const handleSave = () => {
    const clubData: Club = {
      id: selectedClub?.id || generateUUID(),
      name: formData.name,
      contact: formData.contact,
      addressStreet: formData.addressStreet,
      addressCity: formData.addressCity,
      addressCountry: formData.addressCountry,
      zip: formData.zip,
      facilitiesIndoor: formData.facilitiesIndoor,
      facilitiesOutdoor: formData.facilitiesOutdoor,
      surface: formData.surface,
      lights: formData.lights,
      logo: logoPreview,
      manager: formData.manager,
      coachCount: selectedClub?.coachCount || 0,
      playerCount: selectedClub?.playerCount || 0,
    };

    if (selectedClub && isEditModalOpen) {
      updateClub(selectedClub.id, clubData);
    } else {
      addClub(clubData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedClub(null);
    resetForm();
  };

  const handleCreateClub = () => {
    setSelectedClub(null);
    resetForm();
    const newId = generateUUID();
    setFormData(prev => ({ ...prev, id: newId }));
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      contact: '',
      addressStreet: '',
      addressCity: '',
      addressCountry: 'India',
      zip: '',
      facilitiesIndoor: 0,
      facilitiesOutdoor: 0,
      surface: 'Hard',
      lights: false,
      logo: '',
      manager: '',
    });
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData(prev => ({ ...prev, logo: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const ClubForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Logo
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
            {logoPreview ? (
              <>
                <img 
                  src={logoPreview} 
                  alt="Logo Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <Building className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {logoPreview ? 'Change Logo' : 'Upload Logo'}
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Personal ID (Auto-generated) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Personal ID (Auto-generated UUID)
        </label>
        <input
          type="text"
          value={formData.id}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Name * (max 50 characters)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            maxLength={50}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter club name"
          />
          <div className="text-xs text-gray-500 mt-1">{formData.name.length}/50</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Contact *
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Email, phone, or website"
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Address Information
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="addressStreet"
            value={formData.addressStreet}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              City *
            </label>
            <input
              type="text"
              name="addressCity"
              value={formData.addressCity}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Country *
            </label>
            <select
              name="addressCountry"
              value={formData.addressCountry}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {globalSettings.countries.map((country) => (
                <option key={typeof country === 'string' ? country : country.name} value={typeof country === 'string' ? country : country.name}>
                  {typeof country === 'string' ? country : country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="ZIP code"
            />
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Facilities Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Indoor Courts
            </label>
            <input
              type="number"
              name="facilitiesIndoor"
              value={formData.facilitiesIndoor}
              onChange={handleFormChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Outdoor Courts
            </label>
            <input
              type="number"
              name="facilitiesOutdoor"
              value={formData.facilitiesOutdoor}
              onChange={handleFormChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Surface Type
            </label>
            <select
              name="surface"
              value={formData.surface}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {globalSettings.surfaces.map((surface) => (
                <option key={surface} value={surface}>{surface}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Lighting
            </label>
            <div className="flex items-center space-x-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lights"
                  value="true"
                  checked={formData.lights === true}
                  onChange={(e) => setFormData(prev => ({ ...prev, lights: true }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-text-primary">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lights"
                  value="false"
                  checked={formData.lights === false}
                  onChange={(e) => setFormData(prev => ({ ...prev, lights: false }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-text-primary">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedClub(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedClub ? 'Update Club' : 'Create Club'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Clubs</h1>
          <p className="text-text-secondary mt-1">Manage tennis clubs and their facilities</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs by name, location, facilities, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
          
          <Button onClick={handleCreateClub} className="flex items-center" data-action="add-club">
            <Plus className="h-4 w-4 mr-2" />
            Add Club
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-text-secondary">
          Showing {filteredClubs.length} of {clubs.length} clubs
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
          data={filteredClubs}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No clubs found matching "${searchQuery}"` : "No clubs available"}
        />
      </Card>

      {/* Create Club Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Club"
        size="lg"
      >
        <ClubForm />
      </Modal>

      {/* Edit Club Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClub(null);
        }}
        title="Edit Club"
        size="lg"
      >
        <ClubForm />
      </Modal>

      {/* Club Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedClub(null);
        }}
        title="Club Details"
        size="xl"
      >
        {selectedClub && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                {selectedClub.logo ? (
                  <img 
                    src={selectedClub.logo} 
                    alt={selectedClub.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">{selectedClub.name}</h3>
                <p className="text-text-secondary text-lg">{selectedClub.contact}</p>
                <div className="flex items-center mt-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                    Active Club
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Contact Information
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Club ID</p>
                      <p className="text-text-primary font-mono text-lg">{selectedClub.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Contact</p>
                      <p className="text-text-primary">{selectedClub.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Full Address</p>
                      <p className="text-text-primary">
                        {selectedClub.addressStreet}<br />
                        {selectedClub.addressCity}, {selectedClub.addressCountry}
                        {selectedClub.zip && ` ${selectedClub.zip}`}
                      </p>
                    </div>
                  </div>

                  {selectedClub.manager && (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Manager</p>
                        <p className="text-text-primary">{selectedClub.manager}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Facilities Information
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Indoor Courts</p>
                    <p className="text-text-primary text-2xl font-bold">{selectedClub.facilitiesIndoor}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary">Outdoor Courts</p>
                    <p className="text-text-primary text-2xl font-bold">{selectedClub.facilitiesOutdoor}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary">Court Surface</p>
                    <p className="text-text-primary">{selectedClub.surface}</p>
                  </div>

                  <div className="flex items-center">
                    {selectedClub.lights ? (
                      <Wifi className="h-5 w-5 mr-2 text-success-600" />
                    ) : (
                      <WifiOff className="h-5 w-5 mr-2 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Lighting</p>
                      <p className="text-text-primary">
                        {selectedClub.lights ? 'Available' : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Associations */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Coaches & Players Associated
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {(selectedClub.facilitiesIndoor || 0) + (selectedClub.facilitiesOutdoor || 0)}
                  </div>
                  <div className="text-sm text-text-secondary">Total Courts</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {selectedClub.facilitiesIndoor || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Indoor</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">
                    {selectedClub.facilitiesOutdoor || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Outdoor</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {selectedClub.lights ? '💡' : '🌙'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {selectedClub.lights ? 'Lit Courts' : 'No Lighting'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedClub.coachCount || 0}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Coaches Associated</div>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedClub.playerCount || 0}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">Players Associated</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedClub(selectedClub);
                  setFormData({
                    id: selectedClub.id,
                    name: selectedClub.name,
                    contact: selectedClub.contact,
                    addressStreet: selectedClub.addressStreet,
                    addressCity: selectedClub.addressCity,
                    addressCountry: selectedClub.addressCountry,
                    zip: selectedClub.zip,
                    facilitiesIndoor: selectedClub.facilitiesIndoor,
                    facilitiesOutdoor: selectedClub.facilitiesOutdoor,
                    surface: selectedClub.surface,
                    lights: selectedClub.lights,
                    logo: selectedClub.logo || '',
                    manager: selectedClub.manager || '',
                  });
                  setLogoPreview(selectedClub.logo || '');
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Club
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    club: selectedClub
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Club
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, club: null })}
        onConfirm={handleDeleteClub}
        title="Delete Tennis Club"
        message="Are you sure you want to permanently delete this tennis club?"
        itemName={confirmDialog.club?.name}
        itemType="Tennis Club"
        details={confirmDialog.club ? getDeleteDetails(confirmDialog.club) : []}
        affectedItems={confirmDialog.club ? getAffectedItems(confirmDialog.club) : []}
        consequences={confirmDialog.club ? getConsequences(confirmDialog.club) : []}
        warningLevel="high"
        confirmText="Delete Club"
        cancelText="Keep Club"
      />
    </div>
  );
}