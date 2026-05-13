import Icon from '@/components/ui/Icon/Icon';
import { useAnimatedCounter } from '@/features/products/hooks/useAnimatedCounter';
import { SparkLine } from './SparkLine';
import s from '../Inventory.module.css';

function AnimatedValue({ target, prefix = '', suffix = '' }) {
  const display = useAnimatedCounter(target, { prefix, suffix });
  return <>{display}</>;
}

export default function StatsRow({ totalItems, totalValue, lowStock, outOfStock, totalShrinkage }) {
  const stats = [
    { label: 'Total SKUs', value: totalItems, accent: '#2DBD97', icon: 'box', spark: [310, 380, 290, 450, 410, 520, 470, 600, 540, 680, 620, 740] },
    { label: 'Inventory Value', value: totalValue, accent: '#E8C547', icon: 'chart', prefix: '₦', spark: [180, 200, 220, 250, 230, 260, 290, 310, 330, 350, 340, 370] },
    { label: 'Low Stock Alerts', value: lowStock, accent: '#F59E0B', icon: 'warning', spark: [0, 1, 0, 2, 1, 3, 2, 1, 0, 2, 1, 0] },
    { label: 'Out of Stock', value: outOfStock, accent: '#EF4444', icon: 'close', spark: [1, 0, 1, 2, 1, 0, 0, 2, 0, 1, 1, 0] },
    { label: 'Total Shrinkage', value: totalShrinkage, accent: '#8B5CF6', icon: 'filter', spark: [2, 1, 3, 2, 4, 3, 5, 4, 3, 5, 4, 6] },
  ];

  return (
    <div className={s.statsRow}>
      {stats.map(stat => (
        <div key={stat.label} className={s.statCard}>
          <div className={s.statTop}>
            <span className={s.statLbl}>{stat.label}</span>
            <Icon name={stat.icon} size={15} stroke={stat.accent} />
          </div>
          <div className={s.statVal} style={{ color: stat.accent }}>
            <AnimatedValue target={stat.value} prefix={stat.prefix || ''} />
          </div>
          <SparkLine data={stat.spark} color={stat.accent} />
        </div>
      ))}
    </div>
  );
}