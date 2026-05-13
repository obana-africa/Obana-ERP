import { useState, useEffect } from 'react';

const DEFAULT_PREFS = {
  newOrder: true,
  lowStock: true,
  newCustomer: false,
  orderShipped: true,
  marketing: false,
  weeklyReport: true,
};

export const useNotificationPrefs = (initialPrefs, savePrefsApi, showToast) => {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    if (initialPrefs) setPrefs(initialPrefs);
  }, [initialPrefs]);

  const togglePref = (key) => (value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const savePrefs = async () => {
    try {
      await savePrefsApi(prefs);
      showToast('Notification preferences saved ✓', 'success');
    } catch (error) {
      showToast('Failed to save preferences', 'error');
    }
  };

  return { prefs, togglePref, savePrefs };
};