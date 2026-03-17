'use client';

import React, { createContext, useContext, useState } from 'react';

interface AppState {
  user: { name: string; email: string } | null;
  setUser: (u: AppState['user']) => void;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  authMode: 'signup' | 'login';
  setAuthMode: (m: 'signup' | 'login') => void;
  showSuccess: boolean;
  setShowSuccess: (v: boolean) => void;
  // criteria
  minRent: number;
  setMinRent: (v: number) => void;
  maxRent: number;
  setMaxRent: (v: number) => void;
  beds: string[];
  setBeds: (v: string[]) => void;
  hoods: string[];
  setHoods: (v: string[]) => void;
  pet: string;
  setPet: (v: string) => void;
  amenities: string[];
  setAmenities: (v: string[]) => void;
  alertTimes: string[];
  setAlertTimes: (v: string[]) => void;
  instantAlerts: boolean;
  setInstantAlerts: (v: boolean) => void;
  digest: boolean;
  setDigest: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppState['user']>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [showSuccess, setShowSuccess] = useState(false);

  // criteria defaults
  const [minRent, setMinRent] = useState(3500);
  const [maxRent, setMaxRent] = useState(5500);
  const [beds, setBeds] = useState<string[]>(['2 Bedrooms']);
  const [hoods, setHoods] = useState<string[]>([
    'Pacific Heights',
    'Marina',
    'Cow Hollow',
    'Russian Hill',
  ]);
  const [pet, setPet] = useState('required');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [alertTimes, setAlertTimes] = useState<string[]>([
    '10:00 AM',
    '2:00 PM',
    '6:00 PM',
  ]);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [digest, setDigest] = useState(true);
  const [email, setEmail] = useState('');

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authOpen,
        setAuthOpen,
        authMode,
        setAuthMode,
        showSuccess,
        setShowSuccess,
        minRent,
        setMinRent,
        maxRent,
        setMaxRent,
        beds,
        setBeds,
        hoods,
        setHoods,
        pet,
        setPet,
        amenities,
        setAmenities,
        alertTimes,
        setAlertTimes,
        instantAlerts,
        setInstantAlerts,
        digest,
        setDigest,
        email,
        setEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
