export interface AgendaItem {
  topic: string;
  presenter?: string;
  duration?: string;
  notes?: string;
}

export interface BoardAgenda {
  date: string;
  title: string;
  items: AgendaItem[];
  htmlContent: string;
}

export interface MeetingMinutes {
  date: string;
  title: string;
  fileName: string;
  htmlContent: string;
  year: number;
}

export interface BylawsData {
  htmlContent: string;
  lastUpdated: string;
  fileName: string;
}

export interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  category: 'irs' | 'state' | 'insurance' | 'financial' | 'governance';
  status: 'compliant' | 'pending' | 'overdue' | 'not-applicable';
  lastCompleted?: string;
  nextDue?: string;
  documentOnFile?: string;
  notes?: string;
}

export interface ComplianceData {
  items: ComplianceItem[];
  overallScore: number;
  totalItems: number;
  compliantCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface AgendaSuggestion {
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: 'financial' | 'compliance' | 'operations' | 'fundraising';
  dataSource: string;
}

export interface Sponsor {
  name: string;
  url?: string;
  logo?: string;
}

export interface ProgramInfo {
  schoolName: string;
  mascot: string;
  address: string;
  email: string;
  website: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  sponsors: Sponsor[];
}
