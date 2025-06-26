import React, { useState, useMemo, useEffect } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import UserSelectionModal from '../components/Modals/UserSelectionModal';
import { useUsers } from '../context/UserContext';
import { globalSettings } from '../data/mockData';
import { User } from '../types';
import { Edit, Trash2, UserPlus, Mail, Phone, MapPin, Calendar, Shield, Award, Upload, X, Search, FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Generate UUID function
const generateUUID = () => {
  return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export default function Referees() {
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    referee: User | null;
  }>({
    isOpen: false,
    referee: null
  });
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    phone1: '',
    country: 'India',
    certification: false,
    certificationDocument: '',
    status: 'active',
    profilePicture: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [certificationDocumentFile, setCertificationDocumentFile] = useState<File | null>(null);

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
        handleUserSelectedForReferee(user);
        // Clear the URL parameter after processing
        navigate('/referees', { replace: true });
      }
    }
  }, [location]);

  // Filter referees from all users
  const referees = users.filter(user => user.roles?.includes('Referee') || user.role === 'Referee');

  // Filter referees based on search query
  const filteredReferees = useMemo(() => {
    if (!searchQuery.trim()) return referees;
    
    const query = searchQuery.toLowerCase().trim();
    return referees.filter(referee => {
      // Search in basic fields
      const basicFields = [
        referee.id,
        referee.firstName,
        referee.lastName,
        referee.gender || '',
        referee.phone1 || '',
        referee.country || '',
        referee.status,
        referee.certification ? 'certified yes' : 'not certified no',
      ].join(' ').toLowerCase();

      // Search in organizations
      const organizations = referee.organizations ? referee.organizations.join(' ').toLowerCase() : '';
      
      // Combine all searchable text
      const searchableText = `${basicFields} ${organizations}`;
      
      return searchableText.includes(query);
    });
  }, [searchQuery, referees]);

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
      header: 'Certification', 
      key: 'certification',
      render: (_, row: User) => (
        <div className="flex items-center space-x-2">
          {row.certification ? (
            <>
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span className="text-success-700 font-medium text-sm">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-danger-600" />
              <span className="text-danger-700 font-medium text-sm">No</span>
            </>
          )}
        </div>
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

  const handleAction = (action: string, referee: User) => {
    if (action === 'edit') {
      setSelectedReferee(referee);
      setFormData({
        id: referee.id,
        firstName: referee.firstName,
        lastName: referee.lastName,
        gender: referee.gender || 'Male',
        dob: referee.dob || '',
        phone1: referee.phone1 || '',
        country: referee.country || 'India',
        certification: referee.certification || false,
        certificationDocument: referee.certificationDocument || '',
        status: referee.status,
        profilePicture: referee.profilePicture || '',
      });
      setProfilePicturePreview(referee.profilePicture || '');
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        referee: referee
      });
    }
  };

  const handleDeleteReferee = () => {
    if (confirmDialog.referee) {
      // Remove the Referee role instead of deleting the user
      removeRole(confirmDialog.referee.id, 'Referee');
      setConfirmDialog({ isOpen: false, referee: null });
    }
  };

  const handleRowClick = (referee: User) => {
    setSelectedReferee(referee);
    setIsDetailModalOpen(true);
  };

  const handleSave = () => {
    if (selectedReferee) {
      // Prepare referee-specific data
      const refereeData = {
        certification: formData.certification,
        certificationDocument: formData.certificationDocument,
        // Keep other fields that might be updated
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        phone1: formData.phone1,
        country: formData.country,
        status: formData.status,
        profilePicture: profilePicturePreview,
      };
      
      // If user already has Referee role, just update the data
      if (selectedReferee.roles?.includes('Referee') || selectedReferee.role === 'Referee') {
        updateUser(selectedReferee.id, refereeData);
      } else {
        // Otherwise, assign the Referee role with the data
        assignRole(selectedReferee.id, 'Referee', refereeData);
      }
    }
    
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedReferee(null);
    resetForm();
  };

  const handleCreateReferee = () => {
    setIsUserSelectionModalOpen(true);
  };

  const handleUserSelectedForReferee = (user: User) => {
    setIsUserSelectionModalOpen(false);
    setSelectedReferee(user);
    
    // Pre-populate form with user data
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender || 'Male',
      dob: user.dob || '',
      phone1: user.phone1 || '',
      country: user.country || 'India',
      certification: user.certification || false,
      certificationDocument: user.certificationDocument || '',
      status: user.status,
      profilePicture: user.profilePicture || '',
    });
    setProfilePicturePreview(user.profilePicture || '');
    setIsCreateModalOpen(true);
  };

  const handleAddNewUserForReferee = () => {
    setIsUserSelectionModalOpen(false);
    setSelectedReferee(null);
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
      certification: false,
      certificationDocument: '',
      status: 'active',
      profilePicture: '',
    });
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setCertificationDocumentFile(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'certification') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        certification: isChecked,
        // Clear certification document if certification is disabled
        certificationDocument: isChecked ? prev.certificationDocument : ''
      }));
      
      // Clear file if certification is disabled
      if (!isChecked) {
        setCertificationDocumentFile(null);
        const fileInput = document.getElementById('certification-document-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleCertificationDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setCertificationDocumentFile(file);
      
      // For non-image files, just store the file name
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormData(prev => ({ ...prev, certificationDocument: result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, certificationDocument: file.name }));
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

  const removeCertificationDocument = () => {
    setCertificationDocumentFile(null);
    setFormData(prev => ({ ...prev, certificationDocument: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('certification-document-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getDeleteDetails = (referee: User) => {
    const details = [
      'Referee profile and certification information',
      'All tournament officiating assignments',
      'Match officiating history and records'
    ];

    if (referee.certification) {
      details.push('Professional certification credentials');
    }

    if (referee.organizations && referee.organizations.length > 0) {
      details.push(`Organization memberships: ${referee.organizations.join(', ')}`);
    }

    details.push('Performance ratings and feedback records');

    return details;
  };

  const RefereeForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* ID (Auto-generated or from selected user) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          ID (UUID) {selectedReferee ? '- From Selected User' : '- Auto-generated'}
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

      {/* Certification Toggle */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Certification Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="certification"
              checked={formData.certification === true}
              onChange={() => setFormData(prev => ({ ...prev, certification: true }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">Yes - Certified</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="certification"
              checked={formData.certification === false}
              onChange={() => setFormData(prev => ({ ...prev, certification: false, certificationDocument: '' }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-text-primary">No - Not Certified</span>
          </label>
        </div>
      </div>

      {/* Certification Document Upload - Only show if certified */}
      {formData.certification && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Certification Document *
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleCertificationDocumentChange}
                className="hidden"
                id="certification-document-upload"
              />
              <label
                htmlFor="certification-document-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                {formData.certificationDocument ? 'Change Document' : 'Upload Document'}
              </label>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
            </div>
            
            {formData.certificationDocument && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {certificationDocumentFile?.name || 'Certification document uploaded'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCertificationDocument}
                  className="text-danger-600 hover:text-danger-700 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
            setSelectedReferee(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedReferee && (selectedReferee.roles?.includes('Referee') || selectedReferee.role === 'Referee') ? 'Update Referee' : 'Assign Referee Role'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Referee</h1>
          <p className="text-text-secondary mt-1">Manage tennis referees and their certifications</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search referees by name, certification, or status..."
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
          
          <Button onClick={handleCreateReferee} className="flex items-center" data-action="add-referee">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Referee
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-text-secondary">
          Showing {filteredReferees.length} of {referees.length} referees
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
          data={filteredReferees}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No referees found matching "${searchQuery}"` : "No referees available"}
        />
      </Card>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isUserSelectionModalOpen}
        onClose={() => setIsUserSelectionModalOpen(false)}
        users={users}
        onSelectUser={handleUserSelectedForReferee}
        onAddNewUser={handleAddNewUserForReferee}
        title="Select User for Referee Role"
        targetRole="Referee"
      />

      {/* Create/Edit Referee Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={selectedReferee && (selectedReferee.roles?.includes('Referee') || selectedReferee.role === 'Referee') ? "Edit Referee" : "Assign Referee Role"}
        size="lg"
      >
        <RefereeForm />
      </Modal>

      {/* Edit Referee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReferee(null);
        }}
        title="Edit Referee"
        size="lg"
      >
        <RefereeForm />
      </Modal>

      {/* Referee Detail Modal - keeping the existing detailed modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReferee(null);
        }}
        title="Referee Details"
        size="xl"
      >
        {selectedReferee && (
          <div className="space-y-6">
            {/* Header Section with Profile Picture */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {selectedReferee.profilePicture ? (
                  <img 
                    src={selectedReferee.profilePicture} 
                    alt={`${selectedReferee.firstName} ${selectedReferee.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedReferee.firstName[0]}{selectedReferee.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">
                  {selectedReferee.firstName} {selectedReferee.lastName}
                </h3>
                <p className="text-text-secondary text-lg">Professional Tennis Referee</p>
                <div className="flex items-center mt-3 space-x-3">
                  <Shield className="h-4 w-4 mr-1 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Referee</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedReferee.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {selectedReferee.status}
                  </span>
                  {selectedReferee.certification ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Certified
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
                      <p className="text-sm font-medium text-text-secondary">Referee ID</p>
                      <p className="text-text-primary font-mono text-lg">{selectedReferee.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Full Name</p>
                      <p className="text-text-primary">{selectedReferee.firstName} {selectedReferee.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">⚧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Gender</p>
                      <p className="text-text-primary">{selectedReferee.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedReferee.dob && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Date of Birth</p>
                        <p className="text-text-primary">{selectedReferee.dob}</p>
                      </div>
                    </div>
                  )}

                  {selectedReferee.phone1 && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone</p>
                        <p className="text-text-primary">{selectedReferee.phone1}</p>
                      </div>
                    </div>
                  )}

                  {selectedReferee.country && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Country</p>
                        <p className="text-text-primary">
                          {typeof globalSettings.countries[0] === 'object' ? 
                            globalSettings.countries.find((c: any) => c.name === selectedReferee.country)?.flag : ''} {selectedReferee.country}
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
                      <p className="text-sm font-medium text-text-secondary">Certification Status</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedReferee.certification ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-success-600" />
                            <span className="text-success-700 font-semibold">Certified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-danger-600" />
                            <span className="text-danger-700 font-semibold">Not Certified</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedReferee.certification && selectedReferee.certificationDocument && (
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-3 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Certification Document</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedReferee.certificationDocument.startsWith('data:image') ? (
                            <img 
                              src={selectedReferee.certificationDocument} 
                              alt="Certification Document"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary-600" />
                              <span className="text-sm text-primary-600">Document Available</span>
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

                  {selectedReferee.organizations && selectedReferee.organizations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-2">Organizations</p>
                      <div className="space-y-2">
                        {selectedReferee.organizations.map((org, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <span className="text-text-primary">{org}</span>
                            <span className="text-xs text-text-muted bg-primary-100 px-2 py-1 rounded">Official</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Referee Statistics
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {selectedReferee.certification ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {selectedReferee.certification ? 'Certified' : 'Not Certified'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-sm text-text-secondary">Matches Officiated</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">
                    {selectedReferee.organizations?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Organizations</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.floor(Math.random() * 10) + 1}
                  </div>
                  <div className="text-sm text-text-secondary">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedReferee(selectedReferee);
                  setFormData({
                    id: selectedReferee.id,
                    firstName: selectedReferee.firstName,
                    lastName: selectedReferee.lastName,
                    gender: selectedReferee.gender || 'Male',
                    dob: selectedReferee.dob || '',
                    phone1: selectedReferee.phone1 || '',
                    country: selectedReferee.country || 'India',
                    certification: selectedReferee.certification || false,
                    certificationDocument: selectedReferee.certificationDocument || '',
                    status: selectedReferee.status,
                    profilePicture: selectedReferee.profilePicture || '',
                  });
                  setProfilePicturePreview(selectedReferee.profilePicture || '');
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Referee
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    referee: selectedReferee
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Referee Role
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, referee: null })}
        onConfirm={handleDeleteReferee}
        title="Remove Referee Role"
        message="Are you sure you want to remove the Referee role from this user?"
        itemName={confirmDialog.referee ? `${confirmDialog.referee.firstName} ${confirmDialog.referee.lastName}` : ''}
        itemType="Referee Role"
        details={confirmDialog.referee ? getDeleteDetails(confirmDialog.referee) : []}
        warningLevel="medium"
        confirmText="Remove Role"
        cancelText="Keep Role"
      />
    </div>
  );
}