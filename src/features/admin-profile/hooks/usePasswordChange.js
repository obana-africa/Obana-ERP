import { useState } from 'react';

export const usePasswordChange = (showToast) => {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const toggleShow = (field) => () => {
    setShowPw((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updatePwField = (field) => (e) => {
    setPwForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateAndSubmit = async (apiCall) => {
    const { current, next, confirm } = pwForm;
    if (!current || !next || !confirm) {
      showToast('Please fill all password fields.', 'error');
      return false;
    }
    if (next !== confirm) {
      showToast('New passwords do not match.', 'error');
      return false;
    }
    if (next.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return false;
    }
    try {
      await apiCall({ current, next });
      setPwForm({ current: '', next: '', confirm: '' });
      showToast('Password changed successfully ✓', 'success');
      return true;
    } catch (error) {
      showToast(error.message || 'Password change failed', 'error');
      return false;
    }
  };

  return { pwForm, showPw, toggleShow, updatePwField, validateAndSubmit };
};