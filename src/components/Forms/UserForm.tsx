import React, { useState } from 'react';
import Button from '../UI/Button';
import { useGlobalSettings } from '../../context/GlobalSettingsContext';
import { globalSettings } from '../../data/mockData';
import { User } from '../../types';
import { Upload, Eye, EyeOff, X, AlertTriangle } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSave: (user: Partial<User>, oldId?: string) => void;
  onCancel: () => void;
  loading?: boolean;
  isCreating?: boolean;
  allUsers?: User[]; // Add this to check for ID conflicts
}

export default function UserForm({ user, onSave, onCancel, loading = false, isCreating = false, allUsers = [] }: UserFormProps) {
  const { settings } = useGlobalSettings();
  
  const [formData, setFormData] = useState({
    id: user?.id || '',
    email: user?.email || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || 'Male',
    dob: user?.dob || '',
    phone1: user?.phone1 || '',
    phone2: user?.phone2 || '',
    country: user?.country || 'India',
    status: user?.status || 'active',
    profilePicture: user?.profilePicture || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>(user?.profilePicture || '');
  const [showIdWarning, setShowIdWarning] = useState(false);

  // Function to format ID input - only allow uppercase letters and numbers
  const formatIdInput = (value: string) => {
    // Remove any characters that are not letters or numbers
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');
    // Convert to uppercase and limit to 10 characters
    return cleaned.toUpperCase().slice(0, 10);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // ID validation
    if (!formData.id) {
      newErrors.id = 'ID is required';
    } else if (formData.id.length < 3) {
      newErrors.id = 'ID must be at least 3 characters';
    } else if (formData.id.length > 10) {
      newErrors.id = 'ID must be maximum 10 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.id)) {
      newErrors.id = 'ID can only contain uppercase letters and numbers';
    } else if (!isCreating && formData.id !== user?.id) {
      // Check for ID conflicts when editing
      const existingUser = allUsers.find(u => u.id === formData.id && u.id !== user?.id);
      if (existingUser) {
        newErrors.id = 'This ID already exists. Please use a different ID.';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (isCreating && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 10) {
      newErrors.firstName = 'First name must be 10 characters or less';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 15) {
      newErrors.lastName = 'Last name must be 15 characters or less';
    }

    if (formData.phone1 && !/^\+?[\d\s-()]+$/.test(formData.phone1)) {
      newErrors.phone1 = 'Invalid phone number format';
    }

    if (formData.phone2 && !/^\+?[\d\s-()]+$/.test(formData.phone2)) {
      newErrors.phone2 = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Include the profile picture in the form data
      const userData = {
        ...formData,
        profilePicture: profilePicturePreview
      };
      
      // Pass the old ID if it's being changed
      const oldId = user?.id !== formData.id ? user?.id : undefined;
      onSave(userData, oldId);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue = value;
    
    // Handle ID formatting
    if (name === 'id') {
      finalValue = formatIdInput(value);
      // Show warning if ID is being changed on existing user
      if (!isCreating && user?.id && finalValue !== user.id && finalValue.length >= 3) {
        setShowIdWarning(true);
      } else {
        setShowIdWarning(false);
      }
    }
    
    // Handle character limits
    if (name === 'firstName' && value.length > 10) {
      finalValue = value.slice(0, 10);
    } else if (name === 'lastName' && value.length > 15) {
      finalValue = value.slice(0, 15);
    }
    
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : finalValue 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setFormData({ ...formData, profilePicture: '' });
    
    // Reset file input
    const fileInput = document.getElementById('profile-picture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const inputClasses = (fieldName: string) => 
    `w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
      errors[fieldName] 
        ? 'border-danger-300 bg-danger-50' 
        : 'border-gray-300 hover:border-gray-400'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profile-picture"
            />
            <label
              htmlFor="profile-picture"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            {profilePicturePreview && (
              <button
                type="button"
                onClick={removeProfilePicture}
                className="text-xs text-danger-600 hover:text-danger-700 mt-1 block"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User ID Field */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          User ID * (3-10 characters, uppercase letters and numbers only)
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          disabled={isCreating && user?.id} // Disable if creating with pre-set ID
          className={`${inputClasses('id')} font-mono text-lg ${isCreating && user?.id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="ABC123"
          maxLength={10}
          style={{ textTransform: 'uppercase' }}
        />
        {errors.id && (
          <p className="mt-1 text-sm text-danger-600">{errors.id}</p>
        )}
        <div className="mt-2 space-y-1">
          <p className="text-xs text-text-muted">
            <span className="font-medium">Character count:</span> {formData.id.length}/10
          </p>
          <p className="text-xs text-text-muted">
            <span className="font-medium">Format:</span> Only uppercase letters (A-Z) and numbers (0-9)
          </p>
        </div>
        
        {/* ID Change Warning */}
        {showIdWarning && !isCreating && (
          <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning-800">ID Change Warning</p>
                <p className="text-sm text-warning-700 mt-1">
                  Changing the user ID will update all references to this user across the system, including:
                </p>
                <ul className="text-xs text-warning-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Coach-player relationships</li>
                  <li>Club memberships</li>
                  <li>Tournament participations</li>
                  <li>Organization memberships</li>
                  <li>Match history and results</li>
                </ul>
                <p className="text-sm font-medium text-warning-800 mt-2">
                  This action cannot be undone. Please ensure the new ID is correct.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses('email')}
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
          )}
        </div>

        {isCreating && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={isCreating}
                className={inputClasses('password')}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            First Name * (max 10 characters)
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            maxLength={10}
            className={inputClasses('firstName')}
            placeholder="John"
          />
          <div className="flex justify-between mt-1">
            {errors.firstName ? (
              <p className="text-sm text-danger-600">{errors.firstName}</p>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-gray-500">{formData.firstName.length}/10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Last Name * (max 15 characters)
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            maxLength={15}
            className={inputClasses('lastName')}
            placeholder="Doe"
          />
          <div className="flex justify-between mt-1">
            {errors.lastName ? (
              <p className="text-sm text-danger-600">{errors.lastName}</p>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-gray-500">{formData.lastName.length}/15</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputClasses('gender')}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={inputClasses('dob')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Phone 1</label>
          <input
            type="text"
            name="phone1"
            value={formData.phone1}
            onChange={handleChange}
            className={inputClasses('phone1')}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone1 && (
            <p className="mt-1 text-sm text-danger-600">{errors.phone1}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Phone 2</label>
          <input
            type="text"
            name="phone2"
            value={formData.phone2}
            onChange={handleChange}
            className={inputClasses('phone2')}
            placeholder="+1 (555) 987-6543"
          />
          {errors.phone2 && (
            <p className="mt-1 text-sm text-danger-600">{errors.phone2}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={inputClasses('country')}
          >
            {globalSettings.countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
          <div className="flex items-center space-x-4 mt-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
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
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-text-primary">Inactive</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isCreating ? 'Add User' : 'Update User'}
        </Button>
      </div>
    </form>
  );
}