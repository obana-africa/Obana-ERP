import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Button } from '@/shared/ui'; // or use divs with CSS classes
import { ToggleSwitch } from '../components/ToggleSwitch';
import { DeviceSessionItem } from '../components/DeviceSessionItem';
import { usePasswordChange } from '../hooks/usePasswordChange';
import { profileApi } from '../api/profileApi';
import styles from './SecurityTab.module.css';

export const SecurityTab = ({ showToast }) => {
  const { pwForm, showPw, toggleShow, updatePwField, validateAndSubmit } = usePasswordChange(showToast);

  const { data: devices = [], refetch: refetchDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: profileApi.getDevices,
  });

  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => validateAndSubmit(() => Promise.resolve()),
    onError: (err) => showToast(err.message, 'error'),
  });

  const handlePasswordSubmit = () => {
    validateAndSubmit(changePasswordMutation.mutateAsync);
  };

  const handleLogoutDevice = async (deviceId) => {
    await profileApi.logoutDevice(deviceId);
    refetchDevices();
    showToast('Logged out successfully', 'success');
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Security</h1>
      <p className={styles.pageSub}>Manage your password, two-factor authentication, and active sessions.</p>

      {/* Change Password Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Change password</div>
          <div className={styles.cardDesc}>You last changed your password 7 months ago. We recommend changing it regularly.</div>
        </div>
        <div className={styles.cardBody}>
          {['current', 'next', 'confirm'].map((field) => (
            <div key={field} className={styles.formGroup}>
              <label className={styles.formLabel}>
                {field === 'current' ? 'Current password' : field === 'next' ? 'New password' : 'Confirm new password'}
              </label>
              <div className={styles.inputWrap}>
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  className={styles.formInput}
                  value={pwForm[field]}
                  onChange={updatePwField(field)}
                  placeholder="••••••••"
                />
                <button type="button" className={styles.eyeBtn} onClick={toggleShow(field)}>
                  👁️ {/* replace with Ic eye icon */}
                </button>
              </div>
            </div>
          ))}
          <span className={styles.formHint}>Must be at least 8 characters and include a number and special character.</span>
        </div>
        <div className={styles.cardFooter}>
          <Button variant="ghost" onClick={() => window.location.reload()}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordSubmit} loading={changePasswordMutation.isPending}>
            Change password
          </Button>
        </div>
      </Card>

      {/* Passkeys Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderRow}>
            <div>
              <div className={styles.cardTitle}>Passkeys <span className={styles.recommendedBadge}>Recommended</span></div>
              <div className={styles.cardDesc}>Log in with your fingerprint, face, or screen lock - no password needed.</div>
            </div>
            <Button variant="green" onClick={() => showToast('Passkey setup coming soon!', 'success')}>
              Create passkey
            </Button>
          </div>
        </div>
      </Card>

      {/* Two-step auth Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Two-step authentication</div>
          <div className={styles.cardDesc}>Verify your identity with a second factor after entering your password.</div>
        </div>
        <div className={styles.cardBodyFlush}>
          <div className={styles.securityItem}>
            <div className={styles.securityItemLeft}>
              <div className={styles.securityIcon}>A</div>
              <div>
                <div className={styles.securityTitle}>Authenticator app</div>
                <div className={styles.securitySub}>Primary method · Active</div>
              </div>
            </div>
            <Button variant="dangerGhost" size="sm" onClick={() => showToast('Removed authenticator app.', 'error')}>Remove</Button>
          </div>
          <div className={styles.securityItem}>
            <div className={styles.securityItemLeft}>
              <div className={styles.securityIcon}>B</div>
              <div>
                <div className={styles.securityTitle}>Backup email</div>
                <div className={styles.securitySub}>Not configured</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => showToast('Backup email setup coming soon!', 'success')}>
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* Active sessions Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderRow}>
            <div>
              <div className={styles.cardTitle}>Active sessions</div>
              <div className={styles.cardDesc}>You are currently logged in on these devices. Log out of any you do not recognise.</div>
            </div>
            <Button variant="dangerGhost" size="sm" onClick={() => profileApi.logoutAllDevices().then(() => refetchDevices())}>
              Log out all
            </Button>
          </div>
        </div>
        <div className={styles.cardBodyFlush}>
          {devices.map((device) => (
            <DeviceSessionItem key={device.id} device={device} onLogout={handleLogoutDevice} />
          ))}
        </div>
      </Card>
    </div>
  );
};