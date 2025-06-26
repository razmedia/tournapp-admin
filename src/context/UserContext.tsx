import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
  assignRole: (userId: string, role: string, roleData?: any) => void;
  removeRole: (userId: string, role: string) => void;
  createUserWithRole: (userData: Partial<User>, role: string, roleData?: any) => User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default users including Harry Potter admin
const defaultUsers: User[] = [
  {
    id: 'ADMIN001',
    email: 'harry.potter@tournapp.com',
    password: 'admin123',
    firstName: 'Harry',
    lastName: 'Potter',
    role: 'Super Admin',
    roles: ['Super Admin'], // New: array of all roles
    status: 'active',
    lastLogin: new Date().toISOString().split('T')[0],
    gender: 'Male',
    dob: '1980-07-31',
    phone1: '+44 20 7946 0958',
    country: 'UK',
    organizations: ['Tournapp System'],
    clubs: ['Admin Club'],
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: 'USER001',
    email: 'mike.brown@example.com',
    firstName: 'Mike',
    lastName: 'Brown',
    role: 'User',
    roles: ['User', 'Coach'], // Multiple roles
    status: 'active',
    lastLogin: '2025-06-20',
    gender: 'Male',
    dob: '1980-03-10',
    phone1: '+919876543212',
    country: 'India',
    organizations: ['Tennis Federation'],
    clubs: ['Mumbai Tennis Club', 'Delhi Sports Club'],
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    // Coach-specific data
    yearOfExperience: 15,
    licenseCertificate: 'https://example.com/certificate1.pdf',
    associatedPlayers: ['USER003', 'USER004'],
  },
  {
    id: 'USER002',
    email: 'alex.referee@example.com',
    firstName: 'Alex',
    lastName: 'Thompson',
    role: 'User',
    roles: ['User', 'Referee'],
    status: 'active',
    lastLogin: '2025-06-20',
    gender: 'Male',
    dob: '1975-09-12',
    phone1: '+919876543216',
    country: 'India',
    organizations: ['Tennis Federation'],
    profilePicture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
    // Referee-specific data
    certification: true,
    certificationDocument: 'https://example.com/ref-cert1.pdf',
  },
  {
    id: 'USER003',
    email: 'alex.player@example.com',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    role: 'User',
    roles: ['User', 'Player'],
    status: 'active',
    lastLogin: '2025-06-20',
    gender: 'Male',
    dob: '2000-03-15',
    phone1: '+919876543220',
    country: 'Spain',
    clubs: ['Mumbai Tennis Club'],
    profilePicture: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
    // Player-specific data
    height: '6\'2"',
    weight: '180 lbs',
    dominantHand: 'Right',
    healthCertificate: 'https://example.com/health-cert1.pdf',
    coach: 'Mike Brown',
    rank: 1,
    points: 2500,
    tournamentHistory: [
      { id: 't1', name: 'Summer Open 2025', date: '2025-06-01', result: 'Winner', points: 500 },
    ],
    playerHistory: [
      { id: 'h1', type: 'tournament', description: 'Won Summer Open 2025', date: '2025-06-01', details: 'Defeated John Smith 6-4, 6-2' },
    ],
  },
  {
    id: 'USER004',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'User',
    roles: ['User'],
    status: 'active',
    lastLogin: '2025-06-19',
    gender: 'Male',
    dob: '1990-05-15',
    phone1: '+919876543210',
    country: 'India',
    classification: 'Juniors',
    organizations: ['Tennis Federation'],
    clubs: ['Mumbai Club'],
  },
];

const STORAGE_KEY = 'tournapp-users';

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState<User[]>(defaultUsers);

  // Load users from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        // Migrate old data structure to new one
        const migratedUsers = parsed.map((user: User) => ({
          ...user,
          roles: user.roles || [user.role || 'User'], // Ensure roles array exists
        }));
        setUsersState(migratedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  // Save users to localStorage whenever they change
  const setUsers = (newUsers: User[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
      setUsersState(newUsers);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const addUser = (user: User) => {
    const userWithRoles = {
      ...user,
      roles: user.roles || [user.role || 'User']
    };
    const newUsers = [...users, userWithRoles];
    setUsers(newUsers);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const newUsers = users.map(user => {
      if (user.id === id) {
        const updatedUser = { ...user, ...userData };
        // Ensure roles array is updated when role changes
        if (userData.role && !updatedUser.roles?.includes(userData.role)) {
          updatedUser.roles = [...(updatedUser.roles || []), userData.role];
        }
        return updatedUser;
      }
      return user;
    });
    setUsers(newUsers);
  };

  const deleteUser = (id: string) => {
    const newUsers = users.filter(user => user.id !== id);
    setUsers(newUsers);
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.roles?.includes(role) || user.role === role);
  };

  // Assign a new role to an existing user
  const assignRole = (userId: string, role: string, roleData?: any) => {
    const newUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user };
        
        // Add role to roles array if not already present
        if (!updatedUser.roles?.includes(role)) {
          updatedUser.roles = [...(updatedUser.roles || []), role];
        }
        
        // Update primary role if it's more specific than 'User'
        if (role !== 'User' && (updatedUser.role === 'User' || !updatedUser.role)) {
          updatedUser.role = role;
        }
        
        // Add role-specific data
        if (roleData) {
          Object.assign(updatedUser, roleData);
        }
        
        return updatedUser;
      }
      return user;
    });
    setUsers(newUsers);
  };

  // Remove a role from a user
  const removeRole = (userId: string, role: string) => {
    const newUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user };
        
        // Remove role from roles array
        updatedUser.roles = updatedUser.roles?.filter(r => r !== role) || [];
        
        // If removing the primary role, set to 'User' or first available role
        if (updatedUser.role === role) {
          updatedUser.role = updatedUser.roles.find(r => r !== 'User') || 'User';
        }
        
        // Remove role-specific data based on role
        if (role === 'Coach') {
          delete updatedUser.yearOfExperience;
          delete updatedUser.licenseCertificate;
          delete updatedUser.associatedPlayers;
        } else if (role === 'Referee') {
          delete updatedUser.certification;
          delete updatedUser.certificationDocument;
        } else if (role === 'Player') {
          delete updatedUser.height;
          delete updatedUser.weight;
          delete updatedUser.dominantHand;
          delete updatedUser.healthCertificate;
          delete updatedUser.coach;
          delete updatedUser.rank;
          delete updatedUser.points;
          delete updatedUser.tournamentHistory;
          delete updatedUser.playerHistory;
        }
        
        return updatedUser;
      }
      return user;
    });
    setUsers(newUsers);
  };

  // Create a new user with a specific role
  const createUserWithRole = (userData: Partial<User>, role: string, roleData?: any): User => {
    const newUser: User = {
      id: userData.id || `USER${Date.now()}`,
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: role === 'User' ? 'User' : role,
      roles: role === 'User' ? ['User'] : ['User', role],
      status: userData.status || 'active',
      lastLogin: new Date().toISOString().split('T')[0],
      ...userData,
      ...roleData
    };
    
    addUser(newUser);
    return newUser;
  };

  const contextValue: UserContextType = {
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
    assignRole,
    removeRole,
    createUserWithRole,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}