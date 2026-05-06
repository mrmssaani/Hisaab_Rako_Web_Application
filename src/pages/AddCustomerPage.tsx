import { useState, useMemo, FormEvent } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onBack: () => void;
  onAdded: (id: string) => void;
}

export function AddCustomerPage({ onBack, onAdded }: Props) {
  const { addCustomer, showToast, t, language } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [total, setTotal] = useState('');
  const [paid, setPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const totalNum = parseFloat(total) || 0;
  const paidNum = parseFloat(paid) || 0;
  const remaining = useMemo(() => totalNum - paidNum, [totalNum, paidNum]);

  const nameError = touched.name && !name.trim() ? t('nameRequired') : '';
  const paidError = paidNum > totalNum && totalNum >= 0 ? t('paidExceedsTotal') : '';
  const canSave = name.trim() && !paidError && totalNum >= 0 && paidNum >= 0;

  const dir = language === 'ur' ? 'rtl' : 'ltr';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, total: true, paid: true });
    if (!canSave) return;
    setSaving(true);
    const customer = await addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      total: totalNum,
      paid: paidNum,
      notes: notes.trim(),
    });
    setSaving(false);
    if (customer) {
      showToast(t('saved'), 'success');
      onAdded(customer.id);
    } else {
      showToast('Failed to add customer', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" dir={dir}>
      {/* Header */}
      <div className="bg-primary px-4 pt-5 pb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white min-h-[44px] min-w-[44px] flex items-center"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">{t('addCustomer')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden" noValidate>
        <div className="flex-1 overflow-y-auto pb-28 px-4 pt-5 space-y-4 max-w-lg mx-auto w-full">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('name')} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(p => ({ ...p, name: true }))}
              className={`w-full border rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent
                ${nameError ? 'border-danger focus:ring-danger' : 'border-muted'}`}
              placeholder={t('name')}
              autoFocus
            />
            {nameError && (
              <p className="text-danger text-xs mt-1 font-medium" role="alert">{nameError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="03xx-xxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalAmount')}</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={total}
              onChange={e => setTotal(e.target.value)}
              className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="0"
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
              placeholder="0"
            />
            {paidError && (
              <p className="text-danger text-xs mt-1 font-medium" role="alert" aria-live="assertive">{paidError}</p>
            )}
          </div>

          {/* Remaining preview */}
          <div className="bg-bg rounded-md px-4 py-3 flex justify-between items-center border border-muted">
            <span className="text-sm font-medium text-gray-600">{t('remaining')}</span>
            <span className={`text-xl font-extrabold ${remaining > 0 ? 'text-danger' : 'text-success'}`} aria-live="polite">
              Rs. {remaining.toLocaleString()}
            </span>
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

        {/* Sticky Save */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted px-4 py-3 flex gap-3 md:relative md:border-0 md:px-0 z-20">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-muted text-gray-700 font-semibold rounded-md py-3 text-base hover:bg-bg transition-colors min-h-[48px]"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="flex-1 bg-primary text-white font-semibold rounded-md py-3 text-base hover:bg-accent transition-colors disabled:opacity-60 min-h-[48px] flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
