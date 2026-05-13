import { useState, useCallback, useMemo } from 'react';

const STEPS = ['Product Type', 'Details & Images', 'Pricing', 'Inventory'];

/**
 * Custom hook for managing multi-step product form
 * 
 * @param {Function} onSubmit - Called with complete form data on final submit
 * @returns {Object} - Form state and handlers
 */
export function useProductForm({ onSubmit } = {}) {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState('regular');
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([
    { option: 'Size', values: '' },
    { option: 'Color', values: '' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    longDesc: '',
    collection: '',
    price: '',
    costPrice: '',
    discountPrice: '',
    stock: '',
    unit: 'pc',
    barcode: '',
    trackQty: true,
  });
  const [errors, setErrors] = useState({});

  const totalSteps = STEPS.length;
  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  // Update a single form field
  const setField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  // Validate current step
  const validateStep = useCallback(() => {
    const newErrors = {};

    switch (step) {
      case 1:
        // Product type selection - always valid
        break;
      case 2:
        if (!formData.name.trim()) {
          newErrors.name = 'Product name is required';
        }
        break;
      case 3:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'Valid price is required';
        }
        break;
      case 4:
        if (!formData.stock || parseInt(formData.stock) < 0) {
          newErrors.stock = 'Valid stock quantity is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData]);

  // Navigate to next step
  const goNext = useCallback(() => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  }, [validateStep, totalSteps]);

  // Navigate to previous step
  const goBack = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Handle variant changes
  const addVariant = useCallback(() => {
    setVariants(prev => [...prev, { option: '', values: '' }]);
  }, []);

  const updateVariant = useCallback((index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeVariant = useCallback((index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle image upload
  const addImages = useCallback((files) => {
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index) => {
    setImages(prev => {
      const updated = [...prev];
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(updated[index].url);
      return updated.filter((_, i) => i !== index);
    });
  }, []);

  // Submit entire form
  const submit = useCallback(() => {
    if (!validateStep()) return;

    const completeData = {
      ...formData,
      productType,
      images,
      variants: productType === 'variants' ? variants : [],
    };

    onSubmit?.(completeData);
  }, [formData, productType, images, variants, validateStep, onSubmit]);

  // Computed values
  const profit = useMemo(() => {
    const price = parseFloat(formData.price || 0);
    const cost = parseFloat(formData.costPrice || 0);
    return price && cost ? price - cost : null;
  }, [formData.price, formData.costPrice]);

  return {
    // State
    step,
    totalSteps,
    isFirstStep,
    isLastStep,
    productType,
    images,
    variants,
    formData,
    errors,
    profit,
    steps: STEPS,

    // Handlers
    setProductType,
    setField,
    goNext,
    goBack,
    addVariant,
    updateVariant,
    removeVariant,
    addImages,
    removeImage,
    submit,
  };
}