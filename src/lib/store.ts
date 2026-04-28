import type { Task, Volunteer } from '../types';

class LocalStore {
  tasks: Task[] = [];
  volunteers: Volunteer[] = [];
  listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  loading = false;
  loaded = false;

  // No longer loading from local files as we use Supabase
  async loadData() {
    this.loaded = true;
    this.notify();
  }

  updateVolunteerStatus(volId: string, status: Volunteer['status']) {
    // This now happens in Supabase via the Landing component
  }

  simulateTick() {
    // Simulation logic moved to real-time updates from Supabase
  }

  appointVolunteer(taskId: string, volId: string) {
    // Handled in Landing.tsx via Supabase
  }

  pushCrisisTasks(type: 'flood' | 'outbreak' | 'famine', location: string) {
    // Can be implemented to push to Supabase if needed
  }
}

export const localStore = new LocalStore();
