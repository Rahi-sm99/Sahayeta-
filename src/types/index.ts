export interface Volunteer {
  id?:               string;
  volunteer_id:      string;
  name:              string;
  email?:            string;
  age?:              number;
  gender?:           'Male' | 'Female' | 'Other';
  skills:            string[];
  availability?:     string;
  availability_days?: string[];
  location?:         string;
  organization_type?: string;
  experience_years:  number;
  bio?:              string;
  latitude:          number;
  longitude:         number;
  status:            string;
  assigned_task_id?:  string | null;
  last_updated?:      string;
  phone?:            string;
}

export interface Task {
  id?:                   string;
  task_id:               string;
  ngo_name:              string;
  requirements?:         string;
  description?:          string;
  required_skills:       string[];
  required_days:         string[];
  location:              string;
  organization_type?:     string;
  priority:              'Low' | 'Medium' | 'High' | 'Critical';
  status:                'open' | 'assigned' | 'in_progress' | 'resolved';
  severity_score:        number;
  assigned_volunteer_id?: string | null;
  latitude:              number;
  longitude:             number;
  created_at?:            string;
  last_updated?:          string;
}

export interface MatchResult {
  volunteer:         Volunteer;
  score:             number;
  skillScore:        number;
  distanceScore:     number;
  availabilityScore: number;
  distanceKm:        number;
  matchedSkills:     string[];
}

export interface CrisisEvent {
  icon:        string;
  title:       string;
  description: string;
  time:        string;
  color:       string;
}
