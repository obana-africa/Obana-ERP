import Icon from '@/components/ui/Icon/Icon';
import { useAnimatedCounter } from '@/features/products/hooks/useAnimatedCounter';
import AnimatedValue from './AnimatedValue';
import s from '../Collections.module.css';

export default function StatsRow({ stats, onFilterByStatus, onNavigate }) {
  const cards = [
    {
      label: 'Total Collections',
      value: stats.totalCollections,
      accent: '#1a1a2e',
      icon: 'collections',
      onClick: () => onFilterByStatus('all'),
    },
    {
      label: 'Products in Use',
      value: stats.totalProducts,
      accent: '#2DBD97',
      icon: 'product',
      onClick: () => onNavigate('/products'),
    },
    {
      label: 'Active Locations',
      value: stats.activeLocations,
      accent: '#3B82F6',
      icon: 'location',
      onClick: () => onNavigate('/collections?tab=locations'),
    },
    {
      label: 'Total Stock Units',
      value: stats.totalStock,
      accent: '#8B5CF6',
      icon: 'box',
      onClick: null,
    },
    {
      label: 'Low Stock Alerts',
      value: stats.lowStockAlerts,
      accent: stats.lowStockAlerts > 0 ? '#EF4444' : '#9CA3AF',
      icon: 'warning',
      onClick: () => onNavigate('/inventory'),
    },
  ];

  return (
    <div className={s.statsRow}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={s.statCard}
          style={{ animationDelay: `${i * 55}ms`, cursor: card.onClick ? 'pointer' : undefined }}
          onClick={card.onClick}
          role={card.onClick ? 'button' : undefined}
          tabIndex={card.onClick ? 0 : undefined}
        >
          <div className={s.statTop}>
            <span className={s.statLabel}>{card.label}</span>
            <Icon name={card.icon} size={15} stroke={card.accent} />
          </div>
          <div className={s.statValue} style={{ color: card.accent }}>
            <AnimatedValue target={card.value} />
          </div>
        </div>
      ))}
    </div>
  );
}