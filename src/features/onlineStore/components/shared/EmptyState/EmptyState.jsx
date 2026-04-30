import styles from './EmptyState.module.css';

/**
 * Reusable empty state component
 * 
 * @param {string} icon - Emoji or SVG
 * @param {string} title - Main heading
 * @param {string} description - Supporting text
 * @param {Object} action - { label: string, onClick: function }
 * @param {Object} secondaryAction - { label: string, onClick: function }
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'medium', // small | medium | large
  className = ''
}) => {
  const sizes = {
    small: { padding: '24px', iconSize: 40, titleSize: '16px' },
    medium: { padding: '48px', iconSize: 64, titleSize: '18px' },
    large: { padding: '64px', iconSize: 80, titleSize: '20px' }
  };

  const { padding, iconSize, titleSize } = sizes[size];

  return (
    <div 
      className={`${styles.emptyState} ${styles[size]} ${className}`}
      style={{ padding }}
      role="status"
    >
      {icon && (
        <div className={styles.icon} style={{ fontSize: iconSize }}>
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className={styles.title} style={{ fontSize: titleSize }}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      <div className={styles.actions}>
        {action && (
          <button className={styles.primaryBtn} onClick={action.onClick}>
            {action.label}
          </button>
        )}
        
        {secondaryAction && (
          <button className={styles.secondaryBtn} onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};