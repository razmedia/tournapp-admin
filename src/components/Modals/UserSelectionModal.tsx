import React, { useState, useMemo } from 'react';
import { X, Search, Users, Plus, UserPlus } from 'lucide-react';
import { User } from '../../types';
import Button from '../UI/Button';
import Table from '../UI/Table';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (user: User) => void;
  onAddNewUser: () => void;
  title: string;
  targetRole: string;
}

export default function UserSelectionModal({
  isOpen,
  onClose,
  users,
  onSelectUser,
  onAddNewUser,
  title,
  targetRole
}: UserSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users to only show those without specific roles (Coach, Referee, Player)
  // or those who already have the target role
  const availableUsers = useMemo(() => {
    return users.filter(user => {
      // If user already has the target role, don't show them
      if (user.roles?.includes(targetRole) || user.role === targetRole) {
        return false;
      }
      
      // Allow all users to be assigned any role (multi-role system)
      return true;
    });
  }, [users, targetRole]);

  // Filter available users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;
    
    const query = searchQuery.toLowerCase().trim();
    return availableUsers.filter(user => {
      const searchableText = [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.phone1 || '',
        user.country || '',
        user.status
      ].join(' ').toLowerCase();
      
      return searchableText.includes(query);
    });
  }, [searchQuery, availableUsers]);

  const columns = [
    { 
      header: 'Profile Picture', 
      key: 'profilePicture',
      width: '80px',
      render: (_, row: User) => (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
          {row.profilePicture ? (
            <img 
              src={row.profilePicture} 
              alt={`${row.firstName} ${row.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-medium text-xs">
                {row.firstName[0]}{row.lastName[0]}
              </span>
            </div>
          )}
        </div>
      )
    },
    { header: 'ID', key: 'id', width: '100px' },
    { 
      header: 'Full Name', 
      key: 'fullName', 
      render: (_, row: User) => `${row.firstName} ${row.lastName}` 
    },
    { header: 'Email', key: 'email' },
    { 
      header: 'Current Roles', 
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleRowClick = (user: User) => {
    onSelectUser(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                <p className="text-sm text-text-secondary">Select an existing user or create a new one</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
              
              <Button 
                onClick={onAddNewUser}
                className="flex items-center ml-4"
                variant="primary"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New User
              </Button>
            </div>

            {/* Search Results Info */}
            <div className="mb-4">
              <p className="text-sm text-text-secondary">
                Showing {filteredUsers.length} of {users.length} users
                {searchQuery && (
                  <span className="ml-2">
                    for "<span className="font-medium text-text-primary">{searchQuery}</span>"
                  </span>
                )}
              </p>
              <p className="text-xs text-text-muted mt-1">
                Note: Users who already have the {targetRole} role are not shown
              </p>
            </div>

            {/* Users Table */}
            <div className="max-h-96 overflow-y-auto">
              <Table
                columns={columns}
                data={filteredUsers}
                onRowClick={handleRowClick}
                emptyMessage={searchQuery ? `No users found matching "${searchQuery}"` : `No available users to assign ${targetRole} role`}
              />
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">How to assign {targetRole} role:</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Click on any user row to select them and assign the {targetRole} role</li>
                    <li>• User's basic information will be pre-filled in the {targetRole} form</li>
                    <li>• You can add {targetRole}-specific information in the next step</li>
                    <li>• Or click "Create New User" to add a completely new user</li>
                    <li>• Users can have multiple roles (Coach, Referee, Player) simultaneously</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-border">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}