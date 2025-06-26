import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, Search, X, Users, Trophy, Building, BarChart3, FileText, Plus, Edit, Trash2, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockTournaments, mockClubs, mockOrganizations } from '../../data/mockData';
import SignOutConfirmDialog from '../UI/SignOutConfirmDialog';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'user' | 'tournament' | 'club' | 'organization' | 'page' | 'action';
  route: string;
  icon: React.ReactNode;
  action?: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Initialize notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New User Registration',
        message: 'John Smith has registered as a new player',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionLabel: 'View User',
        actionRoute: '/users'
      },
      {
        id: '2',
        title: 'Tournament Update',
        message: 'Summer Open 2025 status changed to ongoing',
        type: 'success',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        actionLabel: 'View Tournament',
        actionRoute: '/tournaments'
      },
      {
        id: '3',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin at 2:00 AM',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: '4',
        title: 'Payment Received',
        message: 'Tournament fee payment received from Mumbai Club',
        type: 'success',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        actionLabel: 'View Details',
        actionRoute: '/reports'
      },
      {
        id: '5',
        title: 'Server Alert',
        message: 'High CPU usage detected on server',
        type: 'error',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Define searchable pages and actions
  const searchablePages = [
    { title: 'Dashboard', route: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { title: 'User Management', route: '/users', icon: <Users className="h-4 w-4" /> },
    { title: 'Tournaments', route: '/tournaments', icon: <Trophy className="h-4 w-4" /> },
    { title: 'Leagues', route: '/leagues', icon: <Trophy className="h-4 w-4" /> },
    { title: 'Clubs', route: '/clubs', icon: <Building className="h-4 w-4" /> },
    { title: 'Coaches', route: '/coaches', icon: <Users className="h-4 w-4" /> },
    { title: 'Referees', route: '/referees', icon: <Users className="h-4 w-4" /> },
    { title: 'Players', route: '/players', icon: <Users className="h-4 w-4" /> },
    { title: 'Organizations', route: '/organizations', icon: <BarChart3 className="h-4 w-4" /> },
    { title: 'Global Settings', route: '/global-settings', icon: <Settings className="h-4 w-4" /> },
    { title: 'System Settings', route: '/system-settings', icon: <Settings className="h-4 w-4" /> },
    { title: 'Reports', route: '/reports', icon: <FileText className="h-4 w-4" /> },
    { title: 'Publishing', route: '/publishing', icon: <FileText className="h-4 w-4" /> },
    { title: 'Advertising', route: '/advertising', icon: <FileText className="h-4 w-4" /> },
    { title: 'Ranking', route: '/ranking', icon: <Trophy className="h-4 w-4" /> },
  ];

  // Function to trigger button clicks with better error handling
  const triggerButtonClick = (selector: string, maxAttempts: number = 5) => {
    let attempts = 0;
    
    const tryClick = () => {
      attempts++;
      const button = document.querySelector(selector) as HTMLButtonElement;
      
      if (button) {
        console.log(`Found button with selector: ${selector}`);
        button.click();
        return true;
      } else if (attempts < maxAttempts) {
        console.log(`Button not found (attempt ${attempts}), retrying...`);
        setTimeout(tryClick, 200); // Wait 200ms before retrying
        return false;
      } else {
        console.warn(`Button with selector ${selector} not found after ${maxAttempts} attempts`);
        return false;
      }
    };
    
    return tryClick();
  };

  // Define searchable actions with improved execution
  const searchableActions = [
    {
      title: 'Add New User',
      subtitle: 'Create a new user account',
      keywords: ['add user', 'create user', 'new user', 'register user'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Add New User');
        navigate('/users');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-user"]');
        }, 300);
      }
    },
    {
      title: 'Create Tournament',
      subtitle: 'Start a new tournament',
      keywords: ['add tournament', 'create tournament', 'new tournament'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Create Tournament');
        navigate('/tournaments');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-tournament"]');
        }, 300);
      }
    },
    {
      title: 'Add Club',
      subtitle: 'Register a new tennis club',
      keywords: ['add club', 'create club', 'new club', 'register club'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Add Club');
        navigate('/clubs');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-club"]');
        }, 300);
      }
    },
    {
      title: 'Add Coach',
      subtitle: 'Register a new coach',
      keywords: ['add coach', 'create coach', 'new coach', 'register coach'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Add Coach');
        navigate('/coaches');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-coach"]');
        }, 300);
      }
    },
    {
      title: 'Add Player',
      subtitle: 'Register a new player',
      keywords: ['add player', 'create player', 'new player', 'register player'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Add Player');
        navigate('/players');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-player"]');
        }, 300);
      }
    },
    {
      title: 'Add Referee',
      subtitle: 'Register a new referee',
      keywords: ['add referee', 'create referee', 'new referee', 'register referee'],
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Add Referee');
        navigate('/referees');
        setTimeout(() => {
          triggerButtonClick('[data-action="add-referee"]');
        }, 300);
      }
    },
    {
      title: 'Generate Report',
      subtitle: 'Create system reports',
      keywords: ['generate report', 'create report', 'new report', 'export data'],
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        console.log('Executing: Generate Report');
        navigate('/reports');
      }
    },
    {
      title: 'System Settings',
      subtitle: 'Configure system preferences',
      keywords: ['settings', 'preferences', 'configuration', 'theme', 'language'],
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        console.log('Executing: System Settings');
        navigate('/system-settings');
      }
    },
    {
      title: 'View Profile',
      subtitle: 'Manage your profile',
      keywords: ['profile', 'account', 'personal info'],
      icon: <User className="h-4 w-4" />,
      action: () => {
        console.log('Executing: View Profile');
        navigate('/profile');
      }
    }
  ];

  // Search function
  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search actions first (higher priority)
    searchableActions.forEach(action => {
      const titleMatch = action.title.toLowerCase().includes(searchTerm);
      const keywordMatch = action.keywords.some(keyword => keyword.includes(searchTerm));
      
      if (titleMatch || keywordMatch) {
        results.push({
          id: `action-${action.title}`,
          title: action.title,
          subtitle: action.subtitle,
          type: 'action',
          route: '',
          icon: action.icon,
          action: action.action
        });
      }
    });

    // Search tournaments
    mockTournaments.forEach(tournament => {
      const name = tournament.name.toLowerCase();
      const organization = tournament.organization.toLowerCase();
      const location = tournament.location.toLowerCase();
      
      if (name.includes(searchTerm) || organization.includes(searchTerm) || location.includes(searchTerm) || tournament.id.toLowerCase().includes(searchTerm)) {
        results.push({
          id: tournament.id,
          title: tournament.name,
          subtitle: `Tournament • ${tournament.organization} • ${tournament.location}`,
          type: 'tournament',
          route: `/tournaments`,
          icon: <Trophy className="h-4 w-4" />
        });
      }
    });

    // Search clubs
    mockClubs.forEach(club => {
      const name = club.name.toLowerCase();
      const contact = club.contact.toLowerCase();
      
      if (name.includes(searchTerm) || contact.includes(searchTerm) || club.id.toLowerCase().includes(searchTerm)) {
        results.push({
          id: club.id,
          title: club.name,
          subtitle: `Club • ${club.contact}`,
          type: 'club',
          route: `/clubs`,
          icon: <Building className="h-4 w-4" />
        });
      }
    });

    // Search organizations
    mockOrganizations.forEach(org => {
      const name = org.name.toLowerCase();
      const displayName = org.displayName.toLowerCase();
      const country = org.country.toLowerCase();
      
      if (name.includes(searchTerm) || displayName.includes(searchTerm) || country.includes(searchTerm) || org.id.toLowerCase().includes(searchTerm)) {
        results.push({
          id: org.id,
          title: org.name,
          subtitle: `Organization • ${org.country} • ${org.memberCount} members`,
          type: 'organization',
          route: `/organizations`,
          icon: <BarChart3 className="h-4 w-4" />
        });
      }
    });

    // Search pages
    searchablePages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm)) {
        results.push({
          id: page.route,
          title: page.title,
          subtitle: 'Page',
          type: 'page',
          route: page.route,
          icon: page.icon
        });
      }
    });

    // Limit results and sort by relevance (actions first)
    return results.slice(0, 8);
  };

  // Handle search input change
  useEffect(() => {
    const results = performSearch(searchQuery);
    setSearchResults(results);
    setSelectedResultIndex(-1);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0) {
          handleResultClick(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setIsSearchFocused(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click with improved action execution
  const handleResultClick = (result: SearchResult) => {
    console.log('Clicked result:', result);
    
    // Clear search state first
    setSearchQuery('');
    setIsSearchFocused(false);
    setSearchResults([]);
    inputRef.current?.blur();
    
    // Execute the action
    if (result.action) {
      console.log('Executing action for:', result.title);
      try {
        result.action();
      } catch (error) {
        console.error('Error executing action:', error);
        // Fallback to navigation if action fails
        if (result.route) {
          navigate(result.route);
        }
      }
    } else if (result.route) {
      console.log('Navigating to:', result.route);
      navigate(result.route);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    setIsSignOutDialogOpen(true);
  };

  const handleConfirmSignOut = () => {
    logout();
    navigate('/login');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    inputRef.current?.focus();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionRoute) {
      navigate(notification.actionRoute);
      setIsNotificationOpen(false);
      markNotificationAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-soft border-b border-border z-20">
        <div className="flex items-center justify-between h-full px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything or type an action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && (searchQuery || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-medium max-h-96 overflow-y-auto z-50">
                {searchQuery && searchResults.length === 0 ? (
                  <div className="p-4 text-center text-text-muted">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching for actions, users, tournaments, clubs, or pages</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider border-b border-border">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          index === selectedResultIndex ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${
                          index === selectedResultIndex 
                            ? 'bg-primary-600 text-white' 
                            : result.type === 'action'
                            ? 'bg-success-100 text-success-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {result.type === 'action' ? <Zap className="h-4 w-4" /> : result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <div className={`text-xs capitalize px-2 py-1 rounded-full ${
                          result.type === 'action' 
                            ? 'bg-success-100 text-success-700 font-medium'
                            : 'text-text-muted'
                        }`}>
                          {result.type === 'action' ? 'Action' : result.type}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery === '' ? (
                  <div className="p-4">
                    <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
                      Quick Actions
                    </div>
                    <div className="space-y-1">
                      {searchableActions.slice(0, 5).map((action) => (
                        <button
                          key={action.title}
                          onClick={() => handleResultClick({
                            id: `action-${action.title}`,
                            title: action.title,
                            subtitle: action.subtitle,
                            type: 'action',
                            route: '',
                            icon: action.icon,
                            action: action.action
                          })}
                          className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="p-1 rounded mr-3 text-success-600 bg-success-100">
                            <Zap className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-text-primary font-medium">{action.title}</span>
                            <p className="text-xs text-text-muted">{action.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotifications}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-medium border border-border z-20 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Notifications ({unreadCount} unread)
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-text-muted">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-border hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-lg">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-sm font-medium ${
                                    !notification.read ? 'text-text-primary' : 'text-text-secondary'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <div className="flex items-center space-x-1">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                    )}
                                    <button
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-sm text-text-muted mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-text-muted">
                                    {getTimeAgo(notification.timestamp)}
                                  </span>
                                  {notification.actionLabel && notification.actionRoute && (
                                    <button
                                      onClick={() => handleNotificationAction(notification)}
                                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                      {notification.actionLabel}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-200">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.firstName[0]}{user?.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-muted">{user?.role}</p>
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-medium border border-border z-20">
                    {/* User Info Section */}
                    <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-primary-50 to-primary-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-300">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                              <span className="text-white font-bold">
                                {user?.firstName[0]}{user?.lastName[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-text-secondary truncate">
                            {user?.email}
                          </p>
                          <p className="text-xs text-primary-600 font-medium">
                            {user?.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="py-2">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-text-primary hover:bg-gray-50 transition-colors group"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary-600" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-sm text-text-primary hover:bg-danger-50 hover:text-danger-600 transition-colors group"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-gray-400 group-hover:text-danger-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Dialog */}
      <SignOutConfirmDialog
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
        onConfirm={handleConfirmSignOut}
        userName={user ? `${user.firstName} ${user.lastName}` : 'User'}
        userRole={user?.role || 'Admin'}
      />
    </>
  );
}