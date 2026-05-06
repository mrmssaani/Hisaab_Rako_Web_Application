import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/Toast';
import { OfflineBanner } from './components/OfflineBanner';
import { BottomNav } from './components/BottomNav';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { AddCustomerPage } from './pages/AddCustomerPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { supabase } from './lib/supabase';
import { Globe } from 'lucide-react';

type Page = 'dashboard' | 'customers' | 'settings';
type View =
  | { type: 'main'; page: Page }
  | { type: 'detail'; customerId: string }
  | { type: 'add' }
  | { type: 'profile' };

function Header() {
  const { language, setLanguage } = useApp();
  const handleLangToggle = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <>
      <div className="relative" role="tablist">
        <button
          onClick={handleLangToggle}
          className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
          aria-label="Change language"
          title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
        >
          <Globe size={20} />
          <span className="text-sm font-semibold">{language === 'en' ? 'EN' : 'UR'}</span>
        </button>
      </div>
    </>
  );
}

function AppShell() {
  const { language } = useApp();
  const [session, setSession] = useState<boolean | null>(null);
  const [view, setView] = useState<View>({ type: 'main', page: 'dashboard' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthPage />;

  const dir = language === 'ur' ? 'rtl' : 'ltr';
  const currentPage = view.type === 'main' ? view.page : (view.type === 'detail' || view.type === 'add' ? 'customers' : 'settings');

  return (
    <div className="min-h-screen bg-bg flex flex-col" dir={dir}>
      <OfflineBanner />

      {/* Header with language toggle and profile button */}
      {view.type === 'main' && (
        <div className="bg-surface border-b border-muted px-4 py-3 flex justify-end items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView({ type: 'profile' })}
              className="px-3 py-2 rounded-md text-sm font-semibold text-primary border border-primary hover:bg-blue-50 transition-colors min-h-[40px] hidden md:inline-block"
            >
              Profile
            </button>
            <Header />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {view.type === 'main' && view.page === 'dashboard' && (
          <DashboardPage
            onAddCustomer={() => setView({ type: 'add' })}
            onSelectCustomer={id => setView({ type: 'detail', customerId: id })}
          />
        )}
        {view.type === 'main' && view.page === 'customers' && (
          <CustomersPage
            onSelectCustomer={id => setView({ type: 'detail', customerId: id })}
            onAddCustomer={() => setView({ type: 'add' })}
          />
        )}
        {view.type === 'main' && view.page === 'settings' && (
          <SettingsPage />
        )}
        {view.type === 'detail' && (
          <CustomerDetailPage
            customerId={view.customerId}
            onBack={() => setView({ type: 'main', page: 'customers' })}
          />
        )}
        {view.type === 'add' && (
          <AddCustomerPage
            onBack={() => setView({ type: 'main', page: 'customers' })}
            onAdded={id => setView({ type: 'detail', customerId: id })}
          />
        )}
        {view.type === 'profile' && (
          <ProfilePage
            onBack={() => setView({ type: 'main', page: 'dashboard' })}
          />
        )}
      </div>

      {view.type === 'main' && (
        <BottomNav
          current={currentPage}
          onNavigate={page => setView({ type: 'main', page })}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
