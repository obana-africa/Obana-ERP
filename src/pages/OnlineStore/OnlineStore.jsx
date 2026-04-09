import { useState } from "react";
import './OnlineStore.css'

const products = [
  {
    id: 1,
    name: "Classic Linen Shirt",
    price: 89.99,
    compareAt: 120.0,
    badge: "Sale",
    category: "Apparel",
    rating: 4.8,
    reviews: 124,
    img: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=400&q=80",
    colors: ["#E8DDD0", "#3B3B3B", "#8B6F47"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Leather Tote Bag",
    price: 149.0,
    compareAt: null,
    badge: "New",
    category: "Accessories",
    rating: 4.9,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    colors: ["#8B6F47", "#1C1C1C", "#C4A882"],
    sizes: ["One Size"],
  },
  {
    id: 3,
    name: "Merino Wool Sweater",
    price: 175.0,
    compareAt: 210.0,
    badge: "Sale",
    category: "Apparel",
    rating: 4.7,
    reviews: 203,
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
    colors: ["#C4A882", "#6B8E6B", "#3B3B3B"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Minimalist Watch",
    price: 299.0,
    compareAt: null,
    badge: "Bestseller",
    category: "Accessories",
    rating: 5.0,
    reviews: 312,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    colors: ["#E8DDD0", "#1C1C1C"],
    sizes: ["38mm", "42mm"],
  },
  {
    id: 5,
    name: "Canvas Sneakers",
    price: 65.0,
    compareAt: null,
    badge: null,
    category: "Footwear",
    rating: 4.6,
    reviews: 178,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    colors: ["#FFFFFF", "#3B3B3B", "#8B6F47"],
    sizes: ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44"],
  },
  {
    id: 6,
    name: "Silk Scarf",
    price: 55.0,
    compareAt: null,
    badge: "Limited",
    category: "Accessories",
    rating: 4.9,
    reviews: 67,
    img: "https://images.unsplash.com/photo-1601924351433-2ab00eff8c24?w=400&q=80",
    colors: ["#C4A882", "#8B6F47", "#6B8E6B"],
    sizes: ["One Size"],
  },
];

const categories = ["All", "Apparel", "Accessories", "Footwear"];
const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Best Rated",
  "Most Reviewed",
];

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill={s <= Math.round(rating) ? "#C4A882" : "#E0D9D0"}
        >
          <polygon points="6,1 7.6,4.3 11.2,4.8 8.6,7.3 9.2,11 6,9.2 2.8,11 3.4,7.3 0.8,4.8 4.4,4.3" />
        </svg>
      ))}
      <span className="star-rating__score">{rating.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product, onQuickAdd }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null;

  const badgeClass = product.badge
    ? `product-card__badge product-card__badge--${product.badge.toLowerCase()}`
    : "";

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img className="product-card__img" src={product.img} alt={product.name} />

        {product.badge && <div className={badgeClass}>{product.badge}</div>}
        {discount && <div className="product-card__discount">-{discount}%</div>}

        <button
          className="product-card__wishlist"
          onClick={(e) => { e.stopPropagation(); setWishlist(!wishlist); }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill={wishlist ? "#C4A882" : "none"}
            stroke={wishlist ? "#C4A882" : "#3B3B3B"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="product-card__quick-add" onClick={() => onQuickAdd(product)}>
          Quick Add
        </div>
      </div>

      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__name">{product.name}</p>
        <StarRating rating={product.rating} />
        <p className="product-card__reviews">({product.reviews} reviews)</p>

        <div className="product-card__swatches">
          {product.colors.map((color, i) => (
            <div
              key={i}
              className={`product-card__swatch${i === selectedColor ? " product-card__swatch--active" : ""}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(i)}
            />
          ))}
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {product.compareAt && (
            <span className="product-card__compare">${product.compareAt.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, onUpdateQty }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-overlay__backdrop" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">Your Cart</h2>
            <p className="cart-drawer__count">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="cart-drawer__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="cart-empty__title">Your cart is empty</p>
              <p className="cart-empty__sub">Add items to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img className="cart-item__img" src={item.img} alt={item.name} />
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__cat">{item.category}</p>
                  <div className="cart-item__bottom">
                    <div className="cart-item__qty">
                      <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                      <span className="cart-item__qty-val">{item.qty}</span>
                      <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <span className="cart-item__line-total">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button className="cart-item__remove" onClick={() => onRemove(item.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-summary-row">
              <span className="cart-summary-row__label">Subtotal</span>
              <span className="cart-summary-row__val">${total.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-row__label">Shipping</span>
              <span className="cart-summary-row__val cart-summary-row__val--free">Free</span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-row__label">Total</span>
              <span className="cart-total-row__val">${total.toFixed(2)}</span>
            </div>
            <button className="cart-btn--checkout">Checkout</button>
            <button className="cart-btn--continue" onClick={onClose}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnlineStore() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [banner, setBanner] = useState(true);

  const handleQuickAdd = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemove = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) handleRemove(id);
    else setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  let filtered = products.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === "Price: Low to High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "Best Rated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === "Most Reviewed") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="store-root">
      <header className="store-header">
        <div className="store-header__inner">
          <div className="store-header__left">
            <h1 className="store-logo">Online Store</h1>
            <nav className="store-nav">
              {["Shop", "Collections", "About", "Journal"].map((n) => (
                <a key={n} href="#" className="store-nav__link">{n}</a>
              ))}
            </nav>
          </div>
          <div className="store-header__right">
            <div className="store-search">
              <svg className="store-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8F85" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="store-search__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
              />
            </div>
            <button className="store-cart-btn" onClick={() => setCartOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="store-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="store-hero">
        <p className="store-hero__eyebrow">Summer Collection 2025</p>
        <h2 className="store-hero__title">Elevated Essentials</h2>
        <p className="store-hero__subtitle">
          Timeless pieces crafted for those who believe style should never compromise comfort.
        </p>
        <button className="store-hero__cta">Shop the Collection</button>
      </div>

      <div className="store-main">
        <div className="store-filters">
          <div className="store-filters__cats">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`store-filter-btn${activeCategory === cat ? " store-filter-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="store-filters__sort">
            <span className="store-filters__count">{filtered.length} products</span>
            <select
              className="store-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="store-empty">
            <p className="store-empty__title">No products found</p>
            <p className="store-empty__sub">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="store-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
        )}

        <div className="store-trust">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On all orders over $150" },
            { icon: "↩", title: "Easy Returns", desc: "30-day hassle-free returns" },
            { icon: "🔒", title: "Secure Checkout", desc: "SSL encrypted payments" },
            { icon: "✦", title: "Sustainability", desc: "Ethically sourced materials" },
          ].map((b) => (
            <div key={b.title} className="store-trust__item">
              <div className="store-trust__icon">{b.icon}</div>
              <p className="store-trust__title">{b.title}</p>
              <p className="store-trust__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemove}
          onUpdateQty={handleUpdateQty}
        />
      )}
    </div>
  );
}
