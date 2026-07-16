
import { Standard, Status, Severity, NCR, CAR, InspectionPlan, InspectionTask, Project } from './types';

export const MOCK_PROJECTS: Project[] = [
  { id: 'P-101', code: 'MT', name: 'Marina Towers', client: 'Emaar Properties', status: Status.IN_PROGRESS, qualityScore: 92, totalNCRs: 14, openCARs: 2, location: 'Dubai Marina', startDate: '2023-06-01' },
  { id: 'P-202', code: 'DB', name: 'Desert Bridge', client: 'RTA Dubai', status: Status.IN_PROGRESS, qualityScore: 88, totalNCRs: 8, openCARs: 1, location: 'Al Khawaneej', startDate: '2023-08-15' },
  { id: 'P-303', code: 'SL', name: 'Skyline Lofts', client: 'DAMAC Properties', status: Status.COMPLETED, qualityScore: 96, totalNCRs: 22, openCARs: 0, location: 'Business Bay', startDate: '2022-01-10' },
  { id: 'P-404', code: 'DM', name: 'Dubai Mall Expansion', client: 'Emaar properties', status: Status.IN_PROGRESS, qualityScore: 74, totalNCRs: 41, openCARs: 5, location: 'Downtown Dubai', startDate: '2024-01-05' }
];

export const MOCK_STANDARDS: Standard[] = [
  { id: 'STD-001', title: 'Quality Manual V2024', version: '2.4', origin: 'Internal', status: Status.ACTIVE, owner: 'John Smith', lastUpdated: '2024-01-15', description: 'Core QMS framework documentation.', project: 'Global QMS' },
  { id: 'STD-002', title: 'ISO 9001:2015 Requirements', version: '1.0', origin: 'Regulatory', status: Status.ACTIVE, owner: 'Sarah Connor', lastUpdated: '2023-11-20', description: 'International standard for QMS.', project: 'Global QMS' },
  { id: 'STD-003', title: 'AISC Fabrication Standards', version: '2024.1', origin: 'Regulatory', status: Status.ACTIVE, owner: 'Mike Ross', lastUpdated: '2024-02-01', description: 'Technical specs for structural aluminium and welding.', project: 'P-202' }
];

export const MOCK_INSPECTION_PLANS: InspectionPlan[] = [
  {
    id: 'ITP-ALU-WND',
    name: 'Window Frame Production Control Plan',
    sector: 'Aluminium Fabrication',
    product: 'Premium Series 400',
    standardId: 'STD-003',
    type: 'In-process',
    status: Status.ACTIVE,
    owner: 'Sarah Connor',
    steps: [
      { id: 'PS1', description: 'Extrusion hardness test', type: 'Functional', criteria: 'Min 12 Webster', frequency: 'Batch Start', responsibleRole: 'Operator' },
      { id: 'PS2', description: 'Dimensional audit (Length)', type: 'Dimensional', criteria: '+/- 0.5mm', frequency: '1 in 50', responsibleRole: 'Quality Inspector' },
      { id: 'PS3', description: 'Miter joint gap inspection', type: 'Visual', criteria: 'Zero light penetration', frequency: '100%', responsibleRole: 'Operator' }
    ],
    project: 'P-101'
  },
  {
    id: 'ITP-STR-WLD',
    name: 'Structural Steel Weld Inspection Plan',
    sector: 'Welding',
    product: 'Custom Trusses',
    standardId: 'STD-003',
    type: 'Final',
    status: Status.ACTIVE,
    // Fix: Owner name was missing quotes
    owner: 'Mike Ross',
    steps: [
      { id: 'WS1', description: 'Visual weld inspection', type: 'Visual', criteria: 'AWS D1.1 Table 6.1', frequency: '100%', responsibleRole: 'CWI' },
      { id: 'WS2', description: 'Ultrasonic testing (UT)', type: 'Functional', criteria: 'No indications > 2mm', frequency: '10% Critical Nodes', responsibleRole: 'NDT Tech' }
    ],
    project: 'P-202'
  }
];

export const MOCK_INSPECTION_TASKS: InspectionTask[] = [
  {
    id: 'INS-ALU-001',
    planId: 'ITP-ALU-WND',
    planName: 'Aluminium Window Fabrication Check',
    sector: 'Aluminium Fabrication',
    lotNumber: 'JOB-2024-X1',
    inspector: 'Alex Quality',
    status: Status.PLANNED,
    scheduledDate: '2024-02-25',
    type: 'Final',
    results: [
      { id: 'S1', description: 'Weld penetration check', type: 'Functional', criteria: 'Full penetration, no porosity' },
      { id: 'S2', description: 'Anodizing color consistency', type: 'Visual', criteria: 'Matches sample B1-99' },
      { id: 'S3', description: 'Frame squaring (Diagonal check)', type: 'Dimensional', criteria: '+/- 1.5mm tolerance' }
    ],
    project: 'P-101'
  },
  {
    id: 'INS-DES-005',
    planId: 'ITP-ARCH',
    planName: 'Architectural Blueprint Review',
    sector: 'Design & Architecture',
    lotNumber: 'PROJ-SKYLINE',
    inspector: 'Sarah Design',
    status: Status.IN_PROGRESS,
    scheduledDate: '2024-02-24',
    type: 'Design Review',
    results: [
      { id: 'S4', description: 'Building Code Part M Compliance', type: 'Regulatory', criteria: 'Accessible threshold details verified', result: Status.PASSED },
      { id: 'S5', description: 'Glass Structural Load Calcs', type: 'Document', criteria: 'PE Stamped calculation attached' }
    ],
    project: 'P-303'
  },
  {
    id: 'INS-SITE-11',
    planId: 'ITP-INSTALL',
    planName: 'Site Installation - Interior Fitout',
    sector: 'Interior Fitout',
    lotNumber: 'SITE-MALL-4',
    inspector: 'Robert Field',
    status: Status.PLANNED,
    scheduledDate: '2024-02-26',
    type: 'Site',
    results: [
      { id: 'S6', description: 'Partition alignment & level', type: 'Dimensional', criteria: 'Max deviation 2mm per 3m' },
      { id: 'S7', description: 'Joint sealant application', type: 'Visual', criteria: 'Smooth finish, no gaps' },
      { id: 'S8', description: 'Site Safety PPE compliance', type: 'Safety', criteria: 'All staff wearing Level 3 PPE' }
    ],
    isThirdParty: true,
    project: 'P-404'
  }
];

export const MOCK_NCRs: NCR[] = [
  { 
    id: 'NCR-2024-001', 
    date: '2024-02-10', 
    source: 'Incoming Inspection', 
    productId: 'ALU-440', 
    severity: Severity.HIGH, 
    status: Status.OPEN, 
    description: 'Incorrect alloy grade delivered by supplier. Expected 6061-T6, received 5052-H32.', 
    quantity: 500, 
    containment: 'Inventory check and quarantine.',
    containmentPlan: [
      { id: 'CT-1', title: 'Identify all affected batches in warehouse', targetDate: '2024-02-10', status: Status.CLOSED },
      { id: 'CT-2', title: 'Physically move units to Quarantine Area B', targetDate: '2024-02-10', status: Status.CLOSED }
    ],
    history: [
      { id: 'H1', timestamp: '2024-02-10 09:15', user: 'Alex Quality', action: 'NCR Created', details: 'Identified during raw material intake.' }
    ],
    project: 'P-101'
  }
];

export const MOCK_CARs: CAR[] = [
  {
    id: 'CAR-2024-001',
    title: 'Supplier Alloy Grade Mismatch',
    ncrId: 'NCR-2024-001',
    status: Status.IN_PROGRESS,
    severity: Severity.HIGH,
    rootCause: 'Supplier training deficit in new grade requirements.',
    actionPlan: [
      { 
        id: 'A1', 
        description: 'Audit supplier intake process', 
        owner: 'Quality Manager', 
        responsibleRole: 'QA Lead',
        startDate: '2024-02-15',
        estimatedCompletionDate: '2024-02-28',
        dueDate: '2024-03-01', 
        status: Status.IN_PROGRESS,
        subTasks: []
      }
    ],
    history: [],
    project: 'P-101'
  }
];