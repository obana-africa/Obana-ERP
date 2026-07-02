import { Card, Button } from '@/shared/ui';
import styles from './BillingTab.module.css';

export const BillingTab = ({ showToast }) => {
  return (
    <div>
      <h1 className={styles.pageTitle}>Billing</h1>
      <p className={styles.pageSub}>Manage your subscription plan and payment details.</p>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            Current plan <span className={styles.planBadge}>PRO</span>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.planRow}>
            <div>
              <div className={styles.planName}>thaja Pro</div>
              <div className={styles.planMeta}>N15,000 / month · Renews June 1, 2026</div>
            </div>
            <Button variant="outline" onClick={() => showToast('Upgrade flow coming soon!', 'success')}>
              Upgrade plan
            </Button>
          </div>
        </div>
      </Card>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitle}>Payment method</div>
            <Button variant="outline" size="sm" onClick={() => showToast('Payment update coming soon!', 'success')}>
              Edit
            </Button>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>💳</div>
            <div>
              <div className={styles.paymentCardName}>Mastercard ending ••••1234</div>
              <div className={styles.paymentCardMeta}>Expires 08/2026</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};