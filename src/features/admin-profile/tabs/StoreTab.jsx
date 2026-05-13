import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Button, Input, Select } from '@/shared/ui';
import { profileApi } from '../api/profileApi';
import styles from './StoreTab.module.css';

export const StoreTab = ({ showToast }) => {
  const { data: profile, refetch } = useQuery({ queryKey: ['profile'], queryFn: profileApi.getProfile });
  const [storeData, setStoreData] = useState({
    storeName: '',
    industry: 'Fashion & Apparel',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
  });

  const updateField = (field) => (e) => {
    setStoreData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveMutation = useMutation({
    mutationFn: (data) => profileApi.updateStore(data),
    onSuccess: () => {
      showToast('Store details saved ✓', 'success');
      refetch();
    },
    onError: () => showToast('Failed to save store details', 'error'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(storeData);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Store</h1>
      <p className={styles.pageSub}>Manage your store name, currency, and contact details.</p>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Store details</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <Input
                label="Store name *"
                value={storeData.storeName}
                onChange={updateField('storeName')}
                required
              />
              <Select
                label="Industry"
                value={storeData.industry}
                onChange={updateField('industry')}
                options={['Fashion & Apparel', 'Electronics', 'Food & Beverage', 'Beauty & Cosmetics', 'Other']}
              />
              <Select
                label="Currency"
                value={storeData.currency}
                onChange={updateField('currency')}
                options={[
                  { value: 'NGN', label: 'NGN (₦) - Nigerian Naira' },
                  { value: 'USD', label: 'USD ($) - US Dollar' },
                  { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
                ]}
              />
              <Select
                label="Timezone"
                value={storeData.timezone}
                onChange={updateField('timezone')}
                options={['Africa/Lagos (GMT+1)', 'Africa/Accra (GMT+0)']}
              />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <Button type="submit" variant="primary" loading={saveMutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};