import { useAnimatedCounter } from '@/features/products/hooks/useAnimatedCounter';

export default function AnimatedValue({ target }) {
  const display = useAnimatedCounter(target);
  return <>{display}</>;
}