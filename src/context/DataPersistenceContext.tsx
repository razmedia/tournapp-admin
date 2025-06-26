import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament, League, Club, Organization, Campaign, FAQ } from '../types';

interface DataPersistenceContextType {
  // Tournaments
  tournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  
  // Leagues
  leagues: League[];
  addLeague: (league: League) => void;
  updateLeague: (id: string, league: Partial<League>) => void;
  deleteLeague: (id: string) => void;
  
  // Clubs
  clubs: Club[];
  addClub: (club: Club) => void;
  updateClub: (id: string, club: Partial<Club>) => void;
  deleteClub: (id: string) => void;
  
  // Organizations
  organizations: Organization[];
  addOrganization: (organization: Organization) => void;
  updateOrganization: (id: string, organization: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // FAQs
  faqs: FAQ[];
  addFAQ: (faq: FAQ) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  
  // Clear all data
  clearAllData: () => void;
}

const DataPersistenceContext = createContext<DataPersistenceContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  tournaments: 'tournapp-tournaments',
  leagues: 'tournapp-leagues',
  clubs: 'tournapp-clubs',
  organizations: 'tournapp-organizations',
  campaigns: 'tournapp-campaigns',
  faqs: 'tournapp-faqs',
};

// Default data from mockData
const defaultTournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Summer Open 2025',
    organization: 'Tennis Federation',
    status: 'ongoing',
    startDate: '2025-06-01',
    endDate: '2025-06-15',
    location: 'Mumbai',
    description: 'Annual summer tournament',
    courtSize: 'Full Court',
    ballType: 'Yellow',
    classification: 'Juniors',
    participants: [
      { role: 'Player', name: 'John Doe' },
      { role: 'Coach', name: 'Jane Smith' },
      { role: 'Referee', name: 'Mike Brown' },
    ],
    matches: [{ id: 'm1', status: 'scheduled' }],
  },
  {
    id: 't2',
    name: 'Winter League',
    organization: 'City Club',
    status: 'sign up',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    location: 'Delhi',
    classification: 'Seniors',
  },
];

const defaultLeagues: League[] = [
  {
    id: 'l1',
    name: 'City League 2025',
    organization: 'City Club',
    format: 'Round Robin',
    status: 'ongoing',
    startDate: '2025-06-10',
    endDate: '2025-06-20',
    totalTeamsPlayers: 8,
    classification: 'Juniors',
  },
  {
    id: 'l2',
    name: 'Regional Championship',
    organization: 'Tennis Federation',
    format: 'Single Elimination',
    status: 'setup',
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    totalTeamsPlayers: 16,
    classification: 'Seniors',
  },
];

const defaultClubs: Club[] = [
  {
    id: 'CLUB001',
    name: 'Mumbai Tennis Club',
    contact: 'mumbai@club.com',
    addressStreet: '123 Marine Drive',
    addressCity: 'Mumbai',
    addressCountry: 'India',
    zip: '400001',
    facilitiesIndoor: 2,
    facilitiesOutdoor: 3,
    surface: 'Hard',
    lights: true,
    logo: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    manager: 'u1',
    coachCount: 5,
    playerCount: 25,
  },
  {
    id: 'CLUB002',
    name: 'Delhi Sports Club',
    contact: 'delhi@club.com',
    addressStreet: '456 Connaught Place',
    addressCity: 'Delhi',
    addressCountry: 'India',
    zip: '110001',
    facilitiesIndoor: 1,
    facilitiesOutdoor: 2,
    surface: 'Clay',
    lights: false,
    logo: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
    manager: 'u2',
    coachCount: 3,
    playerCount: 18,
  },
  {
    id: 'CLUB003',
    name: 'Bangalore Elite Club',
    contact: 'bangalore@club.com',
    addressStreet: '789 MG Road',
    addressCity: 'Bangalore',
    addressCountry: 'India',
    zip: '560001',
    facilitiesIndoor: 3,
    facilitiesOutdoor: 4,
    surface: 'Grass',
    lights: true,
    coachCount: 8,
    playerCount: 35,
  },
];

const defaultOrganizations: Organization[] = [
  {
    id: 'o1',
    name: 'Tennis Federation',
    displayName: 'TFI',
    country: 'India',
    manager: 'John Doe',
    status: 'active',
    memberCount: 50,
    city: 'Mumbai',
    address: 'Federation HQ',
    zip: '400001',
    phone: '+919876543210',
    email: 'tfi@org.com',
    website: 'www.tfi.org',
    logo: 'logo1.png',
    classification: 'Juniors',
    linkedClubs: ['c1'],
    linkedUsers: [{ id: 'u1', role: 'admin' }],
  },
  {
    id: 'o2',
    name: 'City Sports',
    displayName: 'CS',
    country: 'USA',
    manager: 'Jane Smith',
    status: 'active',
    memberCount: 30,
    classification: 'Seniors',
  },
];

const defaultCampaigns: Campaign[] = [
  {
    id: 'a1',
    name: 'Summer Promo',
    targetAudience: 'all',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'active',
    clicks: 150,
    impressions: 1000,
    lastUpdated: '2025-06-15',
  },
  {
    id: 'a2',
    name: 'Player Discount',
    targetAudience: 'player',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: 'inactive',
  },
];

const defaultFAQs: FAQ[] = [
  {
    question: 'How to add a user?',
    category: 'admin',
    lastUpdated: '2025-06-10',
    status: 'active',
    answer: 'Navigate to User Management and click Add User button.',
  },
  {
    question: 'What is a league?',
    category: 'general',
    lastUpdated: '2025-06-05',
    status: 'active',
    answer: 'A league is a competition format with multiple teams or players.',
  },
];

export function DataPersistenceProvider({ children }: { children: ReactNode }) {
  // State for all entities
  const [tournaments, setTournaments] = useState<Tournament[]>(defaultTournaments);
  const [leagues, setLeagues] = useState<League[]>(defaultLeagues);
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);
  const [organizations, setOrganizations] = useState<Organization[]>(defaultOrganizations);
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns);
  const [faqs, setFAQs] = useState<FAQ[]>(defaultFAQs);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load tournaments
      const savedTournaments = localStorage.getItem(STORAGE_KEYS.tournaments);
      if (savedTournaments) {
        setTournaments(JSON.parse(savedTournaments));
      }

      // Load leagues
      const savedLeagues = localStorage.getItem(STORAGE_KEYS.leagues);
      if (savedLeagues) {
        setLeagues(JSON.parse(savedLeagues));
      }

      // Load clubs
      const savedClubs = localStorage.getItem(STORAGE_KEYS.clubs);
      if (savedClubs) {
        setClubs(JSON.parse(savedClubs));
      }

      // Load organizations
      const savedOrganizations = localStorage.getItem(STORAGE_KEYS.organizations);
      if (savedOrganizations) {
        setOrganizations(JSON.parse(savedOrganizations));
      }

      // Load campaigns
      const savedCampaigns = localStorage.getItem(STORAGE_KEYS.campaigns);
      if (savedCampaigns) {
        setCampaigns(JSON.parse(savedCampaigns));
      }

      // Load FAQs
      const savedFAQs = localStorage.getItem(STORAGE_KEYS.faqs);
      if (savedFAQs) {
        setFAQs(JSON.parse(savedFAQs));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save functions
  const saveTournaments = (newTournaments: Tournament[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.tournaments, JSON.stringify(newTournaments));
      setTournaments(newTournaments);
    } catch (error) {
      console.error('Error saving tournaments:', error);
    }
  };

  const saveLeagues = (newLeagues: League[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.leagues, JSON.stringify(newLeagues));
      setLeagues(newLeagues);
    } catch (error) {
      console.error('Error saving leagues:', error);
    }
  };

  const saveClubs = (newClubs: Club[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.clubs, JSON.stringify(newClubs));
      setClubs(newClubs);
    } catch (error) {
      console.error('Error saving clubs:', error);
    }
  };

  const saveOrganizations = (newOrganizations: Organization[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.organizations, JSON.stringify(newOrganizations));
      setOrganizations(newOrganizations);
    } catch (error) {
      console.error('Error saving organizations:', error);
    }
  };

  const saveCampaigns = (newCampaigns: Campaign[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.campaigns, JSON.stringify(newCampaigns));
      setCampaigns(newCampaigns);
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  };

  const saveFAQs = (newFAQs: FAQ[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.faqs, JSON.stringify(newFAQs));
      setFAQs(newFAQs);
    } catch (error) {
      console.error('Error saving FAQs:', error);
    }
  };

  // Tournament functions
  const addTournament = (tournament: Tournament) => {
    const newTournaments = [...tournaments, tournament];
    saveTournaments(newTournaments);
  };

  const updateTournament = (id: string, tournamentData: Partial<Tournament>) => {
    const newTournaments = tournaments.map(tournament => 
      tournament.id === id ? { ...tournament, ...tournamentData } : tournament
    );
    saveTournaments(newTournaments);
  };

  const deleteTournament = (id: string) => {
    const newTournaments = tournaments.filter(tournament => tournament.id !== id);
    saveTournaments(newTournaments);
  };

  // League functions
  const addLeague = (league: League) => {
    const newLeagues = [...leagues, league];
    saveLeagues(newLeagues);
  };

  const updateLeague = (id: string, leagueData: Partial<League>) => {
    const newLeagues = leagues.map(league => 
      league.id === id ? { ...league, ...leagueData } : league
    );
    saveLeagues(newLeagues);
  };

  const deleteLeague = (id: string) => {
    const newLeagues = leagues.filter(league => league.id !== id);
    saveLeagues(newLeagues);
  };

  // Club functions
  const addClub = (club: Club) => {
    const newClubs = [...clubs, club];
    saveClubs(newClubs);
  };

  const updateClub = (id: string, clubData: Partial<Club>) => {
    const newClubs = clubs.map(club => 
      club.id === id ? { ...club, ...clubData } : club
    );
    saveClubs(newClubs);
  };

  const deleteClub = (id: string) => {
    const newClubs = clubs.filter(club => club.id !== id);
    saveClubs(newClubs);
  };

  // Organization functions
  const addOrganization = (organization: Organization) => {
    const newOrganizations = [...organizations, organization];
    saveOrganizations(newOrganizations);
  };

  const updateOrganization = (id: string, organizationData: Partial<Organization>) => {
    const newOrganizations = organizations.map(organization => 
      organization.id === id ? { ...organization, ...organizationData } : organization
    );
    saveOrganizations(newOrganizations);
  };

  const deleteOrganization = (id: string) => {
    const newOrganizations = organizations.filter(organization => organization.id !== id);
    saveOrganizations(newOrganizations);
  };

  // Campaign functions
  const addCampaign = (campaign: Campaign) => {
    const newCampaigns = [...campaigns, campaign];
    saveCampaigns(newCampaigns);
  };

  const updateCampaign = (id: string, campaignData: Partial<Campaign>) => {
    const newCampaigns = campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, ...campaignData } : campaign
    );
    saveCampaigns(newCampaigns);
  };

  const deleteCampaign = (id: string) => {
    const newCampaigns = campaigns.filter(campaign => campaign.id !== id);
    saveCampaigns(newCampaigns);
  };

  // FAQ functions
  const addFAQ = (faq: FAQ) => {
    const newFAQs = [...faqs, faq];
    saveFAQs(newFAQs);
  };

  const updateFAQ = (id: string, faqData: Partial<FAQ>) => {
    const newFAQs = faqs.map(faq => 
      faq.question === id ? { ...faq, ...faqData } : faq // Using question as ID for FAQs
    );
    saveFAQs(newFAQs);
  };

  const deleteFAQ = (id: string) => {
    const newFAQs = faqs.filter(faq => faq.question !== id); // Using question as ID for FAQs
    saveFAQs(newFAQs);
  };

  // Clear all data
  const clearAllData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reset to default data
      setTournaments(defaultTournaments);
      setLeagues(defaultLeagues);
      setClubs(defaultClubs);
      setOrganizations(defaultOrganizations);
      setCampaigns(defaultCampaigns);
      setFAQs(defaultFAQs);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const contextValue: DataPersistenceContextType = {
    // Tournaments
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    
    // Leagues
    leagues,
    addLeague,
    updateLeague,
    deleteLeague,
    
    // Clubs
    clubs,
    addClub,
    updateClub,
    deleteClub,
    
    // Organizations
    organizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    
    // Campaigns
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    
    // FAQs
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    
    // Clear all data
    clearAllData,
  };

  return (
    <DataPersistenceContext.Provider value={contextValue}>
      {children}
    </DataPersistenceContext.Provider>
  );
}

export function useDataPersistence() {
  const context = useContext(DataPersistenceContext);
  if (context === undefined) {
    throw new Error('useDataPersistence must be used within a DataPersistenceProvider');
  }
  return context;
}