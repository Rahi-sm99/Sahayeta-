import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'admin' | 'volunteer' | 'public';

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  is_approved: boolean;
}

interface AppState {
  simulationRunning: boolean;
  selectedTaskId: string | null;
  crisisMode: boolean;
  user: UserProfile | null;
  loading: boolean;
}

type Action =
  | { type: 'TOGGLE_SIMULATION' }
  | { type: 'SET_SELECTED_TASK'; payload: string | null }
  | { type: 'SET_CRISIS_MODE'; payload: boolean }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  simulationRunning: false,
  selectedTaskId: null,
  crisisMode: false,
  user: null,
  loading: true,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_SIMULATION':
      return { ...state, simulationRunning: !state.simulationRunning };
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTaskId: action.payload };
    case 'SET_CRISIS_MODE':
      return { ...state, crisisMode: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      dispatch({ type: 'SET_USER', payload: data });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
