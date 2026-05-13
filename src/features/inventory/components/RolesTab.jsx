import s from '../Inventory.module.css';
import Icon from '@/components/ui/Icon/Icon';

export default function RolesTab({ roles }) {
  return (
    <div className={s.rolesSection}>
      <p className={s.roleDesc}>Control who can view and modify inventory data across your store.</p>
      <div className={s.rolesGrid}>
        {roles.map(r => (
          <div key={r.role} className={s.roleCard} style={{ borderLeft: `4px solid ${r.color}` }}>
            <div className={s.roleAvatar} style={{ background: r.bg, color: r.color }}>
              {r.role[0]}
            </div>
            <div>
              <div className={s.roleName}>{r.role}</div>
              <div className={s.roleAccess}>{r.access}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={s.roleNote}>
        <Icon name="warning" size={14} />
        <span>Manage detailed role permissions in <strong>Settings → User Management</strong></span>
      </div>
    </div>
  );
}