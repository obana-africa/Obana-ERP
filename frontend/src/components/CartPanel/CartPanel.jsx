import { useState } from 'react';
import { useCart } from '../../store/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './CartPanel.module.css';

const VAT_RATE = 0.075;
const PAYMENT_METHODS = ['Cash', 'Transfer', 'Card'];

const CartPanel = () => {
  const { cart, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Current Order</span>
        {cart.length > 0 && (
          <span className={styles.badge}>{cart.length} items</span>
        )}
      </div>

      <div className={styles.items}>
        {cart.length === 0 ? (
          <p className={styles.empty}>No items added yet</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
              </div>
              <div className={styles.qtyCtrl}>
                <button onClick={() => dispatch({ type: 'DECREASE_QTY', payload: item.id })}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.row}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className={styles.row}><span>VAT (7.5%)</span><span>{formatCurrency(vat)}</span></div>
        <div className={`${styles.row} ${styles.total}`}><span>Total</span><span>{formatCurrency(total)}</span></div>
        <div className={styles.payMethods}>
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              className={`${styles.payBtn} ${paymentMethod === m ? styles.activePayBtn : ''}`}
              onClick={() => setPaymentMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          className={styles.checkoutBtn}
          disabled={cart.length === 0}
        >
          Charge {formatCurrency(total)}
        </button>
        <button
          className={styles.clearBtn}
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
        >
          Clear Order
        </button>
      </div>
    </aside>
  );
};

export default CartPanel;