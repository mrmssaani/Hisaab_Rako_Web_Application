import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Trash2, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

interface Props {
  customerId: string;
  onBack: () => void;
}

export function CustomerDetailPage({ customerId, onBack }: Props) {
  const { customers, updateCustomer, deleteCustomer, showToast, t, language } = useApp();
  const customer = customers.find(c => c.id === customerId);

  const [_lang] = useState<Language>(language);
  const [total, setTotal] = useState('');
  const [paid, setPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (customer) {
      setTotal(String(customer.total));
      setPaid(String(customer.paid));
      setNotes(customer.notes);
    }
  }, [customer]);

  const remaining = useMemo(() => {
    const t = parseFloat(total) || 0;
    const p = parseFloat(paid) || 0;
    return t - p;
  }, [total, paid]);

  const paidNum = parseFloat(paid) || 0;
  const totalNum = parseFloat(total) || 0;
  const paidError = paidNum > totalNum && totalNum >= 0 ? t('paidExceedsTotal') : '';
  const canSave = !paidError && totalNum >= 0 && paidNum >= 0;

  const dir = language === 'ur' ? 'rtl' : 'ltr';

  const handleSave = async () => {
    if (!canSave || !customer) return;
    setSaving(true);
    const ok = await updateCustomer(customer.id, {
      total: totalNum,
      paid: paidNum,
      notes,
    });
    setSaving(false);
    if (ok) showToast(t('saved'), 'success');
    else showToast('Save failed', 'error');
  };

  const handleDelete = async () => {
    if (!customer) return;
    const ok = await deleteCustomer(customer.id);
    if (ok) { showToast(t('customerDeleted'), 'success'); onBack(); }
    else showToast('Delete failed', 'error');
  };

  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">{t('noCustomers')}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir={dir}>
      {/* Header */}
      <div className="bg-primary px-4 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm min-h-[44px] min-w-[44px]"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReminder(true)}
              className="text-white/80 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('sendReminder')}
            >
              <Send size={18} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-white/80 hover:text-danger min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('deleteCustomer')}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold text-xl">{customer.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-white font-bold text-lg">{customer.name}</h1>
          {customer.phone && <p className="text-blue-200 text-sm">{customer.phone}</p>}
        </div>
      </div>

      {/* Remaining prominent */}
      <div className="bg-surface border-b border-muted px-4 py-4 text-center" aria-live="polite">
        <p className="text-xs text-gray-500 font-medium mb-1">{t('remaining')}</p>
        <p className={`text-[40px] md:text-[48px] font-extrabold leading-none ${remaining > 0 ? 'text-danger' : 'text-success'}`}>
          Rs. {Math.abs(remaining).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 pt-5 space-y-4 max-w-lg mx-auto w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalAmount')}</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={total}
            onChange={e => setTotal(e.target.value)}
            className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('amountPaid')}</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={paid}
            onChange={e => setPaid(e.target.value)}
            className={`w-full border rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent
              ${paidError ? 'border-danger focus:ring-danger' : 'border-muted'}`}
          />
          {paidError && (
            <p className="text-danger text-xs mt-1 font-medium" role="alert" aria-live="assertive">{paidError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('remaining')}</label>
          <div className={`w-full border border-muted rounded-md px-3 py-3 text-base font-bold bg-bg
            ${remaining > 0 ? 'text-danger' : 'text-success'}`}>
            Rs. {remaining.toLocaleString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder={t('addNote')}
            className="w-full border border-muted rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted px-4 py-3 flex gap-3 md:relative md:border-0 md:px-0 z-20">
        <button
          onClick={onBack}
          className="flex-1 border border-muted text-gray-700 font-semibold rounded-md py-3 text-base hover:bg-bg transition-colors min-h-[48px]"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="flex-1 bg-primary text-white font-semibold rounded-md py-3 text-base hover:bg-accent transition-colors disabled:opacity-60 min-h-[48px] flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? t('saving') : t('save')}
        </button>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-md shadow-lg p-6 w-full max-w-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-2">{t('deleteCustomer')}</h2>
            <p className="text-gray-500 text-sm mb-6">{t('confirmDelete')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-muted rounded-md py-3 text-sm font-semibold text-gray-700 hover:bg-bg"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-danger text-white rounded-md py-3 text-sm font-semibold hover:opacity-90"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminder && (
        <ReminderModal
          customerName={customer.name}
          remaining={remaining}
          lang={language}
          onClose={() => setShowReminder(false)}
          onSent={() => { setShowReminder(false); showToast(t('reminderSent'), 'success'); }}
        />
      )}
    </div>
  );
}

function ReminderModal({
  customerName, remaining, lang, onClose, onSent,
}: {
  customerName: string;
  remaining: number;
  lang: Language;
  onClose: () => void;
  onSent: () => void;
}) {
  const { t } = useApp();
  const defaultTemplate = lang === 'ur'
    ? 'آپ کی واجب الادا رقم Rs. {amount} ہے'
    : 'You have an outstanding balance of Rs. {amount}';
  const [template, setTemplate] = useState(defaultTemplate);
  const preview = template
    .replace('{name}', customerName)
    .replace('{amount}', Math.abs(remaining).toLocaleString());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-md shadow-lg p-6 w-full max-w-sm space-y-4">
        <h2 className="font-bold text-gray-800 text-base">{t('sendReminder')}</h2>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">{t('messageTemplate')}</label>
          <textarea
            rows={3}
            value={template}
            onChange={e => setTemplate(e.target.value)}
            className="w-full border border-muted rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            dir={lang === 'ur' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="bg-bg rounded-md p-3">
          <p className="text-xs text-gray-500 mb-1 font-medium">{t('reminderPreview')}</p>
          <p className="text-sm text-gray-700" dir={lang === 'ur' ? 'rtl' : 'ltr'}>{preview}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-muted rounded-md py-3 text-sm font-semibold text-gray-700 hover:bg-bg"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onSent}
            className="flex-1 bg-primary text-white rounded-md py-3 text-sm font-semibold hover:bg-accent transition-colors"
          >
            {t('sendReminder')}
          </button>
        </div>
      </div>
    </div>
  );
}
