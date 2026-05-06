import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Customer, UserProfile, Toast, Language } from '../types';
import { strings } from '../lib/i18n';

interface AppContextValue {
  customers: Customer[];
  profile: UserProfile | null;
  loading: boolean;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof strings.en) => string;
  isOnline: boolean;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  dismissToast: (id: string) => void;
  addCustomer: (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'last_updated'>) => Promise<Customer | null>;
  updateCustomer: (id: string, data: Partial<Pick<Customer, 'name' | 'phone' | 'total' | 'paid' | 'notes'>>) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  refreshCustomers: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  lastBackup: string | null;
  setLastBackup: (dt: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastBackup, setLastBackupState] = useState<string | null>(() => localStorage.getItem('lastBackup'));

  const t = useCallback((key: keyof typeof strings.en) => strings[language][key] as string, [language]);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('lang', l);
  };

  const setLastBackup = (dt: string) => {
    setLastBackupState(dt);
    localStorage.setItem('lastBackup', dt);
  };

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchCustomers = useCallback(async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_updated', { ascending: false });
    if (!error && data) setCustomers(data as Customer[]);
  }, []);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as UserProfile);
    } else {
      const newProfile = {
        business_name: '',
        business_type: '',
        business_phone: '',
        business_address: '',
        personal_name: '',
        personal_email: user.email || '',
        personal_phone: '',
        personal_cnic: '',
        notes: '',
      };
      const { data: created } = await supabase
        .from('user_profiles')
        .insert([{ ...newProfile, user_id: user.id }])
        .select()
        .maybeSingle();
      if (created) setProfile(created as UserProfile);
    }
  }, []);

  const refreshCustomers = useCallback(async () => {
    await fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await Promise.all([fetchCustomers(), fetchProfile()]);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setCustomers([]);
        setProfile(null);
        setLoading(false);
      }
    });
    Promise.all([fetchCustomers(), fetchProfile()]).then(() => setLoading(false));
    return () => subscription.unsubscribe();
  }, [fetchCustomers, fetchProfile]);

  const addCustomer = useCallback(async (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'last_updated'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: row, error } = await supabase
      .from('customers')
      .insert({ ...data, user_id: user.id, last_updated: new Date().toISOString() })
      .select()
      .maybeSingle();
    if (error || !row) return null;
    setCustomers(prev => [row as Customer, ...prev]);
    return row as Customer;
  }, []);

  const updateCustomer = useCallback(async (id: string, data: Partial<Pick<Customer, 'name' | 'phone' | 'total' | 'paid' | 'notes'>>) => {
    const { error } = await supabase
      .from('customers')
      .update({ ...data, last_updated: new Date().toISOString() })
      .eq('id', id);
    if (error) return false;
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data, last_updated: new Date().toISOString() } : c));
    return true;
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) return false;
    setCustomers(prev => prev.filter(c => c.id !== id));
    return true;
  }, []);

  const updateProfile = useCallback(async (data: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    if (error) return false;
    setProfile(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
    return true;
  }, []);

  return (
    <AppContext.Provider value={{
      customers, profile, loading, language, setLanguage, t, isOnline,
      toasts, showToast, dismissToast,
      addCustomer, updateCustomer, deleteCustomer, refreshCustomers,
      fetchProfile, updateProfile,
      lastBackup, setLastBackup,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
