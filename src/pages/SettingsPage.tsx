import { useState } from 'react';
import { Download, Upload, Globe, Wifi, WifiOff, Loader2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export function SettingsPage() {
  const { t, language, setLanguage, isOnline, lastBackup, setLastBackup, customers, showToast } = useApp();
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const dir = language === 'ur' ? 'rtl' : 'ltr';

  const handleBackup = async () => {
    setBackingUp(true);
    await new Promise(r => setTimeout(r, 1000));
    const json = JSON.stringify(customers, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hisaab-rako-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const now = new Date().toLocaleString();
    setLastBackup(now);
    setBackingUp(false);
    showToast(t('backupSuccess'), 'success');
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setRestoring(true);
      try {
        const text = await file.text();
        JSON.parse(text);
        await new Promise(r => setTimeout(r, 800));
        showToast(t('restoreSuccess'), 'success');
      } catch {
        showToast('Invalid backup file', 'error');
      }
      setRestoring(false);
    };
    input.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8" dir={dir}>
      <div className="bg-primary px-6 pt-10 pb-8">
        <h1 className="text-white text-xl font-bold">{t('settings')}</h1>
      </div>

      <div className="px-4 pt-4 max-w-2xl mx-auto space-y-3">

        {/* Status */}
        <div className="bg-surface rounded-md shadow-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline
              ? <Wifi size={20} className="text-success" />
              : <WifiOff size={20} className="text-danger" />}
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? t('online') : t('offline')}
            </span>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isOnline ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
            {isOnline ? t('online') : t('offline')}
          </span>
        </div>

        {/* Language */}
        <div className="bg-surface rounded-md shadow-card">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-accent" />
              <span className="text-sm font-medium text-gray-700">{t('language')}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[36px]
                  ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-gray-600 hover:bg-blue-50'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[36px]
                  ${language === 'ur' ? 'bg-primary text-white' : 'bg-muted text-gray-600 hover:bg-blue-50'}`}
              >
                اردو
              </button>
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-surface rounded-md shadow-card divide-y divide-muted">
          <button
            onClick={handleBackup}
            disabled={backingUp}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-bg transition-colors disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              {backingUp
                ? <Loader2 size={20} className="text-accent animate-spin" />
                : <Download size={20} className="text-accent" />}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{t('backupData')}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('lastBackup')}: {lastBackup || t('never')}
                </p>
              </div>
            </div>
            {!backingUp && <ChevronRight size={16} className="text-gray-400" />}
          </button>

          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-bg transition-colors disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              {restoring
                ? <Loader2 size={20} className="text-accent animate-spin" />
                : <Upload size={20} className="text-accent" />}
              <p className="text-sm font-medium text-gray-700">{t('restoreData')}</p>
            </div>
            {!restoring && <ChevronRight size={16} className="text-gray-400" />}
          </button>
        </div>

        {/* Logout */}
        <div className="bg-surface rounded-md shadow-card">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-bg transition-colors text-danger"
          >
            <span className="text-sm font-medium">{t('logout')}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
