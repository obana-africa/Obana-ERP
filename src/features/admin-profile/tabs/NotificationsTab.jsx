import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, Button } from '@/shared/ui';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { useNotificationPrefs } from '../hooks/useNotificationPrefs';
import { profileApi } from '../api/profileApi';
import { NOTIFICATION_ITEMS } from '../constants';
import styles from './NotificationsTab.module.css';

export const NotificationsTab = ({ showToast }) => {
  const { data: initialPrefs, refetch } = useQuery({
    queryKey: ['notificationPrefs'],
    queryFn: profileApi.getNotificationPrefs,
  });

  const { prefs, togglePref, savePrefs } = useNotificationPrefs(
    initialPrefs,
    profileApi.updateNotificationPrefs,
    showToast
  );

  const saveMutation = useMutation({
    mutationFn: savePrefs,
    onSuccess: () => refetch(),
  });

  return (
    <div>
      <h1 className={styles.pageTitle}>Notifications</h1>
      <p className={styles.pageSub}>Choose what activity triggers a notification and how you receive them.</p>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Email notifications</div>
          <div className={styles.cardDesc}>Alerts sent to your email address</div>
        </div>
        <div className={styles.cardBodyFlush}>
          {NOTIFICATION_ITEMS.map((item) => (
            <div key={item.key} className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>{item.label}</div>
                <div className={styles.toggleSub}>{item.sub}</div>
              </div>
              <ToggleSwitch checked={prefs[item.key]} onChange={togglePref(item.key)} />
            </div>
          ))}
        </div>
        <div className={styles.cardFooter}>
          <Button variant="primary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending}>
            Save preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};