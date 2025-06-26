import React, { useState, useMemo, useEffect } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import UserSelectionModal from '../components/Modals/UserSelectionModal';
import { useUsers } from '../context/UserContext';
import { mockClubs, mockCoaches, globalSettings } from '../data/mockData';
import { User } from '../types';
import { Edit, Trash2, UserPlus, Mail, Phone, MapPin, Calendar, Shield, Building, Users as UsersIcon, Award, Upload, X, Search, FileText, Download } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Generate UUID function
const generateUUID = () => {
  return 'COACH' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Calculate years of experience based on DOB
const calculateExperience = (dob: string): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  // Assume coaching started at age 18
  return Math.max(0, age - 18);
};

export default function Coaches() {
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    coach: User | null;
  }>({
    isOpen: false,
    coach: null
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
    yearOfExperience: 1,
    status: 'active',
    profilePicture: '',
    licenseCertificate: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [licenseCertificateFile, setLicenseCertificateFile] = useState<File | null>(null);

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
        handleUserSelectedForCoach(user);
        // Clear the URL parameter after processing
        navigate('/coaches', { replace: true });
      }
    }
  }, [location]);

  // Filter coaches from all users
  const coaches = users.filter(user => user.roles?.includes('Coach') || user.role === 'Coach');

  // Filter coaches based on search query
  const filteredCoaches = useMemo(() => {
    if (!searchQuery.trim()) return coaches;
    
    const query = searchQuery.toLowerCase().trim();
    return coaches.filter(coach => {
      // Search in basic fields
      const basicFields = [
        coach.id,
        coach.firstName,
        coach.lastName,
        coach.gender || '',
        coach.phone1 || '',
        coach.country || '',
        coach.status,
        coach.yearOfExperience?.toString() || '',
      ].join(' ').toLowerCase();

      // Search in clubs
      const clubs = coach.clubs ? coach.clubs.join(' ').toLowerCase() : '';
      
      // Search in associated players count
      const playersCount = coach.associatedPlayers ? `${coach.associatedPlayers.length} players` : '0 players';
      
      // Combine all searchable text
      const searchableText = `${basicFields} ${clubs} ${playersCount}`;
      
      return searchableText.includes(query);
    });
  }, [searchQuery, coaches]);

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
      header: 'Year of Exp.', 
      key: 'yearOfExperience',
      render: (value: number) => `${value || 0} years`
    },
    { 
      header: 'Club', 
      key: 'clubs',
      render: (_, row: User) => (
        <div className="space-y-1">
          {row.clubs && row.clubs.length > 0 ? (
            row.clubs.slice(0, 2).map((club, index) => (
              <div key={index} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {club}
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No clubs</span>
          )}
          {row.clubs && row.clubs.length > 2 && (
            <div className="text-xs text-gray-500">+{row.clubs.length - 2} more</div>
          )}
        </div>
      )
    },
    { 
      header: 'Associated Players', 
      key: 'associatedPlayers',
      render: (_, row: User) => (
        <span className="font-medium text-primary-600">
          {row.associatedPlayers?.length || 0} players
        </span>
      )
    },
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

  const handleAction = (action: string, coach: User) => {
    if (action === 'edit') {
      setSelectedCoach(coach);
      setFormData({
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        gender: coach.gender || 'Male',
        dob: coach.dob || '',
        phone1: coach.phone1 || '',
        country: coach.country || 'India',
        clubs: coach.clubs || [],
        yearOfExperience: coach.yearOfExperience || 1,
        status: coach.status,
        profilePicture: coach.profilePicture || '',
        licenseCertificate: coach.licenseCertificate || '',
      });
      setProfilePicturePreview(coach.profilePicture || '');
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        coach: coach
      });
    }
  };

  const handleDeleteCoach = () => {
    if (confirmDialog.coach) {
      // Remove the Coach role instead of deleting the user
      removeRole(confirmDialog.coach.id, 'Coach');
      setConfirmDialog({ isOpen: false, coach: null });
    }
  };

  const handleRowClick = (coach: User) => {
    setSelectedCoach(coach);
    setIsDetailModalOpen(true);
  };

  const handleSave = () => {
    if (selectedCoach) {
      // Prepare coach-specific data
      const coachData = {
        yearOfExperience: formData.yearOfExperience,
        licenseCertificate: formData.licenseCertificate,
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
      
      // If user already has Coach role, just update the data
      if (selectedCoach.roles?.includes('Coach') || selectedCoach.role === 'Coach') {
        updateUser(selectedCoach.id, coachData);
      } else {
        // Otherwise, assign the Coach role with the data
        assignRole(selectedCoach.id, 'Coach', coachData);
      }
    }
    
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCoach(null);
    resetForm();
  };

  const handleCreateCoach = () => {
    setIsUserSelectionModalOpen(true);
  };

  const handleUserSelectedForCoach = (user: User) => {
    setIsUserSelectionModalOpen(false);
    setSelectedCoach(user);
    
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
      yearOfExperience: user.yearOfExperience || calculateExperience(user.dob || ''),
      status: user.status,
      profilePicture: user.profilePicture || '',
      licenseCertificate: user.licenseCertificate || '',
    });
    setProfilePicturePreview(user.profilePicture || '');
    setIsCreateModalOpen(true);
  };

  const handleAddNewUserForCoach = () => {
    setIsUserSelectionModalOpen(false);
    setSelectedCoach(null);
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
      yearOfExperience: 1,
      status: 'active',
      profilePicture: '',
      licenseCertificate: '',
    });
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setLicenseCertificateFile(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'dob') {
      // Auto-update year of experience when DOB changes
      const experience = calculateExperience(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        yearOfExperience: experience
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 1 : value
      }));
    }
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

  const handleLicenseCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setLicenseCertificateFile(file);
      
      // For non-image files, just store the file name
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({ ...prev, licenseCertificate: result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, licenseCertificate: file.name }));
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

  const removeLicenseCertificate = () => {
    setLicenseCertificateFile(null);
    setFormData(prev => ({ ...prev, licenseCertificate: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('license-certificate-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getDeleteDetails = (coach: User) => {
    const details = [
      'Coach profile and certification information',
      'All player coaching relationships',
      'Tournament coaching assignments'
    ];

    if (coach.clubs && coach.clubs.length > 0) {
      details.push(`Club associations: ${coach.clubs.join(', ')}`);
    }

    if (coach.associatedPlayers && coach.associatedPlayers.length > 0) {
      details.push(`${coach.associatedPlayers.length} player coaching relationships`);
    }

    if (coach.yearOfExperience) {
      details.push(`${coach.yearOfExperience} years of coaching experience records`);
    }

    return details;
  };

  const CoachForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* ID (Auto-generated or from selected user) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          ID (UUID) {selectedCoach ? '- From Selected User' : '- Auto-generated'}
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

      {/* Club Selection with Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Club Association (can select multiple) *
        </label>
        <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
          {mockClubs.map((club) => (
            <div key={club.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                id={`club-${club.id}`}
                checked={formData.clubs.includes(club.name)}
                onChange={(e) => handleClubChange(club.name, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={`club-${club.id}`} className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{club.name}</p>
                    <p className="text-xs text-text-muted">{club.addressCity}, {club.addressCountry}</p>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-text-muted">
          Selected clubs: {formData.clubs.length > 0 ? (
            <span className="font-medium text-primary-600">
              {formData.clubs.join(', ')}
            </span>
          ) : (
            <span className="text-gray-500">None selected</span>
          )}
        </div>
      </div>

      {/* License Certificate Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          License Certificate (Optional)
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleLicenseCertificateChange}
              className="hidden"
              id="license-certificate-upload"
            />
            <label
              htmlFor="license-certificate-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {formData.licenseCertificate ? 'Change Certificate' : 'Upload Certificate'}
            </label>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
          </div>
          
          {formData.licenseCertificate && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {licenseCertificateFile?.name || 'Certificate uploaded'}
                </span>
              </div>
              <button
                type="button"
                onClick={removeLicenseCertificate}
                className="text-danger-600 hover:text-danger-700 text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Year of Experience (Auto-updated from DOB)
          </label>
          <select
            name="yearOfExperience"
            value={formData.yearOfExperience}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {globalSettings.experienceYears.map((exp) => (
              <option key={exp.value} value={exp.value}>{exp.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Auto-calculated: {formData.dob ? calculateExperience(formData.dob) : 0} years (based on DOB)
          </p>
        </div>

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
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedCoach(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedCoach && (selectedCoach.roles?.includes('Coach') || selectedCoach.role === 'Coach') ? 'Update Coach' : 'Assign Coach Role'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Coach</h1>
          <p className="text-text-secondary mt-1">Manage tennis coaches and their profiles</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coaches by name, experience, clubs, or players..."
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
          
          <Button onClick={handleCreateCoach} className="flex items-center" data-action="add-coach">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Coach
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-text-secondary">
          Showing {filteredCoaches.length} of {coaches.length} coaches
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
          data={filteredCoaches}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No coaches found matching "${searchQuery}"` : "No coaches available"}
        />
      </Card>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isUserSelectionModalOpen}
        onClose={() => setIsUserSelectionModalOpen(false)}
        users={users}
        onSelectUser={handleUserSelectedForCoach}
        onAddNewUser={handleAddNewUserForCoach}
        title="Select User for Coach Role"
        targetRole="Coach"
      />

      {/* Create/Edit Coach Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={selectedCoach && (selectedCoach.roles?.includes('Coach') || selectedCoach.role === 'Coach') ? "Edit Coach" : "Assign Coach Role"}
        size="lg"
      >
        <CoachForm />
      </Modal>

      {/* Edit Coach Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCoach(null);
        }}
        title="Edit Coach"
        size="lg"
      >
        <CoachForm />
      </Modal>

      {/* Coach Detail Modal - keeping the existing detailed modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCoach(null);
        }}
        title="Coach Details"
        size="xl"
      >
        {selectedCoach && (
          <div className="space-y-6">
            {/* Header Section with Profile Picture */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {selectedCoach.profilePicture ? (
                  <img 
                    src={selectedCoach.profilePicture} 
                    alt={`${selectedCoach.firstName} ${selectedCoach.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedCoach.firstName[0]}{selectedCoach.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">
                  {selectedCoach.firstName} {selectedCoach.lastName}
                </h3>
                <p className="text-text-secondary text-lg">Professional Tennis Coach</p>
                <div className="flex items-center mt-3 space-x-3">
                  <Shield className="h-4 w-4 mr-1 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Coach</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCoach.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {selectedCoach.status}
                  </span>
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
                      <p className="text-sm font-medium text-text-secondary">Coach ID</p>
                      <p className="text-text-primary font-mono text-lg">{selectedCoach.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Full Name</p>
                      <p className="text-text-primary">{selectedCoach.firstName} {selectedCoach.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">⚧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Gender</p>
                      <p className="text-text-primary">{selectedCoach.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedCoach.dob && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Date of Birth</p>
                        <p className="text-text-primary">{selectedCoach.dob}</p>
                      </div>
                    </div>
                  )}

                  {selectedCoach.phone1 && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone</p>
                        <p className="text-text-primary">{selectedCoach.phone1}</p>
                      </div>
                    </div>
                  )}

                  {selectedCoach.country && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Country</p>
                        <p className="text-text-primary">
                          {typeof globalSettings.countries[0] === 'object' ? 
                            globalSettings.countries.find((c: any) => c.name === selectedCoach.country)?.flag : ''} {selectedCoach.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Professional Information
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Years of Experience</p>
                      <p className="text-text-primary text-2xl font-bold text-primary-600">
                        {selectedCoach.yearOfExperience || 0} years
                      </p>
                    </div>
                  </div>

                  {selectedCoach.licenseCertificate && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">License Certificate</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedCoach.licenseCertificate.startsWith('data:image') ? (
                            <img 
                              src={selectedCoach.licenseCertificate} 
                              alt="License Certificate"
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
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Associated Players</p>
                      <p className="text-text-primary text-2xl font-bold text-success-600">
                        {selectedCoach.associatedPlayers?.length || 0} players
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Clubs */}
            {selectedCoach.clubs && selectedCoach.clubs.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Associated Clubs ({selectedCoach.clubs.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCoach.clubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-primary-600" />
                        <span className="text-text-primary font-medium">{club}</span>
                      </div>
                      <span className="text-xs text-text-muted bg-primary-100 px-2 py-1 rounded">Coach</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Players */}
            {selectedCoach.associatedPlayers && selectedCoach.associatedPlayers.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Associated Players ({selectedCoach.associatedPlayers.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedCoach.associatedPlayers.map((playerId, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-success-600" />
                        </div>
                        <span className="text-text-primary font-medium">Player {playerId}</span>
                      </div>
                      <span className="text-xs text-text-muted bg-success-100 px-2 py-1 rounded">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Coaching Statistics
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedCoach.yearOfExperience || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Years Experience</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {selectedCoach.associatedPlayers?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Active Players</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">
                    {selectedCoach.clubs?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Associated Clubs</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {selectedCoach.licenseCertificate ? '📜' : '❌'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {selectedCoach.licenseCertificate ? 'Certified' : 'No Certificate'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedCoach(selectedCoach);
                  setFormData({
                    id: selectedCoach.id,
                    firstName: selectedCoach.firstName,
                    lastName: selectedCoach.lastName,
                    gender: selectedCoach.gender || 'Male',
                    dob: selectedCoach.dob || '',
                    phone1: selectedCoach.phone1 || '',
                    country: selectedCoach.country || 'India',
                    clubs: selectedCoach.clubs || [],
                    yearOfExperience: selectedCoach.yearOfExperience || 1,
                    status: selectedCoach.status,
                    profilePicture: selectedCoach.profilePicture || '',
                    licenseCertificate: selectedCoach.licenseCertificate || '',
                  });
                  setProfilePicturePreview(selectedCoach.profilePicture || '');
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Coach
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    coach: selectedCoach
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Coach Role
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, coach: null })}
        onConfirm={handleDeleteCoach}
        title="Remove Coach Role"
        message="Are you sure you want to remove the Coach role from this user?"
        itemName={confirmDialog.coach ? `${confirmDialog.coach.firstName} ${confirmDialog.coach.lastName}` : ''}
        itemType="Coach Role"
        details={confirmDialog.coach ? getDeleteDetails(confirmDialog.coach) : []}
        warningLevel="medium"
        confirmText="Remove Role"
        cancelText="Keep Role"
      />
    </div>
  );
}