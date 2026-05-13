import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarNav } from './components/SidebarNav';
import { Toast } from './components/Toast';
import { GeneralTab } from './tabs/GeneralTab';
import { SecurityTab } from './tabs/SecurityTab';
import { NotificationsTab }  from './tabs/NotificationsTab';
import { StoreTab } from './tabs/StoreTab';
import { BillingTab } from './tabs/BillingTab';
import { LanguageTab } from './tabs/LanguageTab';
import { useToast } from './hooks/useToast';
import { profileApi } from './api/profileApi';
import styles from './AdminProfile.module.css';

const TAB_COMPONENTS = {
  profile: GeneralTab,
  security: SecurityTab,
  notifications: NotificationsTab,
  store: StoreTab,
  billing: BillingTab,
  language: LanguageTab,
};

export const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast, showToast } = useToast();

  // Fetch profile data (used in GeneralTab, etc.)
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });

  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className={styles.page}>
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.main}>
        <TabComponent
          profile={profile}
          onProfileUpdate={refetchProfile}
          showToast={showToast}
        />
      </main>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => showToast(null)} />}
    </div>
  );
};