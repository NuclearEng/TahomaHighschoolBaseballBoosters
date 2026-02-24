export interface Player {
  number?: string;
  name: string;
  position?: string;
  grade?: string;
  team: 'Varsity' | 'JV Blue' | 'JV Gold';
}

export interface RosterData {
  varsity: Player[];
  jvBlue: Player[];
  jvGold: Player[];
}

export interface UniformItem {
  id?: string;
  playerName?: string;
  jerseyNumber?: string;
  item: string;
  size?: string;
  quantity?: number;
  status: 'checked-out' | 'returned' | 'missing' | 'available';
  notes?: string;
}

export interface UniformInventory {
  items: UniformItem[];
  totalItems: number;
  checkedOut: number;
  returned: number;
  missing: number;
  available: number;
}

export interface VolunteerNeed {
  role: string;
  description?: string;
  team: 'Varsity Gold' | 'JV Blue' | 'JV Gold' | 'C Team';
  filled: boolean;
  volunteerName?: string;
  notes?: string;
}

export interface VolunteerSummary {
  varsityGold: VolunteerNeed[];
  jvBlue: VolunteerNeed[];
  jvGold: VolunteerNeed[];
  cTeam: VolunteerNeed[];
  totalNeeds: number;
  totalFilled: number;
}

export interface Event {
  name: string;
  date?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  category: 'camp' | 'fundraiser' | 'celebration' | 'meeting' | 'other';
  description?: string;
  revenue?: number;
  expenses?: number;
}

export interface BODPosition {
  title: string;
  description?: string;
  currentHolder?: string;
  term?: string;
}
