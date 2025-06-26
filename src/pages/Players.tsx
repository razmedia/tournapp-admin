import React, { useState, useMemo, useEffect } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import UserSelectionModal from '../components/Modals/UserSelectionModal';
import { useUsers } from '../context/UserContext';
import { mockClubs, mockCoaches, globalSettings } from '../data/mockData';
import { User, TournamentHistory, PlayerActivity } from '../types';
import { Edit, Trash2, UserPlus, Mail, Phone, MapPin, Calendar, Shield, Building, Users as UsersIcon, Award, Upload, X, Search, FileText, Download, Trophy, Activity, ExternalLink, Ruler, Weight, Hand } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Generate UUID function
const generateUUID = () => {
  return 'PLAYER' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Calculate age from DOB
const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function Players() {
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    player: User | null;
  }>({
    isOpen: false,
    player: null
  });
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    phone1: '',
    country: 'India',
    clubs: [] as string[],
    coach: '',
    height: '',
    weight: '',
    dominantHand: 'Right' as 'Left' | 'Right',
    healthCertificate: '',
    status: 'active',
    profilePicture: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [healthCertificateFile, setHealthCertificateFile] = useState<File | null>(null);

  // Use the UserContext
  const { users, updateUser, deleteUser, assignRole, removeRole, getUserById } = useUsers();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for userId in URL params (for direct navigation from Users page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    
    if (userId) {
      const user = getUserById(userId);
      if (user) {
        handleUserSelectedForPlayer(user);
        // Clear the URL parameter after processing
        navigate('/players', { replace: true });
      }
    }
  }, [location]);

  // Filter players from all users
  const players = users.filter(user => user.roles?.includes('Player') || user.role === 'Player');

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    
    const query = searchQuery.toLowerCase().trim();
    return players.filter(player => {
      // Search in basic fields
      const basicFields = [
        player.id,
        player.firstName,
        player.lastName,
        player.gender || '',
        player.phone1 || '',
        player.country || '',
        player.status,
        player.coach || '',
        player.rank?.toString() || '',
        player.points?.toString() || '',
        player.height || '',
        player.weight || '',
        player.dominantHand || '',
        calculateAge(player.dob || '').toString(),
      ].join(' ').toLowerCase();

      // Search in clubs
      const clubs = player.clubs ? player.clubs.join(' ').toLowerCase() : '';
      
      // Combine all searchable text
      const searchableText = `${basicFields} ${clubs}`;
      
      return searchableText.includes(query);
    });
  }, [searchQuery, players]);

  const columns = [
    { 
      header: 'Profile Picture', 
      key: 'profilePicture',
      width: '80px',
      render: (_, row: User) => (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          {row.profilePicture ? (
            <img 
              src={row.profilePicture} 
              alt={`${row.firstName} ${row.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {row.firstName[0]}{row.lastName[0]}
              </span>
            </div>
          )}
        </div>
      )
    },
    { header: 'ID (UUID)', key: 'id', width: '120px' },
    { 
      header: 'Full Name', 
      key: 'fullName', 
      render: (_, row: User) => `${row.firstName} ${row.lastName}` 
    },
    { 
      header: 'Age', 
      key: 'age',
      render: (_, row: User) => calculateAge(row.dob || '')
    },
    { header: 'Gender', key: 'gender' },
    { 
      header: 'Club', 
      key: 'clubs',
      render: (_, row: User) => (
        <div className="space-y-1">
          {row.clubs && row.clubs.length > 0 ? (
            row.clubs.slice(0, 1).map((club, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to club detail page
                  console.log('Navigate to club:', club);
                }}
                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors cursor-pointer flex items-center"
              >
                {club}
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No club</span>
          )}
          {row.clubs && row.clubs.length > 1 && (
            <div className="text-xs text-gray-500">+{row.clubs.length - 1} more</div>
          )}
        </div>
      )
    },
    { 
      header: 'Rank', 
      key: 'rank',
      render: (value: number) => (
        <span className="font-bold text-primary-600">
          #{value || 'Unranked'}
        </span>
      )
    },
    { 
      header: 'Points', 
      key: 'points',
      render: (value: number) => (
        <span className="font-medium text-success-600">
          {value || 0} pts
        </span>
      )
    },
    { header: 'Coach', key: 'coach' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'
        }`}>
          {value}
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

  const handleAction = (action: string, player: User) => {
    if (action === 'edit') {
      setSelectedPlayer(player);
      setFormData({
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        gender: player.gender || 'Male',
        dob: player.dob || '',
        phone1: player.phone1 || '',
        country: player.country || 'India',
        clubs: player.clubs || [],
        coach: player.coach || '',
        height: player.height || '',
        weight: player.weight || '',
        dominantHand: player.dominantHand || 'Right',
        healthCertificate: player.healthCertificate || '',
        status: player.status,
        profilePicture: player.profilePicture || '',
      });
      setProfilePicturePreview(player.profilePicture || '');
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        player: player
      });
    }
  };

  const handleDeletePlayer = () => {
    if (confirmDialog.player) {
      // Remove the Player role instead of deleting the user
      removeRole(confirmDialog.player.id, 'Player');
      setConfirmDialog({ isOpen: false, player: null });
    }
  };

  const handleRowClick = (player: User) => {
    setSelectedPlayer(player);
    setIsDetailModalOpen(true);
  };

  const handleSave = () => {
    if (selectedPlayer) {
      // Prepare player-specific data
      const playerData = {
        height: formData.height,
        weight: formData.weight,
        dominantHand: formData.dominantHand,
        healthCertificate: formData.healthCertificate,
        coach: formData.coach,
        // Keep other fields that might be updated
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        phone1: formData.phone1,
        country: formData.country,
        clubs: formData.clubs,
        status: formData.status,
        profilePicture: profilePicturePreview,
      };
      
      // If user already has Player role, just update the data
      if (selectedPlayer.roles?.includes('Player') || selectedPlayer.role === 'Player') {
        updateUser(selectedPlayer.id, playerData);
      } else {
        // Otherwise, assign the Player role with the data
        assignRole(selectedPlayer.id, 'Player', playerData);
      }
    }
    
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPlayer(null);
    resetForm();
  };

  const handleCreatePlayer = () => {
    setIsUserSelectionModalOpen(true);
  };

  const handleUserSelectedForPlayer = (user: User) => {
    setIsUserSelectionModalOpen(false);
    setSelectedPlayer(user);
    
    // Pre-populate form with user data
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender || 'Male',
      dob: user.dob || '',
      phone1: user.phone1 || '',
      country: user.country || 'India',
      clubs: user.clubs || [],
      coach: user.coach || '',
      height: user.height || '',
      weight: user.weight || '',
      dominantHand: user.dominantHand || 'Right',
      healthCertificate: user.healthCertificate || '',
      status: user.status,
      profilePicture: user.profilePicture || '',
    });
    setProfilePicturePreview(user.profilePicture || '');
    setIsCreateModalOpen(true);
  };

  const handleAddNewUserForPlayer = () => {
    setIsUserSelectionModalOpen(false);
    setSelectedPlayer(null);
    resetForm();
    const newId = generateUUID();
    setFormData(prev => ({ ...prev, id: newId }));
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '',
      phone1: '',
      country: 'India',
      clubs: [],
      coach: '',
      height: '',
      weight: '',
      dominantHand: 'Right',
      healthCertificate: '',
      status: 'active',
      profilePicture: '',
    });
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setHealthCertificateFile(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle club checkbox changes
  const handleClubChange = (clubName: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      clubs: isChecked 
        ? [...prev.clubs, clubName]
        : prev.clubs.filter(club => club !== clubName)
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setProfilePictureFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfilePicturePreview(result);
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHealthCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Validate file type (PDF, DOC, DOCX, JPG, PNG)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, DOC, DOCX, JPG, or PNG file');
        return;
      }

      setHealthCertificateFile(file);
      
      // For non-image files, just store the file name
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({ ...prev, healthCertificate: result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, healthCertificate: file.name }));
      }
    }
  };

  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('profile-picture-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const removeHealthCertificate = () => {
    setHealthCertificateFile(null);
    setFormData(prev => ({ ...prev, healthCertificate: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('health-certificate-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getDeleteDetails = (player: User) => {
    const details = [
      'Player profile and personal information',
      'All tournament participation records',
      'Match history and performance statistics'
    ];

    if (player.clubs && player.clubs.length > 0) {
      details.push(`Club memberships: ${player.clubs.join(', ')}`);
    }

    if (player.coach) {
      details.push(`Coaching relationship with ${player.coach}`);
    }

    if (player.rank) {
      details.push(`Current ranking: #${player.rank}`);
    }

    if (player.points) {
      details.push(`${player.points} ranking points`);
    }

    return details;
  };

  const PlayerForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* ID (Auto-generated or from selected user) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          ID (UUID) {selectedPlayer ? '- From Selected User' : '- Auto-generated'}
        </label>
        <input
          type="text"
          value={formData.id}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
        />
      </div>

      {/* Profile Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
            {profilePicturePreview ? (
              <>
                <img 
                  src={profilePicturePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <UserPlus className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
              id="profile-picture-upload"
            />
            <label
              htmlFor="profile-picture-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {globalSettings.genders.map((gender) => (
              <option key={gender.id} value={gender.name}>{gender.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone1"
            value={formData.phone1}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {globalSettings.countries.map((country) => (
              <option key={typeof country === 'string' ? country : country.name} value={typeof country === 'string' ? country : country.name}>
                {typeof country === 'object' && country.flag ? `${country.flag} ` : ''}{typeof country === 'string' ? country : country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Club Selection with Dropdown */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Club *
        </label>
        <select
          name="club"
          value={formData.clubs[0] || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, clubs: e.target.value ? [e.target.value] : [] }))}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select a club</option>
          {mockClubs.map((club) => (
            <option key={club.id} value={club.name}>{club.name}</option>
          ))}
        </select>
      </div>

      {/* Coach Assignment */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Coach Assignment
        </label>
        <select
          name="coach"
          value={formData.coach}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select a coach</option>
          {mockCoaches.map((coach) => (
            <option key={coach.id} value={`${coach.firstName} ${coach.lastName}`}>
              {coach.firstName} {coach.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Height
          </label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={`e.g., 6'2" or 188 cm`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Weight
          </label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 180 lbs or 82 kg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Dominant Hand *
        </label>
        <div className="flex items-center space-x-4 mt-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="dominantHand"
              value="Left"
              checked={formData.dominantHand === 'Left'}
              onChange={handleFormChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">Left</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="dominantHand"
              value="Right"
              checked={formData.dominantHand === 'Right'}
              onChange={handleFormChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">Right</span>
          </label>
        </div>
      </div>

      {/* Health Certificate Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Health Certificate
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleHealthCertificateChange}
              className="hidden"
              id="health-certificate-upload"
            />
            <label
              htmlFor="health-certificate-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {formData.healthCertificate ? 'Change Certificate' : 'Upload Certificate'}
            </label>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
          </div>
          
          {formData.healthCertificate && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {healthCertificateFile?.name || 'Health certificate uploaded'}
                </span>
              </div>
              <button
                type="button"
                onClick={removeHealthCertificate}
                className="text-danger-600 hover:text-danger-700 text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Status *
        </label>
        <div className="flex items-center space-x-4 mt-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === 'active'}
              onChange={handleFormChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={formData.status === 'inactive'}
              onChange={handleFormChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">Inactive</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedPlayer(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedPlayer && (selectedPlayer.roles?.includes('Player') || selectedPlayer.role === 'Player') ? 'Update Player' : 'Assign Player Role'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Player</h1>
          <p className="text-text-secondary mt-1">Manage tennis players and their profiles</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search players by name, rank, club, coach, or age..."
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
          
          <Button onClick={handleCreatePlayer} className="flex items-center" data-action="add-player">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-text-secondary">
          Showing {filteredPlayers.length} of {players.length} players
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
          data={filteredPlayers}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No players found matching "${searchQuery}"` : "No players available"}
        />
      </Card>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isUserSelectionModalOpen}
        onClose={() => setIsUserSelectionModalOpen(false)}
        users={users}
        onSelectUser={handleUserSelectedForPlayer}
        onAddNewUser={handleAddNewUserForPlayer}
        title="Select User for Player Role"
        targetRole="Player"
      />

      {/* Create/Edit Player Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={selectedPlayer && (selectedPlayer.roles?.includes('Player') || selectedPlayer.role === 'Player') ? "Edit Player" : "Assign Player Role"}
        size="lg"
      >
        <PlayerForm />
      </Modal>

      {/* Edit Player Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlayer(null);
        }}
        title="Edit Player"
        size="lg"
      >
        <PlayerForm />
      </Modal>

      {/* Player Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPlayer(null);
        }}
        title="Player Details"
        size="xl"
      >
        {selectedPlayer && (
          <div className="space-y-6">
            {/* Header Section with Profile Picture */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {selectedPlayer.profilePicture ? (
                  <img 
                    src={selectedPlayer.profilePicture} 
                    alt={`${selectedPlayer.firstName} ${selectedPlayer.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedPlayer.firstName[0]}{selectedPlayer.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">
                  {selectedPlayer.firstName} {selectedPlayer.lastName}
                </h3>
                <p className="text-text-secondary text-lg">Professional Tennis Player</p>
                <div className="flex items-center mt-3 space-x-3">
                  <Shield className="h-4 w-4 mr-1 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Player</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPlayer.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {selectedPlayer.status}
                  </span>
                  {selectedPlayer.rank && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-800">
                      Rank #{selectedPlayer.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Personal Information
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Player ID</p>
                      <p className="text-text-primary font-mono text-lg">{selectedPlayer.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Full Name</p>
                      <p className="text-text-primary">{selectedPlayer.firstName} {selectedPlayer.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">⚧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Gender</p>
                      <p className="text-text-primary">{selectedPlayer.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedPlayer.dob && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Date of Birth</p>
                        <p className="text-text-primary">{selectedPlayer.dob} (Age: {calculateAge(selectedPlayer.dob)})</p>
                      </div>
                    </div>
                  )}

                  {selectedPlayer.phone1 && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone</p>
                        <p className="text-text-primary">{selectedPlayer.phone1}</p>
                      </div>
                    </div>
                  )}

                  {selectedPlayer.country && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Country</p>
                        <p className="text-text-primary">{selectedPlayer.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Physical Information
                </h4>
                
                <div className="space-y-4">
                  {selectedPlayer.height && (
                    <div className="flex items-center">
                      <Ruler className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Height (last updated)</p>
                        <p className="text-text-primary">{selectedPlayer.height}</p>
                      </div>
                    </div>
                  )}

                  {selectedPlayer.weight && (
                    <div className="flex items-center">
                      <Weight className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Weight (last updated)</p>
                        <p className="text-text-primary">{selectedPlayer.weight}</p>
                      </div>
                    </div>
                  )}

                  {selectedPlayer.dominantHand && (
                    <div className="flex items-center">
                      <Hand className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Dominant Hand</p>
                        <p className="text-text-primary">{selectedPlayer.dominantHand}</p>
                      </div>
                    </div>
                  )}

                  {selectedPlayer.healthCertificate && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Health Certificate</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedPlayer.healthCertificate.startsWith('data:image') ? (
                            <img 
                              src={selectedPlayer.healthCertificate} 
                              alt="Health Certificate"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary-600" />
                              <span className="text-sm text-primary-600">Certificate Available</span>
                            </div>
                          )}
                          <Button variant="secondary" size="sm" className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tennis Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Tennis Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedPlayer.clubs && selectedPlayer.clubs.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm font-medium text-text-secondary">Club</p>
                    </div>
                    <div className="space-y-2">
                      {selectedPlayer.clubs.map((club, index) => (
                        <button
                          key={index}
                          onClick={() => console.log('Navigate to club:', club)}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full"
                        >
                          <span className="text-text-primary">{club}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlayer.coach && (
                  <div>
                    <div className="flex items-center mb-3">
                      <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm font-medium text-text-secondary">Coach</p>
                    </div>
                    <div className="py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-text-primary font-medium">{selectedPlayer.coach}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    #{selectedPlayer.rank || 'N/A'}
                  </div>
                  <div className="text-sm text-text-secondary">Rank</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {selectedPlayer.points || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Total Points</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">
                    {calculateAge(selectedPlayer.dob || '')}
                  </div>
                  <div className="text-sm text-text-secondary">Age</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {selectedPlayer.dominantHand === 'Left' ? '👈' : '👉'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {selectedPlayer.dominantHand || 'Right'} Handed
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament History */}
            {selectedPlayer.tournamentHistory && selectedPlayer.tournamentHistory.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Tournament History ({selectedPlayer.tournamentHistory.length})
                </h4>
                <div className="space-y-3">
                  {selectedPlayer.tournamentHistory.map((tournament, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-5 w-5 text-warning-600" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{tournament.name}</p>
                          <p className="text-xs text-text-muted">{tournament.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-primary">{tournament.result}</p>
                        <p className="text-xs text-success-600">+{tournament.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Player History */}
            {selectedPlayer.playerHistory && selectedPlayer.playerHistory.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Player History (Past Activity)
                </h4>
                <div className="space-y-3">
                  {selectedPlayer.playerHistory.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Activity className="h-5 w-5 text-primary-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{activity.description}</p>
                        <p className="text-xs text-text-muted">{activity.date}</p>
                        {activity.details && (
                          <p className="text-xs text-text-secondary mt-1">{activity.details}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.type === 'tournament' ? 'bg-warning-100 text-warning-700' :
                        activity.type === 'match' ? 'bg-success-100 text-success-700' :
                        activity.type === 'ranking' ? 'bg-primary-100 text-primary-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedPlayer(selectedPlayer);
                  setFormData({
                    id: selectedPlayer.id,
                    firstName: selectedPlayer.firstName,
                    lastName: selectedPlayer.lastName,
                    gender: selectedPlayer.gender || 'Male',
                    dob: selectedPlayer.dob || '',
                    phone1: selectedPlayer.phone1 || '',
                    country: selectedPlayer.country || 'India',
                    clubs: selectedPlayer.clubs || [],
                    coach: selectedPlayer.coach || '',
                    height: selectedPlayer.height || '',
                    weight: selectedPlayer.weight || '',
                    dominantHand: selectedPlayer.dominantHand || 'Right',
                    healthCertificate: selectedPlayer.healthCertificate || '',
                    status: selectedPlayer.status,
                    profilePicture: selectedPlayer.profilePicture || '',
                  });
                  setProfilePicturePreview(selectedPlayer.profilePicture || '');
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Player
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    player: selectedPlayer
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Player Role
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, player: null })}
        onConfirm={handleDeletePlayer}
        title="Remove Player Role"
        message="Are you sure you want to remove the Player role from this user?"
        itemName={confirmDialog.player ? `${confirmDialog.player.firstName} ${confirmDialog.player.lastName}` : ''}
        itemType="Player Role"
        details={confirmDialog.player ? getDeleteDetails(confirmDialog.player) : []}
        warningLevel="medium"
        confirmText="Remove Role"
        cancelText="Keep Role"
      />
    </div>
  );
}