import Icon from '@/components/ui/Icon/Icon';
import { LOCATIONS, LOCATION_TYPE_CFG, ALL_PRODUCTS } from '@/data/collections';
import s from '../Collections.module.css';

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const LocAvatar = ({ name, active }) => (
  <div className={s.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
);

const Pill = ({ label, bg, color, size = 'sm' }) => (
  <span className={`${s.pill} ${size === 'xs' ? s.pillXs : ''}`} style={{ background: bg, color }}>
    {label}
  </span>
);

export default function LocationsOverview({ collections, onManageLocations, navigate }) {
  return (
    <div className={s.locOverview}>
      {LOCATIONS.map(loc => {
        const locType = LOCATION_TYPE_CFG[loc.type];
        const locStockByCollection = collections.map(c => {
          const products = ALL_PRODUCTS.filter(p => c.productIds.includes(p.id));
          const stock = products.reduce((a, p) => a + (c.locationInventory[loc.id]?.[p.id] || 0), 0);
          return { collectionName: c.name, collectionId: c.id, stock };
        });
        const totalLocStock = locStockByCollection.reduce((a, b) => a + b.stock, 0);
        const outOfStock = locStockByCollection.filter(c => c.stock === 0).length;
        const lowStock = (() => {
          let count = 0;
          collections.forEach(c => {
            ALL_PRODUCTS.filter(p => c.productIds.includes(p.id)).forEach(p => {
              const q = c.locationInventory[loc.id]?.[p.id] ?? 0;
              if (q > 0 && q <= 5) count++;
            });
          });
          return count;
        })();

        return (
          <div key={loc.id} className={`${s.locOverviewCard} ${!loc.active ? s.locOverviewCardInactive : ''}`}>
            <div className={s.locOverviewHead}>
              <div className={s.locOverviewLeft}>
                <LocAvatar name={loc.name} active={loc.active} />
                <div>
                  <div className={s.locOverviewName}>{loc.name}</div>
                  <div className={s.locOverviewCity}>{loc.city}</div>
                </div>
              </div>
              <div className={s.locOverviewRight}>
                <Pill {...locType} size="xs" />
                {!loc.active && <span className={s.inactiveBadge}>Inactive</span>}
              </div>
            </div>

            <div className={s.locOverviewStats}>
              <div className={s.locOverviewStat}>
                <div className={s.locOverviewStatVal}>{totalLocStock}</div>
                <div className={s.locOverviewStatLbl}>Total Units</div>
              </div>
              <div className={s.locOverviewStat}>
                <div className={s.locOverviewStatVal}>{collections.length}</div>
                <div className={s.locOverviewStatLbl}>Collections</div>
              </div>
              <div className={s.locOverviewStat}>
                <div className={s.locOverviewStatVal} style={{ color: outOfStock > 0 ? '#EF4444' : '#059669' }}>
                  {outOfStock}
                </div>
                <div className={s.locOverviewStatLbl}>Out of Stock</div>
              </div>
              <div className={s.locOverviewStat}>
                <div className={s.locOverviewStatVal} style={{ color: lowStock > 0 ? '#D97706' : '#059669' }}>
                  {lowStock}
                </div>
                <div className={s.locOverviewStatLbl}>Low Stock</div>
              </div>
            </div>

            <div className={s.locCollBreakdown}>
              {locStockByCollection.map(c => (
                <div key={c.collectionName} className={s.locCollRow}>
                  <span className={s.locCollName}>{c.collectionName}</span>
                  <div className={s.locCollBar}>
                    <div className={s.locCollBarFill} style={{ width: totalLocStock ? `${(c.stock / totalLocStock) * 100}%` : '0%' }} />
                  </div>
                  <span className={s.locCollQty}>{c.stock}</span>
                </div>
              ))}
            </div>

            <div className={s.locCardFooter}>
              <button className={s.locCardBtn} onClick={onManageLocations}>
                <Icon name="edit" size={12} /> Manage
              </button>
              <button className={s.locCardBtn} onClick={() => navigate('/analytics', { state: { location: loc.id } })}>
                <Icon name="chart" size={12} /> Analytics
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}