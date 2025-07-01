export interface User {
  id: string;
  email: string;
  role: string;
  roles?: string[]; // New: array of all roles a user has
  firstName: string;
  lastName: string;
  status: string;
  lastLogin: string;
  gender?: string;
  dob?: string;
  phone1?: string;
  phone2?: string;
  country?: string;
  classification?: string;
  organizations?: string[];
  clubs?: string[];
  profilePicture?: string;
  password?: string; // Add password field for authentication
  // Coach-specific fields
  yearOfExperience?: number;
  licenseCertificate?: string;
  associatedPlayers?: string[];
  // Referee-specific fields
  certification?: boolean;
  certificationDocument?: string;
  // Player-specific fields
  height?: string;
  weight?: string;
  dominantHand?: 'Left' | 'Right';
  healthCertificate?: string;
  coach?: string;
  rank?: number;
  points?: number;
  tournamentHistory?: TournamentHistory[];
  playerHistory?: PlayerActivity[];
}

export interface TournamentHistory {
  id: string;
  name: string;
  date: string;
  result: string;
  points: number;
}

export interface PlayerActivity {
  id: string;
  type: 'match' | 'training' | 'tournament' | 'ranking';
  description: string;
  date: string;
  details?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export interface Tournament {
  id: string;
  name: string;
  organization: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  courtSize?: string;
  ballType?: string;
  classification?: string;
  participants?: Participant[];
  matches?: Match[];
}

export interface League {
  id: string;
  name: string;
  organization: string;
  format: string;
  status: string;
  startDate: string;
  endDate: string;
  totalTeamsPlayers: number;
  category?: string;
  ageGroup?: string;
  gender?: string;
  matchType?: string;
  classification?: string;
}

export interface Club {
  id: string;
  name: string;
  contact: string;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  zip: string;
  facilitiesIndoor: number;
  facilitiesOutdoor: number;
  surface: string;
  lights: boolean;
  logo?: string;
  manager?: string; // User ID if assigned
  coachCount?: number;
  playerCount?: number;
}

export interface Organization {
  id: string;
  name: string;
  displayName: string;
  country: string;
  manager: string;
  status: string;
  memberCount: number;
  city?: string;
  address?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  classification?: string;
  linkedClubs?: string[];
  linkedUsers?: { id: string; role: string }[];
}

export interface Participant {
  role: string;
  name: string;
}

export interface Match {
  id: string;
  status: string;
  leagueName?: string;
  teamsPlayers?: string;
  dateTime?: string;
  score?: string;
  tournamentName?: string;
  publicationDate?: string;
}

export interface Stat {
  label: string;
  value: number | string;
}

export interface ChartData {
  labels: (string | number)[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface FAQ {
  question: string;
  category: string;
  lastUpdated: string;
  status: string;
  answer?: string;
}

export interface Campaign {
  id: string;
  name: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  status: string;
  clicks?: number;
  impressions?: number;
  lastUpdated?: string;
}