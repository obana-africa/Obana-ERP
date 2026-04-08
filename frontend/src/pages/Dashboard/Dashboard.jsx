import styles from './Dashboard.module.css';

const metrics = [
  { label: 'Sessions', value: '1,209', change: '↑ 28%', up: true },
  { label: 'Gross sales', value: '₦3.91M', change: '↑ 29%', up: true },
  { label: 'Orders', value: '94', change: '↑ 18%', up: true },
  { label: 'Conversion rate', value: '0.33%', change: '— no change', up: null },
];

const recentOrders = [
  { id: '#1042', amount: '₦12,500', status: 'Paid' },
  { id: '#1041', amount: '₦8,200', status: 'Pending' },
  { id: '#1040', amount: '₦3,600', status: 'Paid' },
  { id: '#1039', amount: '₦22,000', status: 'Paid' },
];

const topProducts = [
  { name: 'Jack and Jones', percent: 85 },
  { name: 'adiddas', percent: 62 },
  { name: 'Tommy Hilfiger', percent: 48 },
  { name: 'versace', percent: 34 },
];

const Dashboard = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Good morning, let's get started.</h1>
      <p className={styles.sub}>Here's what's happening with your store today.</p>

      <div className={styles.filterRow}>
        {['Last 30 days', 'Last 7 days', 'Today', 'All channels'].map((f) => (
          <button key={f} className={styles.filterBtn}>{f}</button>
        ))}
      </div>

      <div className={styles.metrics}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <p className={styles.metricLabel}>{m.label}</p>
            <p className={styles.metricValue}>{m.value}</p>
            <p className={`${styles.metricChange} ${m.up === true ? styles.up : m.up === false ? styles.down : ''}`}>
              {m.change}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.alertRow}>
        <div className={styles.alertCard}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span>21 orders to fulfil</span>
          <span className={styles.arrow}>›</span>
        </div>
        <div className={styles.alertCard}>
          <span className={`${styles.dot} ${styles.amber}`} />
          <span>50+ payments to capture</span>
          <span className={styles.arrow}>›</span>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent orders</h3>
          {recentOrders.map((o) => (
            <div key={o.id} className={styles.orderRow}>
              <span className={styles.orderId}>{o.id}</span>
              <span className={styles.orderAmt}>{o.amount}</span>
              <span className={`${styles.badge} ${o.status === 'Paid' ? styles.paid : styles.pending}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Top products</h3>
          {topProducts.map((p) => (
            <div key={p.name} className={styles.barRow}>
              <span className={styles.barLabel}>{p.name}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${p.percent}%` }} />
              </div>
              <span className={styles.barVal}>{p.percent}%</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Quick actions</h3>
          {['Add new product', 'Create discount', 'View inventory', 'Export reports'].map((a) => (
            <div key={a} className={styles.quickItem}>
              <span className={styles.quickLabel}>{a}</span>
              <span className={styles.arrow}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;