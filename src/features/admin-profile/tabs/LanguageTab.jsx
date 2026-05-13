import { useState } from 'react';
import { Card, Button, Select } from '@/components/ui';
import { LANGUAGES, REGIONAL_FORMATS, DATE_FORMATS, TIME_FORMATS } from '../constants';
import styles from './LanguageTab.module.css';

export const LanguageTab = ({ showToast }) => {
  const [settings, setSettings] = useState({
    language: 'English',
    regionalFormat: 'English (Nigeria)',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour (AM/PM)',
  });

  const updateField = (field) => (value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Call API to save settings
    showToast('Language settings saved ✓', 'success');
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Language & Region</h1>
      <p className={styles.pageSub}>Set your display language and regional format preferences.</p>

      <Card className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.formGrid}>
            <Select
              label="Display language"
              value={settings.language}
              onChange={updateField('language')}
              options={LANGUAGES}
            />
            <Select
              label="Regional format"
              value={settings.regionalFormat}
              onChange={updateField('regionalFormat')}
              options={REGIONAL_FORMATS}
            />
            <Select
              label="Date format"
              value={settings.dateFormat}
              onChange={updateField('dateFormat')}
              options={DATE_FORMATS}
            />
            <Select
              label="Time format"
              value={settings.timeFormat}
              onChange={updateField('timeFormat')}
              options={TIME_FORMATS}
            />
          </div>
        </div>
        <div className={styles.cardFooter}>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};