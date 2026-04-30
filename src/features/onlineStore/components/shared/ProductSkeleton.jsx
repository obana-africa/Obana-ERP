import { CardSkeleton } from '@/components/shared/Loading/Skeleton';

/**
 * Product grid skeleton loader
 * Shows placeholder cards while products load
 */
export const ProductGridSkeleton = ({ columns = 3, count = 6 }) => (
  <div 
    style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '16px' 
    }}
    aria-hidden="true"
    aria-label="Loading products"
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} aspectRatio={columns === 2 ? '4/3' : '4/5'} />
    ))}
  </div>
);

/**
 * Store preview skeleton
 */
export const StorePreviewSkeleton = () => (
  <div style={{ padding: '20px' }} aria-hidden="true">
    {/* Header skeleton */}
    <div style={{ height: 56, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 120, height: 20, background: '#f0f0f0', borderRadius: 4 }} />
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 60, height: 16, background: '#f0f0f0', borderRadius: 4 }} />
        <div style={{ width: 60, height: 16, background: '#f0f0f0', borderRadius: 4 }} />
      </div>
    </div>
    
    {/* Hero skeleton */}
    <div style={{ height: 300, background: '#f0f0f0', borderRadius: 8, marginBottom: 24 }} />
    
    {/* Products grid */}
    <ProductGridSkeleton columns={3} count={6} />
  </div>
);