import { useAnimatedCounter } from '@/features/products/hooks/useAnimatedCounter';
// import SparkLine from '@/components/shared/SparkLine';
import s from '../Transfers.module.css';


function AnimatedValue({ target, prefix = '', suffix = '' }) {
  const display = useAnimatedCounter(target, { prefix, suffix });
  return <>{display}</>;
}

export default function StatsRow({ stats }) {
 
  const sparkData = {
    total: [310, 380, 290, 450, 410, 520, 470, 600, 540, 680, 620, 740],
    transit: [5, 7, 4, 9, 8, 10, 6, 11, 9, 12, 10, 13],
    pending: [2, 5, 3, 6, 4, 7, 5, 8, 6, 9, 7, 10],
    completed: [8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 13, 15],
    value: [18000, 22000, 20000, 25000, 23000, 27000, 26000, 30000, 29000, 32000, 31000, 34000],
  };

  return (
    <div className={s.statsRow}>
      {stats.map((stat, ) => (
        <div key={stat.label} className={s.statCard}>
          <div className={s.statLabel}>{stat.label}</div>
          <div className={s.statValue} style={{ color: stat.accent }}>
            <AnimatedValue
              target={stat.rawValue ?? 0}
              prefix={stat.prefix || ''}
            />
          </div>
          <SparkLine data={sparkData[stat.sparkKey] || sparkData.total} color={stat.accent} />
        </div>
      ))}
    </div>
  );
}