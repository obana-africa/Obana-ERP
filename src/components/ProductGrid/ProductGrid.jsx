import { useCart } from '../../store/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './ProductGrid.module.css';

const mockProducts = [
  { id: 1, name: 'Fresh Apple Juice', price: 1500, emoji: '🍎', category: 'Drinks', stock: 24 },
  { id: 2, name: 'Cappuccino', price: 2000, emoji: '☕', category: 'Drinks', stock: -1 },
  { id: 3, name: 'Chicken Burger', price: 4500, emoji: '🍔', category: 'Food', stock: 12 },
  { id: 4, name: 'Jollof Rice', price: 3200, emoji: '🍛', category: 'Food', stock: 8 },
  { id: 5, name: 'Chilled Smoothie', price: 1800, emoji: '🥤', category: 'Drinks', stock: 15 },
  { id: 6, name: 'Pepperoni Pizza', price: 6000, emoji: '🍕', category: 'Food', stock: 5 },
];

const ProductGrid = ({ search, category }) => {
  const { dispatch } = useCart();

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.grid}>
      {filtered.map((product) => (
        <div
          key={product.id}
          className={styles.card}
          onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
        >
          <div className={styles.image}>{product.emoji}</div>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.price}>{formatCurrency(product.price)}</p>
          <p className={styles.stock}>
            {product.stock === -1 ? 'Unlimited' : `${product.stock} in stock`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;