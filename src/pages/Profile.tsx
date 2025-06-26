import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Harry',
    lastName: 'Potter',
    email: 'harry.potter@tournapp.com',
    phone: '+44 20 7946 0958',
    role: 'Super Admin',
    department: 'System Administration',
    location: 'London, UK',
    joinDate: '2024-01-15',
    bio: 'Experienced system administrator with expertise in tournament management systems and sports technology.',
  });

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src="/assets/image.png"
                  alt="Harry Potter"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary mx-auto"
                />
                <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
                  <User className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-text">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600">{formData.role}</p>
              <p className="text-sm text-gray-500">{formData.department}</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.email}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {formData.phone}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.location}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(formData.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6" title="Quick Stats">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="font-semibold">Today, 9:30 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="flex items-center py-2">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-gray-900">{formData.role}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.department}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.location}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{formData.bio}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-border">
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Security Settings */}
          <Card className="mt-6" title="Security Settings">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <Button variant="secondary" size="sm">
                  Change Password
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="secondary" size="sm">
                  Enable 2FA
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Login Sessions</h4>
                  <p className="text-sm text-gray-600">Manage your active sessions</p>
                </div>
                <Button variant="secondary" size="sm">
                  View Sessions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}