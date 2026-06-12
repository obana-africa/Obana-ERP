import { useSettingsResource } from '../../hooks/useSettingsResource'
import { Section, Toggle } from '../../components/Form'
import SaveBar from '../../components/SaveBar'
import PanelSkeleton from '../../components/PanelSkeleton'
import PanelError from '../../components/PanelError'
import styles from './NotificationsPanel.module.css'

/**
 * Notifications settings.
 *
 * One of the simplest panels — pure toggle grid. Demonstrates how trivial a
 * "doc-style" panel becomes with the shared framework: ~80 lines, mostly data.
 */

const ADMIN_NOTIFS = [
  { key: 'newOrder',        label: 'New order placed',        desc: 'Alert when a customer places an order' },
  { key: 'orderFulfilled',  label: 'Order fulfilled',         desc: 'Alert when an order is shipped' },
  { key: 'orderCancelled',  label: 'Order cancelled',         desc: 'Alert when an order is cancelled' },
  { key: 'lowStock',        label: 'Low stock alert',         desc: 'When product stock falls below 5 units' },
  { key: 'newCustomer',     label: 'New customer registered', desc: 'Alert on every new account creation' },
  { key: 'paymentFailed',   label: 'Payment failed',          desc: 'When a payment attempt fails' },
  { key: 'refundRequested', label: 'Refund requested',        desc: 'When a customer requests a refund' },
  { key: 'reviewPosted',    label: 'New product review',      desc: 'Alert when a product review is submitted' },
]

const CHANNEL_NOTIFS = [
  { key: 'emailNewOrder',   label: 'Email — new orders', desc: 'Receive order emails at your store contact address' },
  { key: 'smsNewOrder',     label: 'SMS — new orders',   desc: 'Receive SMS alerts for new orders (carrier charges apply)' },
  { key: 'emailMarketing',  label: 'Marketing emails',   desc: 'Receive product updates, tips and offers' },
]

export default function NotificationsPanel() {
  const s = useSettingsResource('notifications')

  if (s.isLoading) return <PanelSkeleton sections={2} />
  if (s.isError)   return <PanelError error={s.error} onRetry={s.refetch} />

  const { values: f, setField, isDirty, isSaving, save, discard } = s

  const renderRow = (n) => (
    <div key={n.key} className={styles.notifRow}>
      <div>
        <p className={styles.notifLabel}>{n.label}</p>
        <p className={styles.notifDesc}>{n.desc}</p>
      </div>
      <Toggle value={f[n.key]} onChange={v => setField(n.key, v)} />
    </div>
  )

  return (
    <div>
      <SaveBar dirty={isDirty} saving={isSaving} onSave={save} onDiscard={discard} />

      <Section
        title="Admin notifications"
        subtitle="Choose which events trigger admin alerts"
      >
        {ADMIN_NOTIFS.map(renderRow)}
      </Section>

      <Section title="Notification channels">
        {CHANNEL_NOTIFS.map(renderRow)}
      </Section>
    </div>
  )
}