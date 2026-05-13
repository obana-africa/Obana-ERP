import Icon from '@/components/ui/Icon/Icon';
import { fmt } from '@/utils/formatters';
import s from './ProductsList.module.css';

export default function ProductsGrid({ products, onEdit, onPreview, onDelete }) {
  return (
    <div className={s.productGrid}>
      {products.map((p, i) => (
        <div
          key={p.id}
          className={s.productCard}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className={s.productCardImg} onClick={() => onPreview(p)}>
            {p.img ? (
              <img src={p.img} alt={p.name} />
            ) : (
              <div className={s.productCardImgPlaceholder}>{p.name[0]}</div>
            )}
            <span
              className={`${s.productCardStatus} ${
                p.stock === 0 ? s.statusOut : p.stock <= 10 ? s.statusLow : s.statusIn
              }`}
            >
              {p.stock === 0 ? 'Out' : p.stock <= 10 ? 'Low' : 'In stock'}
            </span>
          </div>
          <div className={s.productCardBody}>
            <p className={s.productCardCat}>{p.category}</p>
            <p className={s.productCardName}>{p.name}</p>
            <div className={s.productCardRow}>
              <span className={s.productCardPrice}>{fmt(p.price)}</span>
              <span className={s.productCardStock}>{p.stock} left</span>
            </div>
            <div className={s.productCardActions}>
              <button className={s.btnIconSm} onClick={() => onPreview(p)} title="Preview">
                <Icon name="eye" size={13} />
              </button>
              <button className={s.btnIconSm} onClick={() => onEdit(p)} title="Edit">
                <Icon name="edit" size={13} />
              </button>
              <button
                className={`${s.btnIconSm} ${s.btnIconDanger}`}
                onClick={() => onDelete(p.id)}
                title="Delete"
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}