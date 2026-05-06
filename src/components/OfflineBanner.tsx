import { WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function OfflineBanner() {
  const { isOnline, t } = useApp();
  if (isOnline) return null;
  return (
    <div className="bg-amber-500 text-white text-sm font-medium px-4 py-2 flex items-center gap-2" role="status">
      <WifiOff size={16} className="shrink-0" />
      <span>{t('offlineBanner')}</span>
    </div>
  );
}
