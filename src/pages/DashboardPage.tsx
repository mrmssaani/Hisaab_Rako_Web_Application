import { useMemo } from 'react';
import { Plus, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardSkeleton } from '../components/Skeleton';

interface Props {
  onAddCustomer: () => void;
  onSelectCustomer: (id: string) => void;
}

export function DashboardPage({ onAddCustomer, onSelectCustomer }: Props) {
  const { customers, loading, t, language } = useApp();

  const stats = useMemo(() => {
    const totalReceivable = customers.reduce((sum, c) => sum + Math.max(0, c.total - c.paid), 0);
    const pending = customers.filter(c => c.total - c.paid > 0).length;
    const cleared = customers.filter(c => c.total - c.paid <= 0).length;
    const topCustomers = [...customers]
      .filter(c => c.total - c.paid > 0)
      .sort((a, b) => (b.total - b.paid) - (a.total - a.paid))
      .slice(0, 3);
    const maxRemaining = topCustomers[0] ? topCustomers[0].total - topCustomers[0].paid : 1;
    return { totalReceivable, pending, cleared, topCustomers, maxRemaining };
  }, [customers]);

  const dir = language === 'ur' ? 'rtl' : 'ltr';

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8" dir={dir}>
      <div className="bg-primary px-6 pt-10 pb-16">
        <h1 className="text-white text-xl font-bold mb-1">{t('appName')}</h1>
        <p className="text-blue-200 text-sm">{t('dashboard')}</p>
      </div>

      <div className="px-4 -mt-10 space-y-4 max-w-2xl mx-auto">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Total Receivable Card */}
            <div className="bg-surface rounded-md shadow-card p-6" aria-live="polite">
              <p className="text-sm text-gray-500 font-medium mb-1">{t('totalReceivable')}</p>
              <p className="text-[44px] md:text-[56px] font-extrabold text-primary leading-none">
                Rs. {stats.totalReceivable.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-md shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} className="text-danger" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-danger">{stats.pending}</p>
                  <p className="text-xs text-gray-500 font-medium">{t('pending')}</p>
                </div>
              </div>
              <div className="bg-surface rounded-md shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-success">{stats.cleared}</p>
                  <p className="text-xs text-gray-500 font-medium">{t('cleared')}</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            {stats.topCustomers.length > 0 && (
              <div className="bg-surface rounded-md shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-accent" />
                  <h2 className="font-semibold text-gray-800 text-sm">{t('insights')}</h2>
                </div>
                <div className="space-y-3">
                  {stats.topCustomers.map(c => {
                    const rem = c.total - c.paid;
                    const pct = stats.maxRemaining > 0 ? (rem / stats.maxRemaining) * 100 : 0;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectCustomer(c.id)}
                        className="w-full text-left group"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate max-w-[160px]">{c.name}</span>
                          <span className="text-sm font-bold text-danger">Rs. {rem.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-danger rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {customers.length === 0 && (
              <div className="bg-surface rounded-md shadow-card p-8 text-center">
                <Users size={40} className="mx-auto text-muted mb-3" />
                <p className="text-gray-500 text-sm">{t('noCustomers')}</p>
              </div>
            )}
          </>
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
