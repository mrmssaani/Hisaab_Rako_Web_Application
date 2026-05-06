import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onBack: () => void;
}

export function ProfilePage({ onBack }: Props) {
  const { profile, t, updateProfile, language, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'personal'>('business');

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [personalName, setPersonalName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [personalCNIC, setPersonalCNIC] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.business_name);
      setBusinessType(profile.business_type);
      setBusinessPhone(profile.business_phone);
      setBusinessAddress(profile.business_address);
      setPersonalName(profile.personal_name);
      setPersonalEmail(profile.personal_email);
      setPersonalPhone(profile.personal_phone);
      setPersonalCNIC(profile.personal_cnic);
      setNotes(profile.notes);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await updateProfile({
      business_name: businessName,
      business_type: businessType,
      business_phone: businessPhone,
      business_address: businessAddress,
      personal_name: personalName,
      personal_email: personalEmail,
      personal_phone: personalPhone,
      personal_cnic: personalCNIC,
      notes,
    });
    setSaving(false);
    if (ok) {
      showToast(t('profileUpdated'), 'success');
      onBack();
    } else {
      showToast('Failed to save profile', 'error');
    }
  };

  const dir = language === 'ur' ? 'rtl' : 'ltr';

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
        <h1 className="text-white font-bold text-lg">{t('profile')}</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-muted bg-surface sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors min-h-[48px]
            ${activeTab === 'business'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700'}`}
        >
          {t('businessDetails')}
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors min-h-[48px]
            ${activeTab === 'personal'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700'}`}
        >
          {t('personalDetails')}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 pt-5 space-y-4 max-w-lg mx-auto w-full">
        {activeTab === 'business' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessName')}</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('businessName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessType')}</label>
              <input
                type="text"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('businessType')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessPhone')}</label>
              <input
                type="tel"
                inputMode="tel"
                value={businessPhone}
                onChange={e => setBusinessPhone(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="03xx-xxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('businessAddress')}</label>
              <textarea
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                rows={3}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder={t('businessAddress')}
              />
            </div>
          </>
        )}

        {activeTab === 'personal' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('personalName')}</label>
              <input
                type="text"
                value={personalName}
                onChange={e => setPersonalName(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('personalName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('personalEmail')}</label>
              <input
                type="email"
                value={personalEmail}
                onChange={e => setPersonalEmail(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t('personalEmail')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('personalPhone')}</label>
              <input
                type="tel"
                inputMode="tel"
                value={personalPhone}
                onChange={e => setPersonalPhone(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="03xx-xxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('personalCNIC')}</label>
              <input
                type="text"
                value={personalCNIC}
                onChange={e => setPersonalCNIC(e.target.value)}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="12345-1234567-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-muted rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder={t('addNote')}
              />
            </div>
          </>
        )}
      </div>

      {/* Sticky Save */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-muted px-4 py-3 flex gap-3 md:relative md:border-0 md:px-0 z-20">
        <button
          onClick={onBack}
          className="flex-1 border border-muted text-gray-700 font-semibold rounded-md py-3 text-base hover:bg-bg transition-colors min-h-[48px]"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-primary text-white font-semibold rounded-md py-3 text-base hover:bg-accent transition-colors disabled:opacity-60 min-h-[48px] flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? t('saving') : t('save')}
        </button>
      </div>
    </div>
  );
}
