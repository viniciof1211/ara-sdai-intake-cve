export type CloudStrategy = 'Azure' | 'GCP' | 'Multicloud';
export type ComputeTier = 'Small' | 'Standard' | 'Large';
export type IntakeStatus = 'draft' | 'submitted' | 'provisioning' | 'active' | 'archived';
export type UserRole = 'Admin' | 'Architect' | 'Viewer';

export interface DataSource {
  source: string;
  type: string;
  frequency: string;
  owner: string;
  quality: string;
}

export interface OntologyObject {
  object: string;
  source_system: string;
  volume: string;
  frequency: string;
  notes: string;
}

export interface OntologyLink {
  from_object: string;
  relationship: string;
  to_object: string;
}

export interface OntologyAction {
  action_name: string;
  object: string;
  trigger: string;
  output: string;
}

export interface PermissionMatrix {
  role: string;
  object: string;
  read: boolean;
  write: boolean;
  approve: boolean;
}

export interface IntakePayload {
  client_project: string;
  industry: string;
  business_unit: string;
  sponsor_exec: string;
  tech_contact: string;
  stakeholders: string[];
  processes_in_scope: string[];
  pain_bottlenecks: string;
  pain_rework: string;
  pain_info_gaps: string;
  pain_errors: string;
  kpis_impacted: string[];
  systems: string[];
  data_sources: DataSource[];
  ontology_objects: OntologyObject[];
  ontology_links: OntologyLink[];
  ontology_actions: OntologyAction[];
  permissions_matrix: PermissionMatrix[];
  agents_requested: string[];
  mvp_scope: string[];
  cloud_strategy: CloudStrategy;
  compute_tier: ComputeTier;
  region: string;
  go_live_date: string;
  notes: string;
  risks: string;
}

export const emptyIntakePayload: IntakePayload = {
  client_project: '',
  industry: '',
  business_unit: '',
  sponsor_exec: '',
  tech_contact: '',
  stakeholders: [],
  processes_in_scope: [],
  pain_bottlenecks: '',
  pain_rework: '',
  pain_info_gaps: '',
  pain_errors: '',
  kpis_impacted: [],
  systems: [],
  data_sources: [],
  ontology_objects: [],
  ontology_links: [],
  ontology_actions: [],
  permissions_matrix: [],
  agents_requested: [],
  mvp_scope: [],
  cloud_strategy: 'GCP',
  compute_tier: 'Standard',
  region: 'us-central1',
  go_live_date: '',
  notes: '',
  risks: '',
};
