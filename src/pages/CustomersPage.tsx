import { useState, useMemo } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FilterTab } from '../types';
import { CustomerSkeleton } from '../components/Skeleton';

interface Props {
  onSelectCustomer: (id: string) => void;
  onAddCustomer: () => void;
}

export function CustomersPage({ onSelectCustomer, onAddCustomer }: Props) {
  const { customers, loading, t, language } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter(c => {
      const remaining = c.total - c.paid;
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && remaining > 0) ||
        (filter === 'cleared' && remaining <= 0);
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [customers, search, filter]);

  const dir = language === 'ur' ? 'rtl' : 'ltr';
  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('pending') },
    { key: 'cleared', label: t('cleared') },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir={dir}>
      {/* Header */}
      <div className="bg-surface border-b border-muted px-4 pt-6 pb-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-primary mb-3">{t('customers')}</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2.5 bg-bg border border-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={t('searchPlaceholder')}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[36px]
                ${filter === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-muted text-gray-600 hover:bg-blue-50'}`}
              aria-pressed={filter === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 px-4 pt-3 space-y-2 max-w-2xl mx-auto w-full">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <CustomerSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <User size={40} className="mx-auto text-muted mb-3" />
            <p className="text-gray-500 text-sm">{t('noCustomers')}</p>
          </div>
        ) : (
          filtered.map(c => {
            const remaining = c.total - c.paid;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCustomer(c.id)}
                className="w-full bg-surface rounded-md shadow-card px-4 py-4 flex items-center gap-3 hover:shadow-md hover:border-accent/20 border border-transparent transition-all min-h-[72px] text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{c.phone || t('noPhone')}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-base font-bold ${remaining > 0 ? 'text-danger' : 'text-success'}`}
                    aria-label={`${t('remaining')}: Rs. ${remaining}`}>
                    Rs. {Math.abs(remaining).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{t('remaining')}</p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onAddCustomer}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-primary transition-colors z-20"
        aria-label={t('addCustomer')}
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
