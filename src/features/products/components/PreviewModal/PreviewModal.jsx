import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { fmt } from '@/utils/formatters';
import s from '../AddProductModal/AddProductModal.module.css'; // reuse some styles

export default function PreviewModal({ product, isOpen, onClose, onEdit }) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Preview"
      footer={
        <>
          <button className={s.btnGhost} onClick={onClose}>
            Close
          </button>
          <button
            className={s.btnPrimary}
            onClick={() => {
              onEdit(product);
              onClose();
            }}
          >
            <Icon name="edit" size={13} stroke="#fff" /> Edit Product
          </button>
        </>
      }
    >
      <div className={s.previewImgBox}>
        {product.img ? (
          <img src={product.img} alt={product.name} className={s.previewImg} />
        ) : (
          <div className={s.previewImgPlaceholder}>
            <Icon name="img" size={36} stroke="#9CA3AF" />
            <span>No image uploaded</span>
          </div>
        )}
      </div>
      <div className={s.previewName}>{product.name}</div>
      <div className={s.previewMeta}>
        <span className={s.categoryBadge}>{product.category}</span>
        {product.variants && <span className={s.variantBadge}>Has variants</span>}
      </div>
      <div className={s.previewStats}>
        {[
          { label: 'Price', value: fmt(product.price) },
          { label: 'Stock', value: product.stock },
          { label: 'Units Sold', value: product.sold },
        ].map((stat) => (
          <div key={stat.label} className={s.previewStat}>
            <div className={s.previewStatVal}>{stat.value}</div>
            <div className={s.previewStatLbl}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div className={s.previewStatusRow}>
        <span
          className={`${s.statusBadge} ${
            product.stock === 0 ? s.statusOut : s.statusIn
          }`}
        >
          {product.stock === 0 ? 'Out of stock' : 'In stock'}
        </span>
        {product.stock > 0 && product.stock <= 10 && (
          <span className={s.lowStockWarn}>⚠ Low stock</span>
        )}
      </div>
    </Modal>
  );
}