import React, { useState, useMemo } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import UserForm from '../components/Forms/UserForm';
import { User } from '../types';
import { useUsers } from '../context/UserContext';
import { Edit, Trash2, Plus, Mail, Phone, MapPin, Calendar, Shield, Building, Users as UsersIcon, Search, Upload, UserPlus, UserMinus } from 'lucide-react';

export default function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [idError, setIdError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Use the UserContext
  const { users, setUsers, addUser, updateUser, deleteUser, assignRole, removeRole } = useUsers();
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null
  });

  // Function to update user references across all data
  const updateUserReferences = (oldId: string, newId: string, updatedUser: User) => {
    console.log(`Updating user references from ${oldId} to ${newId}`);
    
    // Update the user in the users array
    const updatedUsers = users.map(user => 
      user.id === oldId ? { ...user, ...updatedUser, id: newId } : user
    );
    
    setUsers(updatedUsers);
    return updatedUsers;
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase().trim();
    return users.filter(user => {
      // Search in basic fields
      const basicFields = [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.role,
        user.status,
        user.lastLogin,
        user.phone1 || '',
        user.phone2 || '',
        user.country || '',
        user.gender || '',
        user.dob || '',
        user.classification || '',
        ...(user.roles || [])
      ].join(' ').toLowerCase();

      // Search in organizations
      const organizations = user.organizations ? user.organizations.join(' ').toLowerCase() : '';
      
      // Search in clubs
      const clubs = user.clubs ? user.clubs.join(' ').toLowerCase() : '';
      
      // Combine all searchable text
      const searchableText = `${basicFields} ${organizations} ${clubs}`;
      
      return searchableText.includes(query);
    });
  }, [searchQuery, users]);

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
    { header: 'Gender', key: 'gender' },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone1' },
    { 
      header: 'Primary Role', 
      key: 'role',
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {value}
        </span>
      )
    },
    { 
      header: 'All Roles', 
      key: 'roles',
      render: (_, row: User) => (
        <div className="flex flex-wrap gap-1">
          {(row.roles || [row.role]).map((role, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                role === 'Coach' ? 'bg-blue-100 text-blue-800' :
                role === 'Referee' ? 'bg-green-100 text-green-800' :
                role === 'Player' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {role}
            </span>
          ))}
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
    { header: 'Last Login', key: 'lastLogin' },
  ];

  const actions = [
    { 
      label: 'Manage Roles', 
      action: 'manage-roles', 
      variant: 'primary' as const,
      icon: <UserPlus className="h-4 w-4" />
    },
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

  const handleAction = (action: string, user: User) => {
    if (action === 'edit') {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      setConfirmDialog({
        isOpen: true,
        user: user
      });
    } else if (action === 'manage-roles') {
      setSelectedUser(user);
      setIsRoleModalOpen(true);
    }
  };

  const handleDeleteUser = () => {
    if (confirmDialog.user) {
      console.log('Deleting user:', confirmDialog.user.id);
      deleteUser(confirmDialog.user.id);
      setConfirmDialog({ isOpen: false, user: null });
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleSave = (userData: Partial<User>, oldId?: string) => {
    console.log('Saving user:', userData, 'Old ID:', oldId);
    
    if (selectedUser && selectedUser.id) {
      if (isCreateModalOpen) {
        // Creating new user - automatically add without confirmation
        const newUser: User = {
          id: selectedUser.id,
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          role: userData.role || 'User',
          roles: userData.roles || [userData.role || 'User'],
          status: userData.status || 'active',
          lastLogin: new Date().toISOString().split('T')[0], // Today's date
          gender: userData.gender,
          dob: userData.dob,
          phone1: userData.phone1,
          phone2: userData.phone2,
          country: userData.country,
          classification: userData.classification,
          organizations: userData.organizations,
          clubs: userData.clubs,
          profilePicture: userData.profilePicture,
          password: userData.password, // Include password for new users
        };
        
        addUser(newUser);
        
        // Close modal immediately without confirmation
        setIsCreateModalOpen(false);
        setSelectedUser(null);
        
        console.log(`User "${newUser.firstName} ${newUser.lastName}" has been added successfully!`);
        
      } else if (isEditModalOpen) {
        // Editing existing user
        if (oldId && oldId !== userData.id) {
          // ID has changed - update all references
          const updatedUser = { ...selectedUser, ...userData };
          updateUserReferences(oldId, userData.id!, updatedUser);
          
          alert(`User ID changed from "${oldId}" to "${userData.id}". All references have been updated across the system.`);
        } else {
          // Regular update without ID change
          updateUser(selectedUser.id, userData);
        }
        
        // Close modal and show success message
        setIsEditModalOpen(false);
        setSelectedUser(null);
        alert(`User "${userData.firstName} ${userData.lastName}" has been updated successfully!`);
      }
    }
  };

  const handleCreateUser = () => {
    setNewUserId('');
    setIdError('');
    setIsIdModalOpen(true);
  };

  // Function to format ID input - only allow uppercase letters and numbers
  const formatIdInput = (value: string) => {
    // Remove any characters that are not letters or numbers
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');
    // Convert to uppercase and limit to 10 characters
    return cleaned.toUpperCase().slice(0, 10);
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserId.trim()) {
      setIdError('User ID is required');
      return;
    }

    // Validate 10 characters maximum requirement
    if (newUserId.length < 3) {
      setIdError('ID must be at least 3 characters');
      return;
    }

    if (newUserId.length > 10) {
      setIdError('ID must be maximum 10 characters');
      return;
    }

    // Validate only letters and numbers
    if (!/^[A-Z0-9]+$/.test(newUserId)) {
      setIdError('ID can only contain uppercase letters and numbers');
      return;
    }

    // Check if ID already exists
    const existingUser = users.find(user => user.id === newUserId);
    if (existingUser) {
      setIdError('This ID already exists. Please use a different ID.');
      return;
    }

    // ID is valid, proceed to user form
    setIsIdModalOpen(false);
    setSelectedUser({ 
      id: newUserId, 
      email: '', 
      firstName: '', 
      lastName: '', 
      role: 'User', 
      roles: ['User'],
      status: 'active', 
      lastLogin: '' 
    } as User);
    setIsCreateModalOpen(true);
  };

  const handleAssignRole = (role: string) => {
    if (selectedUser) {
      // Navigate to the appropriate role assignment page
      setIsRoleModalOpen(false);
      
      // Store the selected role for later use
      setSelectedRole(role);
      
      // Redirect to the appropriate page based on role
      if (role === 'Coach') {
        window.location.href = `/coaches?userId=${selectedUser.id}`;
      } else if (role === 'Referee') {
        window.location.href = `/referees?userId=${selectedUser.id}`;
      } else if (role === 'Player') {
        window.location.href = `/players?userId=${selectedUser.id}`;
      }
    }
  };

  const handleRemoveRole = (role: string) => {
    if (selectedUser && role !== 'User') {
      if (window.confirm(`Are you sure you want to remove the ${role} role from ${selectedUser.firstName} ${selectedUser.lastName}?`)) {
        removeRole(selectedUser.id, role);
        
        // Update the selected user
        const updatedUser = users.find(u => u.id === selectedUser.id);
        if (updatedUser) {
          setSelectedUser(updatedUser);
        }
      }
    }
  };

  const getDeleteDetails = (user: User) => {
    const details = [
      'User profile and account information',
      'Tournament and league participations',
      'Match history and results'
    ];

    if (user.organizations && user.organizations.length > 0) {
      details.push(`Organization memberships: ${user.organizations.join(', ')}`);
    }

    if (user.clubs && user.clubs.length > 0) {
      details.push(`Club memberships: ${user.clubs.join(', ')}`);
    }

    // Add role-specific details
    const roles = user.roles || [user.role];
    if (roles.includes('Coach')) {
      details.push('Coaching assignments and player relationships');
    }
    if (roles.includes('Referee')) {
      details.push('Referee assignments and match officiating history');
    }
    if (roles.includes('Player')) {
      details.push('Player rankings and tournament results');
    }

    return details;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Users</h1>
          <p className="text-text-secondary mt-1">Manage system users and their roles</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, phone, email, or personal ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <Button onClick={handleCreateUser} className="inline-flex items-center px-3 py-2" data-action="add-user">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-text-secondary">
          Showing {filteredUsers.length} of {users.length} users
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
          data={filteredUsers}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? `No users found matching "${searchQuery}"` : "No users available"}
        />
      </Card>

      {/* ID Input Modal */}
      <Modal
        isOpen={isIdModalOpen}
        onClose={() => {
          setIsIdModalOpen(false);
          setNewUserId('');
          setIdError('');
        }}
        title="Create New User - Step 1"
        size="md"
      >
        <form onSubmit={handleIdSubmit} className="space-y-6">
          <div>
            <p className="text-text-secondary mb-4">
              First, please provide a unique ID for the new user using uppercase letters and numbers.
            </p>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ID (3-10 characters) *
            </label>
            <input
              type="text"
              value={newUserId}
              onChange={(e) => {
                const formattedValue = formatIdInput(e.target.value);
                setNewUserId(formattedValue);
                setIdError('');
              }}
              className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-lg ${
                idError 
                  ? 'border-danger-300 bg-danger-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="ABC123"
              maxLength={10}
              autoFocus
              style={{ textTransform: 'uppercase' }}
            />
            {idError && (
              <p className="mt-1 text-sm text-danger-600">{idError}</p>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-text-muted">
                <span className="font-medium">Character count:</span> {newUserId.length}/10
              </p>
              <p className="text-xs text-text-muted">
                <span className="font-medium">Format:</span> Only uppercase letters (A-Z) and numbers (0-9)
              </p>
              <p className="text-xs text-text-muted">
                <span className="font-medium">Examples:</span> USER001, ADMIN1, PLAYER99, ABC123XYZ
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsIdModalOpen(false);
                setNewUserId('');
                setIdError('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedUser(null);
        }}
        title="Create New User - Step 2"
        size="lg"
      >
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-700">
            <span className="font-medium">User ID:</span> <span className="font-mono text-lg">{selectedUser?.id}</span>
          </p>
        </div>
        <UserForm
          user={selectedUser || undefined}
          onSave={handleSave}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setSelectedUser(null);
          }}
          isCreating={true}
          allUsers={users}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        <UserForm
          user={selectedUser || undefined}
          onSave={handleSave}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          isCreating={false}
          allUsers={users}
        />
      </Modal>

      {/* Role Management Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        title="Manage User Roles"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200">
                  {selectedUser.profilePicture ? (
                    <img 
                      src={selectedUser.profilePicture} 
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-sm text-text-secondary">{selectedUser.email}</p>
                  <p className="text-xs text-text-muted mt-1">ID: {selectedUser.id}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Current Roles</h4>
              <div className="space-y-2">
                {(selectedUser.roles || [selectedUser.role]).map((role, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        role === 'Super Admin' ? 'bg-purple-100 text-purple-600' :
                        role === 'Coach' ? 'bg-blue-100 text-blue-600' :
                        role === 'Referee' ? 'bg-green-100 text-green-600' :
                        role === 'Player' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{role}</span>
                    </div>
                    {role !== 'User' && (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveRole(role)}
                        className="flex items-center"
                      >
                        <UserMinus className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Assign New Role</h4>
              <div className="grid grid-cols-1 gap-3">
                {['Coach', 'Referee', 'Player'].map((role) => {
                  const hasRole = selectedUser.roles?.includes(role) || selectedUser.role === role;
                  return (
                    <button
                      key={role}
                      onClick={() => !hasRole && handleAssignRole(role)}
                      disabled={hasRole}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        hasRole 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'bg-white border-primary-200 hover:bg-primary-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          role === 'Coach' ? 'bg-blue-100 text-blue-600' :
                          role === 'Referee' ? 'bg-green-100 text-green-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <UserPlus className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium">{role}</span>
                          <p className="text-xs text-text-muted">
                            {hasRole 
                              ? `User already has ${role} role` 
                              : `Assign ${role} role to this user`}
                          </p>
                        </div>
                      </div>
                      {!hasRole && (
                        <span className="text-xs text-primary-600 font-medium">Assign</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">About Role Management</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Users can have multiple roles simultaneously</li>
                    <li>• Assigning a role will redirect you to the role-specific form</li>
                    <li>• Removing a role will delete role-specific data</li>
                    <li>• The User role cannot be removed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
        size="xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Header Section with Profile Picture */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {selectedUser.profilePicture ? (
                  <img 
                    src={selectedUser.profilePicture} 
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-text-secondary text-lg">{selectedUser.email}</p>
                <div className="flex items-center mt-3 space-x-3">
                  <Shield className="h-4 w-4 mr-1 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">{selectedUser.role}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                User Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedUser.roles || [selectedUser.role]).map((role, index) => (
                  <div 
                    key={index} 
                    className={`px-4 py-2 rounded-lg ${
                      role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                      role === 'Coach' ? 'bg-blue-100 text-blue-800' :
                      role === 'Referee' ? 'bg-green-100 text-green-800' :
                      role === 'Player' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">{role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUser(selectedUser);
                  setIsRoleModalOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
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
                      <p className="text-sm font-medium text-text-secondary">ID</p>
                      <p className="text-text-primary font-mono text-lg font-bold">{selectedUser.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Email</p>
                      <p className="text-text-primary">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">First Name</p>
                      <p className="text-text-primary">{selectedUser.firstName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Last Name</p>
                      <p className="text-text-primary">{selectedUser.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">⚧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Gender</p>
                      <p className="text-text-primary">{selectedUser.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  {selectedUser.dob && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Date of Birth</p>
                        <p className="text-text-primary">{selectedUser.dob}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Contact & System Information
                </h4>
                
                <div className="space-y-4">
                  {selectedUser.phone1 && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone 1</p>
                        <p className="text-text-primary">{selectedUser.phone1}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.phone2 && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone 2</p>
                        <p className="text-text-primary">{selectedUser.phone2}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.country && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Country</p>
                        <p className="text-text-primary">{selectedUser.country}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Last Login</p>
                      <p className="text-text-primary">{selectedUser.lastLogin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {selectedUser.roles?.includes('Coach') && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Coach Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Years of Experience</p>
                    <p className="text-xl font-bold text-blue-700">{selectedUser.yearOfExperience || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Associated Players</p>
                    <p className="text-xl font-bold text-blue-700">{selectedUser.associatedPlayers?.length || 0}</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = `/coaches?userId=${selectedUser.id}`}
                >
                  View Coach Profile
                </Button>
              </div>
            )}

            {selectedUser.roles?.includes('Referee') && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Referee Information
                </h4>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Certification Status</p>
                  <p className="text-xl font-bold text-green-700">
                    {selectedUser.certification ? 'Certified' : 'Not Certified'}
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = `/referees?userId=${selectedUser.id}`}
                >
                  View Referee Profile
                </Button>
              </div>
            )}

            {selectedUser.roles?.includes('Player') && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Player Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Rank</p>
                    <p className="text-xl font-bold text-orange-700">#{selectedUser.rank || 'Unranked'}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Points</p>
                    <p className="text-xl font-bold text-orange-700">{selectedUser.points || 0}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Dominant Hand</p>
                    <p className="text-xl font-bold text-orange-700">{selectedUser.dominantHand || 'Not specified'}</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = `/players?userId=${selectedUser.id}`}
                >
                  View Player Profile
                </Button>
              </div>
            )}

            {/* Associated Organizations */}
            {selectedUser.organizations && selectedUser.organizations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Associated Organizations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedUser.organizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-primary-600" />
                        <span className="text-text-primary font-medium">{org}</span>
                      </div>
                      <span className="text-xs text-text-muted bg-primary-100 px-2 py-1 rounded">Member</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Clubs */}
            {selectedUser.clubs && selectedUser.clubs.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Associated Clubs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedUser.clubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UsersIcon className="h-5 w-5 text-success-600" />
                        <span className="text-text-primary font-medium">{club}</span>
                      </div>
                      <span className="text-xs text-text-muted bg-success-100 px-2 py-1 rounded">Member</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button 
                variant="primary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUser(selectedUser);
                  setIsRoleModalOpen(true);
                }}
                className="flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUser(selectedUser);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setConfirmDialog({
                    isOpen: true,
                    user: selectedUser
                  });
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account?"
        itemName={confirmDialog.user ? `${confirmDialog.user.firstName} ${confirmDialog.user.lastName}` : ''}
        itemType="User Account"
        details={confirmDialog.user ? getDeleteDetails(confirmDialog.user) : []}
      />
    </div>
  );
}