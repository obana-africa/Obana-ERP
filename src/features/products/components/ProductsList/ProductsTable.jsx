import { fmt } from '@/utils/formatters';
import Icon from '@/components/ui/Icon/Icon';
import s from './ProductsList.module.css';

export default function ProductsTable({ products, onEdit, onPreview, onDelete }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={s.tableRow}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <td>
                <div className={s.productCell}>
                  <div className={s.productThumb}>
                    {product.img ? <img src={product.img} alt={product.name} /> : product.name[0]}
                  </div>
                  <div>
                    <div className={s.productName}>{product.name}</div>
                    <div className={s.productSku}>SKU: {product.sku || '—'}</div>
                    {product.variants && <span className={s.variantBadge}>Has variants</span>}
                  </div>
                </div>
              </td>
              <td><span className={s.categoryBadge}>{product.category}</span></td>
              <td className={s.priceCell}>{fmt(product.price)}</td>
              <td>
                <StockIndicator stock={product.stock} />
              </td>
              <td className={s.soldCell}>{product.sold}</td>
              <td>
                <StatusBadge stock={product.stock} />
              </td>
              <td>
                <div className={s.rowActions}>
                  <button className={s.btnIconSm} title="Edit" onClick={() => onEdit(product)}>
                    <Icon name="edit" size={13} />
                  </button>
                  <button className={s.btnIconSm} title="Preview" onClick={() => onPreview(product)}>
                    <Icon name="eye" size={13} />
                  </button>
                  <button className={`${s.btnIconSm} ${s.btnIconDanger}`} title="Delete" onClick={() => onDelete(product.id)}>
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockIndicator({ stock }) {
  const statusClass = stock === 0 ? s.stockZero : stock <= 10 ? s.stockLow : s.stockOk;
  return (
    <div className={s.stockCell}>
      <span className={statusClass}>{stock}</span>
      {stock > 0 && (
        <div className={s.stockBar}>
          <div
            className={s.stockBarFill}
            style={{
              width: `${Math.min((stock / 100) * 100, 100)}%`,
              background: stock <= 10 ? '#EF4444' : '#2DBD97',
            }}
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ stock }) {
  let className = s.statusIn;
  let label = 'In stock';

  if (stock === 0) {
    className = s.statusOut;
    label = 'Out of stock';
  } else if (stock <= 10) {
    className = s.statusLow;
    label = 'Low stock';
  }

  return <span className={`${s.statusBadge} ${className}`}>{label}</span>;
}