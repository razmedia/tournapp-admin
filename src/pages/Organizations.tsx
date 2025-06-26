import React, { useState } from 'react';
import Table from '../components/UI/Table';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useDataPersistence } from '../context/DataPersistenceContext';
import { Organization } from '../types';
import { Plus, Edit, Trash2, Building, Mail, Phone, MapPin, Globe, Users, Calendar, Shield, ExternalLink } from 'lucide-react';

// Generate UUID function
const generateUUID = () => {
  return 'ORG' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export default function Organizations() {
  const { organizations, addOrganization, updateOrganization, deleteOrganization } = useDataPersistence();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    country: 'India',
    manager: '',
    city: '',
    address: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
  });

  const columns = [
    { header: 'ID', key: 'id', width: '80px' },
    { header: 'Name', key: 'name' },
    { header: 'Display Name', key: 'displayName' },
    { header: 'Country', key: 'country' },
    { header: 'Manager', key: 'manager' },
    { 
      header: 'Status', 
      key: 'status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
        }`}>
          {value}
        </span>
      )
    },
    { header: 'Member Count', key: 'memberCount' },
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

  const handleAction = (action: string, org: Organization) => {
    if (action === 'edit') {
      setSelectedOrganization(org);
      setFormData({
        name: org.name,
        displayName: org.displayName,
        country: org.country,
        manager: org.manager,
        city: org.city || '',
        address: org.address || '',
        zip: org.zip || '',
        phone: org.phone || '',
        email: org.email || '',
        website: org.website || '',
      });
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete organization ${org.name}?`)) {
        deleteOrganization(org.id);
      }
    }
  };

  const handleRowClick = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailModalOpen(true);
  };

  const handleSave = () => {
    const organizationData: Organization = {
      id: selectedOrganization?.id || generateUUID(),
      name: formData.name,
      displayName: formData.displayName,
      country: formData.country,
      manager: formData.manager,
      status: 'active',
      memberCount: selectedOrganization?.memberCount || 0,
      city: formData.city,
      address: formData.address,
      zip: formData.zip,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      linkedClubs: selectedOrganization?.linkedClubs || [],
      linkedUsers: selectedOrganization?.linkedUsers || [],
    };

    if (selectedOrganization && isEditModalOpen) {
      updateOrganization(selectedOrganization.id, organizationData);
    } else {
      addOrganization(organizationData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedOrganization(null);
    resetForm();
  };

  const handleCreateOrganization = () => {
    setSelectedOrganization(null);
    resetForm();
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      country: 'India',
      manager: '',
      city: '',
      address: '',
      zip: '',
      phone: '',
      email: '',
      website: '',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const OrganizationForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter organization name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Display Name *
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Short display name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Manager *
          </label>
          <input
            type="text"
            name="manager"
            value={formData.manager}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Manager name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="City"
          />
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

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleFormChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Full address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="contact@organization.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Website
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="https://www.organization.com"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedOrganization(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {selectedOrganization ? 'Update Organization' : 'Create Organization'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Organization Management</h1>
          <p className="text-text-secondary mt-1">Manage tennis organizations and federations</p>
        </div>
        <Button onClick={handleCreateOrganization} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={organizations}
          actions={actions}
          onAction={handleAction}
          onRowClick={handleRowClick}
        />
      </Card>

      {/* Create Organization Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Organization"
        size="lg"
      >
        <OrganizationForm />
      </Modal>

      {/* Edit Organization Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrganization(null);
        }}
        title="Edit Organization"
        size="lg"
      >
        <OrganizationForm />
      </Modal>

      {/* Organization Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrganization(null);
        }}
        title="Organization Details"
        size="xl"
      >
        {selectedOrganization && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-text-primary">{selectedOrganization.name}</h3>
                <p className="text-text-secondary">{selectedOrganization.displayName}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrganization.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'
                  }`}>
                    {selectedOrganization.status}
                  </span>
                  <div className="flex items-center text-sm text-text-muted">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedOrganization.country}
                  </div>
                  <div className="flex items-center text-sm text-text-muted">
                    <Users className="h-4 w-4 mr-1" />
                    {selectedOrganization.memberCount} members
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Basic Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Organization ID</p>
                      <p className="text-text-primary font-mono">{selectedOrganization.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Manager</p>
                      <p className="text-text-primary">{selectedOrganization.manager}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Location</p>
                      <p className="text-text-primary">
                        {selectedOrganization.city && `${selectedOrganization.city}, `}
                        {selectedOrganization.country}
                        {selectedOrganization.zip && ` ${selectedOrganization.zip}`}
                      </p>
                    </div>
                  </div>

                  {selectedOrganization.address && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Address</p>
                        <p className="text-text-primary">{selectedOrganization.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Contact Information
                </h4>
                
                <div className="space-y-3">
                  {selectedOrganization.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Phone</p>
                        <p className="text-text-primary">{selectedOrganization.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrganization.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Email</p>
                        <p className="text-text-primary">{selectedOrganization.email}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrganization.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-text-secondary">Website</p>
                        <a 
                          href={selectedOrganization.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          {selectedOrganization.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Member Count</p>
                      <p className="text-text-primary font-semibold">{selectedOrganization.memberCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Organization Statistics
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedOrganization.memberCount}
                  </div>
                  <div className="text-sm text-text-secondary">Total Members</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">
                    {selectedOrganization.linkedClubs?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Linked Clubs</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">
                    {selectedOrganization.linkedUsers?.length || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Linked Users</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedOrganization.status === 'active' ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-text-secondary">Status</div>
                </div>
              </div>
            </div>

            {/* Linked Clubs */}
            {selectedOrganization.linkedClubs && selectedOrganization.linkedClubs.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Linked Clubs ({selectedOrganization.linkedClubs.length})
                </h4>
                
                <div className="space-y-2">
                  {selectedOrganization.linkedClubs.map((clubId, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Club {clubId}</p>
                          <p className="text-xs text-text-muted">Active Member</p>
                        </div>
                      </div>
                      <span className="text-xs text-success-600 font-medium">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Users */}
            {selectedOrganization.linkedUsers && selectedOrganization.linkedUsers.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                  Linked Users ({selectedOrganization.linkedUsers.length})
                </h4>
                
                <div className="space-y-2">
                  {selectedOrganization.linkedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-success-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">User {user.id}</p>
                          <p className="text-xs text-text-muted">{user.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary-600 font-medium">{user.role}</span>
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
                  setSelectedOrganization(selectedOrganization);
                  setFormData({
                    name: selectedOrganization.name,
                    displayName: selectedOrganization.displayName,
                    country: selectedOrganization.country,
                    manager: selectedOrganization.manager,
                    city: selectedOrganization.city || '',
                    address: selectedOrganization.address || '',
                    zip: selectedOrganization.zip || '',
                    phone: selectedOrganization.phone || '',
                    email: selectedOrganization.email || '',
                    website: selectedOrganization.website || '',
                  });
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Organization
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete organization ${selectedOrganization.name}?`)) {
                    deleteOrganization(selectedOrganization.id);
                    setIsDetailModalOpen(false);
                    setSelectedOrganization(null);
                  }
                }}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Organization
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}