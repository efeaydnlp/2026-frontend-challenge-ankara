export type RecordType = "checkin" | "message" | "sighting" | "note" | "tip";

export type Person = {
  id: string;
  name: string;
  note: string;
  riskLevel: "low" | "medium" | "high";
  lastSeen?: string;
};

export type TimelineRecord = {
  id: string;
  type: RecordType;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  personIds: string[];
};

export type InvestigationSummary = {
  mostSuspicious: string;
  lastSeenWith: string;
};

export type UnifiedRecord = {
  id: string;
  type: RecordType;
  title: string;
  content: string;
  timestamp?: string;
  location?: string;
  coordinates?: string;
  personNames: string[];
  urgency?: string;
  raw: unknown;
};

export type DashboardPerson = {
  id: string;
  name: string;
  note: string;
  riskLevel: "low" | "medium" | "high";
  lastSeen?: string;
};