import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon/Icon';
import s from './Modal.module.css';

/**
 * Reusable Modal component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {() => void} props.onClose - Close handler
 * @param {string} [props.title] - Modal header title
 * @param {React.ReactNode} props.children - Modal body content
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {boolean} [props.wide=false] - Use wider max-width variant
 * @param {boolean} [props.closeOnOverlay=true] - Close when clicking overlay
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  wide = false,
  closeOnOverlay = true,
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={s.overlay}
      onClick={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${s.modal} ${wide ? s.modalWide : ''}`}>
        {title && (
          <div className={s.head}>
            <span className={s.title}>{title}</span>
            <button className={s.closeBtn} onClick={onClose} aria-label="Close">
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        <div className={s.body}>{children}</div>

        {footer && <div className={s.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;