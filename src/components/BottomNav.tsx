import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Page = 'dashboard' | 'customers' | 'settings';

interface Props {
  current: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ current, onNavigate }: Props) {
  const { t } = useApp();

  const items: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: 'dashboard', icon: <LayoutDashboard size={22} />, label: t('dashboard') },
    { page: 'customers', icon: <Users size={22} />, label: t('customers') },
    { page: 'settings', icon: <Settings size={22} />, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted flex md:hidden z-30" aria-label="Main navigation">
      {items.map(({ page, icon, label }) => (
        <button
          key={page}
          onClick={() => onNavigate(page)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors min-h-[56px]
            ${current === page ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          aria-current={current === page ? 'page' : undefined}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
