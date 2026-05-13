import styles from './Skeleton.module.css';

/**
 * Generic skeleton loader
 * Usage: <Skeleton width="200px" height="20px" borderRadius="4px" />
 */
export const Skeleton = ({ 
  width = '100%', 
  height = '16px', 
  borderRadius = '4px',
  className = '',
  count = 1,
  style = {}
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${className}`}
          style={{
            width,
            height,
            borderRadius,
            marginBottom: i < count - 1 ? '8px' : 0,
            ...style
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

/**
 * Card skeleton for product/card layouts
 */
export const CardSkeleton = ({ aspectRatio = '4/5', className = '' }) => (
  <div className={`${styles.cardSkeleton} ${className}`} aria-hidden="true">
    <div 
      className={styles.cardImage} 
      style={{ aspectRatio }} 
    />
    <div className={styles.cardContent}>
      <Skeleton width="40%" height="12px" />
      <Skeleton width="80%" height="16px" />
      <Skeleton width="60%" height="14px" />
      <Skeleton width="35%" height="18px" />
    </div>
  </div>
);

/**
 * Full page loader
 */
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className={styles.pageLoader} role="status" aria-label={message}>
    <div className={styles.spinner} />
    <p className={styles.loadingText}>{message}</p>
  </div>
);