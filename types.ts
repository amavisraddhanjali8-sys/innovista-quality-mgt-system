
export enum Status {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  OBSOLETE = 'Obsolete',
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed',
  FAILED = 'Failed',
  PASSED = 'Passed',
  PLANNED = 'Planned',
  COMPLETED = 'Completed'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export type BusinessSector = 
  | 'Construction' 
  | 'Aluminium Fabrication' 
  | 'Welding' 
  | 'Interior Fitout' 
  | 'Glass & Glazing' 
  | 'Design & Architecture' 
  | 'Import & Logistics' 
  | 'Branding & Development';

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  status: Status;
  qualityScore: number;
  totalNCRs: number;
  openCARs: number;
  location: string;
  startDate: string;
}

export interface Standard {
  id: string;
  title: string;
  version: string;
  origin: 'Internal' | 'Customer' | 'Regulatory';
  status: Status;
  owner: string;
  lastUpdated: string;
  description: string;
  project?: string; 
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

export interface InspectionStep {
  id: string;
  description: string;
  category?: string; 
  type: 'Visual' | 'Dimensional' | 'Functional' | 'Document' | 'Safety' | 'Regulatory';
  criteria: string;
  frequency?: string;
  responsibleRole?: string;
  minValue?: number;
  maxValue?: number;
  isMandatoryEvidence?: boolean;
  isMandatoryMeasurement?: boolean;
  result?: Status.PASSED | Status.FAILED;
  measurement?: string;
  unit?: string;
  comment?: string;
  evidence?: string;
}

export interface InspectionPlan {
  id: string;
  name: string;
  sector: BusinessSector;
  product: string;
  standardId: string;
  type: 'Incoming' | 'In-process' | 'Final' | 'Site' | 'Design Review';
  status: Status;
  owner: string;
  steps: InspectionStep[];
  project?: string; 
}

export interface InspectionTask {
  id: string;
  planId: string;
  planName: string;
  sector: BusinessSector;
  lotNumber: string; 
  inspector: string;
  status: Status;
  scheduledDate: string;
  completedDate?: string;
  type: string;
  results: InspectionStep[];
  isThirdParty?: boolean;
  project: string; 
}

export interface SubTask {
  id: string;
  title: string;
  targetDate: string;
  status: Status;
}

export interface NCR {
  id: string;
  date: string;
  source: string;
  productId: string;
  severity: Severity;
  status: Status;
  description: string;
  quantity: number;
  containment: string;
  containmentPlan: SubTask[];
  disposition?: 'Rework' | 'Scrap' | 'Use As-Is' | 'Return';
  dispositionDetails?: string;
  dispositionApproved?: boolean;
  linkedCARId?: string;
  history: AuditEntry[];
  project: string; 
}

export interface ActionItem {
  id: string;
  description: string;
  detailedDescription?: string;
  owner: string;
  responsibleRole: string;
  startDate: string;
  estimatedCompletionDate: string;
  dueDate: string;
  status: Status;
  subTasks: SubTask[];
}

export interface EffectivenessMetrics {
  expectedAccuracy: number;
  actualAccuracy: number;
  expectedControlLevel: string;
  actualControlLevel: string;
  varianceAnalysis: string;
}

export interface CAR {
  id: string;
  title: string;
  ncrId: string;
  status: Status;
  severity: Severity;
  rootCause?: string;
  rcaFinalized?: boolean;
  actionPlan: ActionItem[];
  effectivenessReview?: string;
  effectivenessMetrics?: EffectivenessMetrics;
  closedDate?: string;
  history: AuditEntry[];
  project: string; 
}
