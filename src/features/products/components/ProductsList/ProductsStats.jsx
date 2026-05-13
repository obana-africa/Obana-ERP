import Icon from '@/components/ui/Icon/Icon';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { SparkLine } from './SparkLine';
import s from './ProductsList.module.css';

const SPARK_DATA = {
  retail: [310, 380, 290, 450, 410, 520, 470, 600, 540, 680, 620, 740],
  stock: [820, 790, 850, 810, 780, 760, 800, 770, 790, 750, 780, 760],
  sold: [18, 24, 19, 31, 27, 38, 33, 44, 39, 51, 46, 58],
  out: [2, 1, 3, 2, 4, 3, 5, 4, 3, 5, 4, 6],
};

const StatCard = ({ label, value, prefix, suffix, change, up, color, sparkData, onClick, delay = 0 }) => {
  const animatedValue = useAnimatedCounter(value, { prefix, suffix });

  return (
    <div
      className={s.statCard}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={s.statTop}>
        <div className={s.statIconWrap} style={{ background: `${color}18` }}>
          <Icon name="chart" size={14} stroke={color} />
        </div>
        {change !== null && change !== undefined ? (
          <span className={`${s.statBadge} ${up ? s.statUp : s.statDown}`}>
            <Icon name={up ? 'chevronRight' : 'chevronRight'} size={10} />
            {Math.abs(change)}%
          </span>
        ) : (
          <span className={s.statFlat}>—</span>
        )}
      </div>
      <div className={s.statBody}>
        <p className={s.statLabel}>{label}</p>
        <p className={s.statValue} style={{ color }}>
          {animatedValue}
        </p>
      </div>
      <SparkLine data={sparkData} color={color} />
      {onClick && (
        <div className={s.statFooter}>
          <span>View details</span>
          <Icon name="chevronRight" size={11} stroke="#9CA3AF" />
        </div>
      )}
    </div>
  );
};

export default function ProductsStats({ stats, onFilterByStatus, onNavigate }) {
  const statCards = [
    {
      label: 'Total Retail Value',
      value: stats.totalRetail,
      prefix: '₦',
      suffix: '',
      change: 12,
      up: true,
      color: '#2DBD97',
      sparkData: SPARK_DATA.retail,
      onClick: () => onNavigate?.('/analytics'),
    },
    {
      label: 'Units in Stock',
      value: stats.totalInventory,
      prefix: '',
      suffix: '',
      change: -4,
      up: false,
      color: '#1b3b5f',
      sparkData: SPARK_DATA.stock,
      onClick: () => onNavigate?.('/inventory'),
    },
    {
      label: 'Total Units Sold',
      value: stats.totalSold,
      prefix: '',
      suffix: '',
      change: 18,
      up: true,
      color: '#E8C547',
      sparkData: SPARK_DATA.sold,
      onClick: () => onNavigate?.('/analytics'),
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock,
      prefix: '',
      suffix: '',
      change: null,
      up: null,
      color: '#EF4444',
      sparkData: SPARK_DATA.out,
      onClick: () => onFilterByStatus?.('out'),
    },
  ];

  return (
    <div className={s.statsRow}>
      {statCards.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 60} />
      ))}
    </div>
  );
}