import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Button, Input } from '@/shared/ui';
import { AvatarUpload } from '../components/AvatarUpload';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { profileApi } from '../api/profileApi';
import { LOGIN_SERVICES, LANGUAGES } from '../constants';
import styles from './GeneralTab.module.css';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

export const GeneralTab = ({ profile, onProfileUpdate, showToast }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      showToast('Profile updated successfully', 'success');
      onProfileUpdate();
    },
    onError: () => showToast('Update failed', 'error'),
  });

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  // Placeholder for store name (should come from profile)
  const storeName = profile?.storeName || 'thaja Store';

  return (
    <div>
      <h1 className={styles.pageTitle}>General</h1>
      <p className={styles.pageSub}>Manage your personal details and preferences.</p>

      {/* Profile Card */}
      <Card className={styles.card}>
        <AvatarUpload
          initialPhoto={profile?.photoUrl}
          onUpload={profileApi.uploadAvatar}
          firstName={profile?.firstName}
          lastName={profile?.lastName}
        />
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <Input label="First name *" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Last name *" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Email
                <span className={styles.verifiedBadge}>✓ Verified</span>
              </label>
              <Input {...register('email')} error={errors.email?.message} />
              <span className={styles.formHint}>Use your email as it appears on your government-issued ID.</span>
            </div>
            <Input label="Phone number (optional)" {...register('phone')} error={errors.phone?.message} />
          </div>
          <div className={styles.cardFooter}>
            <Button type="button" variant="ghost" onClick={() => reset(profile)}>Discard</Button>
            <Button type="submit" variant="primary" loading={isPending}>Save changes</Button>
          </div>
        </form>
      </Card>

      {/* Login services Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Login service</div>
          <div className={styles.cardDesc}>Connect an external login service to quickly and securely access your thaja account.</div>
        </div>
        <div className={styles.cardBodyFlush}>
          {LOGIN_SERVICES.map((service) => (
            <div key={service.id} className={styles.loginRow}>
              <div className={styles.loginLeft}>
                <div className={styles.loginLogo}>{service.emoji}</div>
                <div>
                  <div className={styles.loginProvider}>{service.name}</div>
                  <div className={styles.loginStatus}>Not connected</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Stores Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderRow}>
            <div>
              <div className={styles.cardTitle}>Stores</div>
              <div className={styles.cardDesc}>View and access stores connected to your account.</div>
            </div>
            <Button variant="outline" size="sm">+ Add store</Button>
          </div>
        </div>
        <div className={styles.cardBodyFlush}>
          <div className={styles.loginRow}>
            <div className={styles.loginLeft}>
              <div className={styles.loginLogo}>L</div>
              <div>
                <div className={styles.loginProvider}>{storeName}</div>
                <div className={styles.loginStatus}>Owner · Lagos, Nigeria</div>
              </div>
            </div>
            <span className={styles.activeBadge}>Active</span>
          </div>
        </div>
      </Card>

      {/* Language Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Preferred language</div>
          <div className={styles.cardDesc}>This is the language you will see when logged in. It does not affect your customers' experience.</div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Language</label>
            <select className={styles.selectInput}>
              {LANGUAGES.map(lang => <option key={lang}>{lang}</option>)}
            </select>
          </div>
          <div className={styles.regionalInfo}>
            <strong>Regional format</strong><br />
            Your number, time, date, and currency formats are set for <strong>English (Nigeria)</strong>.{' '}
            <span className={styles.regionalLink}>Change regional format</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <Button variant="primary" onClick={() => showToast('Language preference saved ✓', 'success')}>Save</Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className={styles.dangerZone}>
        <div>
          <div className={styles.dangerTitle}>Delete account</div>
          <div className={styles.dangerSub}>Permanently remove your account and all associated data. This cannot be undone.</div>
        </div>
        <Button variant="dangerGhost" onClick={() => showToast('Please contact support to delete your account.', 'error')}>
          Delete account
        </Button>
      </div>
    </div>
  );
};