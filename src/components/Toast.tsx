import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-md shadow-lg text-white text-sm font-medium min-w-[220px] max-w-xs transition-all
            ${toast.type === 'success' ? 'bg-success' : 'bg-danger'}`}
        >
          {toast.type === 'success'
            ? <CheckCircle size={18} className="shrink-0" />
            : <AlertCircle size={18} className="shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="shrink-0 p-1 rounded hover:opacity-75" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
