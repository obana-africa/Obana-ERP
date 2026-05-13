import { useState, useEffect } from 'react';

export const useProfileForm = (initialProfile) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeName: '',
    photoUrl: null,
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile);
    }
  }, [initialProfile]);

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const setPhoto = (url) => {
    setFormData((prev) => ({ ...prev, photoUrl: url }));
  };

  const resetForm = () => {
    if (initialProfile) setFormData(initialProfile);
  };

  return { formData, updateField, setPhoto, resetForm };
};