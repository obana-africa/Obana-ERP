import { useState, useCallback, useEffect } from "react";
import "./POS.css";

// ── Icons ─────────────────────────────────────────────────────────
const Icon = {
  ShoppingBag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  CreditCard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Cash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  QR: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
      <path d="M14 14h3v3M17 14v3h3M14 21h3"/>
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Receipt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  ),
  Percent: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"/>
      <circle cx="6.5" cy="6.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  Backspace: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
      <line x1="18" y1="9" x2="12" y2="15"/>
      <line x1="12" y1="9" x2="18" y2="15"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ── Product data ──────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1,  name: "Wireless ANC Headphones", variant: "Midnight Black",  price: 89.99,  emoji: "", stock: 12, category: "Electronics" },
  { id: 2,  name: "Bamboo Water Bottle",      variant: "Forest Green",    price: 24.99,  emoji: "", stock: 34, category: "Lifestyle" },
  { id: 3,  name: "Mechanical Keyboard",      variant: "TKL White",       price: 129.99, emoji: "", stock: 7,  category: "Electronics" },
  { id: 4,  name: "Linen Tote Bag",           variant: "Natural",         price: 19.99,  emoji: "", stock: 0,  category: "Fashion" },
  { id: 5,  name: "Aromatherapy Candle",      variant: "Cedarwood",       price: 34.99,  emoji: "", stock: 22, category: "Lifestyle" },
  { id: 6,  name: "Running Sneakers",         variant: "Sz 42 / Gray",    price: 109.99, emoji: "", stock: 5,  category: "Fashion" },
  { id: 7,  name: "Protein Bar Box",          variant: "Choc Peanut ×12", price: 29.99,  emoji: "", stock: 18, category: "Food" },
  { id: 8,  name: "USB-C Hub 7-in-1",         variant: "Space Gray",      price: 49.99,  emoji: "", stock: 15, category: "Electronics" },
  { id: 9,  name: "Cold Brew Coffee Kit",     variant: "1L Mason",        price: 39.99,  emoji: "", stock: 9,  category: "Food" },
  { id: 10, name: "Yoga Mat Premium",         variant: "Slate 6mm",       price: 59.99,  emoji: "", stock: 8,  category: "Lifestyle" },
  { id: 11, name: "Ceramic Mug Set",          variant: "×4 Terracotta",   price: 44.99,  emoji: "", stock: 3,  category: "Lifestyle" },
  { id: 12, name: "Sunglasses Polarized",     variant: "Gold / Brown",    price: 79.99,  emoji: "", stock: 11, category: "Fashion" },
];

const CATEGORIES      = ["All", "Electronics", "Lifestyle", "Fashion", "Food"];
const PAYMENT_METHODS = [
  { id: "card", label: "Card",    Icon: Icon.CreditCard },
  { id: "cash", label: "Cash",    Icon: Icon.Cash       },
  { id: "qr",   label: "QR Pay",  Icon: Icon.QR         },
  { id: "tab",  label: "Tab",     Icon: Icon.Tag        },
];
const TAX_RATE = 0.085;
const fmt = (v) => `$${Number(v).toFixed(2)}`;

// ── Numpad overlay ────────────────────────────────────────────────
function Numpad({ cashReceived, setCashReceived, onConfirm, onClose, totalDue }) {
  const handle = (k) => {
    if (k === "⌫") setCashReceived((p) => (p.length > 1 ? p.slice(0, -1) : "0"));
    else if (k === ".") { if (!cashReceived.includes(".")) setCashReceived((p) => p + "."); }
    else setCashReceived((p) => (p === "0" ? k : p + k));
  };
  const change = parseFloat(cashReceived) - totalDue;
  const keys   = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  return (
    <div className="pos-numpad-overlay" onClick={onClose}>
      <div className="pos-numpad" onClick={(e) => e.stopPropagation()}>
        <p className="pos-numpad-label">Cash received</p>
        <div className="pos-numpad-display">
          {cashReceived === "0" ? <span className="pos-numpad-placeholder">0.00</span> : cashReceived}
        </div>
        <p className="pos-numpad-due">Due: <strong>{fmt(totalDue)}</strong></p>
        <div className="pos-numpad-grid">
          {keys.map((k) => (
            <button key={k} className={`pos-numpad-key${k === "⌫" ? " action" : ""}`} onClick={() => handle(k)}>
              {k === "⌫" ? <Icon.Backspace /> : k}
            </button>
          ))}
          <button
            className="pos-numpad-key confirm"
            onClick={onConfirm}
            disabled={parseFloat(cashReceived) < totalDue}
          >
            {change >= 0 ? `Change: ${fmt(change)}` : "Enter amount"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div className={`pos-toast${visible ? " visible" : ""}`}>
      <span className="pos-toast-dot" />
      {message}
    </div>
  );
}

// ── Success overlay ───────────────────────────────────────────────
function SuccessOverlay({ total, onClose, onNewSale }) {
  return (
    <div className="pos-success-overlay" onClick={onClose}>
      <div className="pos-success-card" onClick={(e) => e.stopPropagation()}>
        <div className="pos-success-icon"><Icon.Check /></div>
        <h2>Payment Complete</h2>
        <p>Transaction processed successfully</p>
        <div className="pos-success-amount">{fmt(total)}</div>
        <div className="pos-success-actions">
          <button className="pos-success-btn" onClick={onClose}>Print Receipt</button>
          <button className="pos-success-btn primary" onClick={onNewSale}>New Sale</button>
        </div>
      </div>
    </div>
  );
}

// ── POS page — drop inside your existing layout, no sidebar ───────
export default function POS() {
  const [cartItems,       setCartItems]       = useState([]);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [discountCode,    setDiscountCode]    = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showSuccess,     setShowSuccess]     = useState(false);
  const [showNumpad,      setShowNumpad]      = useState(false);
  const [cashReceived,    setCashReceived]    = useState("0");
  const [toast,           setToast]           = useState({ visible: false, message: "" });
  const [lastTotal,       setLastTotal]       = useState(0);

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  }, []);

  const filteredProducts = PRODUCTS.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.variant.toLowerCase().includes(q)) &&
      (activeCategory === "All" || p.category === activeCategory)
    );
  });

  const addToCart = useCallback((product) => {
    if (product.stock === 0) return;
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added`);
  }, [showToast]);

  const updateQty  = useCallback((id, d) => setCartItems((p) => p.map((i) => i.id === id ? { ...i, qty: i.qty + d } : i).filter((i) => i.qty > 0)), []);
  const removeItem = useCallback((id) => setCartItems((p) => p.filter((i) => i.id !== id)), []);
  const clearCart  = useCallback(() => { setCartItems([]); setAppliedDiscount(0); setDiscountCode(""); }, []);

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * (appliedDiscount / 100);
  const taxAmt      = (subtotal - discountAmt) * TAX_RATE;
  const total       = subtotal - discountAmt + taxAmt;
  const itemCount   = cartItems.reduce((s, i) => s + i.qty, 0);

  const applyDiscount = () => {
    const codes = { SAVE10: 10, SUMMER20: 20, VIP30: 30 };
    const pct   = codes[discountCode.toUpperCase()];
    if (pct) { setAppliedDiscount(pct); showToast(`${pct}% discount applied 🎉`); }
    else showToast("Invalid discount code");
  };

  const handleCheckout = () => {
    if (!cartItems.length) return;
    selectedPayment === "cash" ? setShowNumpad(true) : processPayment();
  };

  const processPayment = () => { setLastTotal(total); setShowNumpad(false); setShowSuccess(true); };
  const handleNewSale  = () => { clearCart(); setShowSuccess(false); setCashReceived("0"); };

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".pos-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    // pos-page-root fills whatever space your layout gives it
    <div className="pos-page-root">

      {/* ── Inner page header ─────────────────────────────────── */}
      <div className="pos-page-header">
        <div className="pos-page-header-left">
          <span className="pos-page-icon"><Icon.ShoppingBag /></span>
          <div>
            <h1 className="pos-page-title">Point of Sale</h1>
            {/* <p className="pos-page-subtitle">OBANA.Africa · Nigeria</p> */}
          </div>
        </div>
        <div className="pos-page-header-right">
          <span className="pos-live-badge">● Live</span>
          <button className="pos-header-btn"><Icon.Tag /> Discount</button>
          <button className="pos-header-btn"><Icon.User /> Staff: Alex C.</button>
          <button className="pos-header-btn accent"><Icon.Receipt /> Open Orders</button>
        </div>
      </div>

      {/* ── Two-column body ───────────────────────────────────── */}
      <div className="pos-body">

        {/* Left: product browser */}
        <div className="pos-browser">

          <div className="pos-browser-toolbar">
            <div className="pos-search-wrap">
              <Icon.Search />q  az
              <input
                type="text"
                className="pos-search-input"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="pos-search-kbd">⌘K</span>
            </div>

            <div className="pos-category-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`pos-cat-tab${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pos-product-scroll">
            <div className="pos-product-grid">
              {filteredProducts.map((product) => {
                const isOut = product.stock === 0;
                const isLow = !isOut && product.stock <= 5;
                return (
                  <div
                    key={product.id}
                    className={`pos-product-card${isOut ? " out-of-stock" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    <div
                      className="pos-product-img"
                      style={{ background: `hsl(${(product.id * 47) % 360}deg 28% 16%)` }}
                    >
                      {product.emoji}
                      {isOut && <span className="pos-stock-badge out">Out</span>}
                      {isLow && <span className="pos-stock-badge low">Low</span>}
                    </div>
                    <div className="pos-product-info">
                      <p className="pos-product-name">{product.name}</p>
                      <p className="pos-product-variant">{product.variant}</p>
                      <p className="pos-product-price">{fmt(product.price)}</p>
                    </div>
                    <button
                      className="pos-product-add"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    >
                      <Icon.Plus />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: cart panel */}
        <div className="pos-cart-panel">

          <div className="pos-cart-header">
            <Icon.ShoppingBag />
            <span className="pos-cart-title">Order</span>
            {itemCount > 0 && <span className="pos-cart-badge">{itemCount}</span>}
            <div className="pos-cart-header-gap" />
            {cartItems.length > 0 && (
              <button className="pos-cart-clear" onClick={clearCart}>Clear all</button>
            )}
          </div>

          <div className="pos-customer-row">
            <button className="pos-customer-btn">
              <Icon.User />
              <span>Add customer</span>
              <Icon.ChevronRight />
            </button>
          </div>

          <div className="pos-cart-items">
            {cartItems.length === 0 ? (
              <div className="pos-cart-empty">
                <div className="pos-cart-empty-icon"><Icon.ShoppingBag /></div>
                <p>Cart is empty</p>
                <span>Tap a product to add it</span>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pos-cart-item">
                  <div className="pos-cart-item-thumb">{item.emoji}</div>
                  <div className="pos-cart-item-info">
                    <p className="pos-cart-item-name">{item.name}</p>
                    <p className="pos-cart-item-unit">{fmt(item.price)} each</p>
                  </div>
                  <div className="pos-qty-ctrl">
                    <button className="pos-qty-btn" onClick={() => updateQty(item.id, -1)}><Icon.Minus /></button>
                    <span className="pos-qty-val">{item.qty}</span>
                    <button className="pos-qty-btn" onClick={() => updateQty(item.id, 1)}><Icon.Plus /></button>
                  </div>
                  <span className="pos-cart-item-total">{fmt(item.price * item.qty)}</span>
                  <button className="pos-cart-item-del" onClick={() => removeItem(item.id)}><Icon.Trash /></button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="pos-cart-footer">
              <div className="pos-summary">
                <div className="pos-summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="pos-summary-row discount">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>−{fmt(discountAmt)}</span>
                  </div>
                )}
                <div className="pos-summary-row">
                  <span>Tax ({(TAX_RATE * 100).toFixed(1)}%)</span>
                  <span>{fmt(taxAmt)}</span>
                </div>
                <div className="pos-summary-divider" />
                <div className="pos-summary-row total">
                  <span>Total</span>
                  <span className="pos-total-value">{fmt(total)}</span>
                </div>
              </div>

              <div className="pos-discount-row">
                <input
                  className="pos-discount-input"
                  placeholder="Discount code (e.g. SAVE10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                />
                <button className="pos-discount-btn" onClick={applyDiscount}>
                  <Icon.Percent /> Apply
                </button>
              </div>

              <div className="pos-payment-grid">
                {PAYMENT_METHODS.map(({ id, label, Icon: PayIcon }) => (
                  <button
                    key={id}
                    className={`pos-pay-btn${selectedPayment === id ? " selected" : ""}`}
                    onClick={() => setSelectedPayment(id)}
                  >
                    <PayIcon /> {label}
                  </button>
                ))}
              </div>

              <button className="pos-charge-btn" onClick={handleCheckout}>
                <Icon.CreditCard /> Charge {fmt(total)}
              </button>
            </div>
          )}
        </div>
      </div>

      {showNumpad && (
        <Numpad
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          onConfirm={processPayment}
          onClose={() => setShowNumpad(false)}
          totalDue={total}
        />
      )}

      {showSuccess && (
        <SuccessOverlay
          total={lastTotal}
          onClose={() => setShowSuccess(false)}
          onNewSale={handleNewSale}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
