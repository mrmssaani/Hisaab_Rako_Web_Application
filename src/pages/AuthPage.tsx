import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { BookOpen } from 'lucide-react';

export function AuthPage() {
  const { t } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.includes('@')) return t('invalidEmail');
    if (password.length < 6) return t('passwordTooShort');
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    const { error: authErr } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authErr) setError(t('authError'));
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface rounded-md shadow-card w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4 shadow-md">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">{t('appName')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-muted rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-muted rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {error && (
            <p className="text-danger text-sm font-medium" role="alert" aria-live="assertive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-md py-3 text-base hover:bg-accent transition-colors disabled:opacity-60 min-h-[48px]"
          >
            {loading ? (mode === 'login' ? t('loggingIn') : t('registering')) : (mode === 'login' ? t('login') : t('register'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-accent text-sm font-medium hover:underline"
          >
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </div>
      </div>
    </div>
  );
}
