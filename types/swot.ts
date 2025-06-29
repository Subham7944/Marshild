export interface SWOTItem {
  title: string;
  description: string;
}

export interface SWOTAnalysis {
  id: string;
  timestamp: number;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface SWOTFormData {
  industry: string;
  location: string;
  audience: string;
  description?: string;
}
