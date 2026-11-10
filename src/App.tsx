import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

type Category = "All items" | "Vegetables" | "Fruits" | "Dairy" | "Chocolates" | "Munchies";

type Product = {
  id: number;
  name: string;
  detail: string;
  price: number;
  originalPrice?: number;
  category: Exclude<Category, "All items">;
  image: string;
  imageAlt: string;
  badge?: string;
  tint: string;
};

const categories: { name: Category; emoji: string; caption: string }[] = [
  { name: "All items", emoji: "✳", caption: "Everything" },
  { name: "Vegetables", emoji: "🥬", caption: "Farm fresh" },
  { name: "Fruits", emoji: "🍊", caption: "Juicy picks" },
  { name: "Dairy", emoji: "🥛", caption: "Daily essentials" },
  { name: "Chocolates", emoji: "🍫", caption: "Little treats" },
  { name: "Munchies", emoji: "🍿", caption: "Snack time" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Avocado",
    detail: "2 pcs · ripe & ready",
    price: 119,
    originalPrice: 149,
    category: "Fruits",
    image: "photo-1523049673857-eb18f1d7b578",
    imageAlt: "Fresh green avocados",
    badge: "20% OFF",
    tint: "#eaf1de",
  },
  {
    id: 2,
    name: "Cherry tomatoes",
    detail: "250 g · locally grown",
    price: 59,
    originalPrice: 75,
    category: "Vegetables",
    image: "photo-1546094096-0df4bcaaa337",
    imageAlt: "Ripe red cherry tomatoes",
    badge: "BESTSELLER",
    tint: "#f7e7dd",
  },
  {
    id: 3,
    name: "Farm fresh milk",
    detail: "500 ml · pasteurised",
    price: 34,
    category: "Dairy",
    image: "photo-1563636619-e9143da7973b",
    imageAlt: "A glass of fresh milk",
    tint: "#e4edf0",
  },
  {
    id: 4,
    name: "Dark chocolate",
    detail: "70% cocoa · 100 g",
    price: 149,
    originalPrice: 175,
    category: "Chocolates",
    image: "photo-1548907040-4d42f2a6f5f2",
    imageAlt: "Dark chocolate pieces",
    badge: "15% OFF",
    tint: "#efe7df",
  },
  {
    id: 5,
    name: "Sweet strawberries",
    detail: "200 g · hand-picked",
    price: 89,
    category: "Fruits",
    image: "photo-1464965911861-746a04b4bca6",
    imageAlt: "Fresh strawberries",
    tint: "#f5e5e0",
  },
  {
    id: 6,
    name: "Baby spinach",
    detail: "200 g · washed & ready",
    price: 39,
    originalPrice: 49,
    category: "Vegetables",
    image: "photo-1576045057995-568f588f82fb",
    imageAlt: "Fresh green spinach leaves",
    badge: "20% OFF",
    tint: "#e8efe2",
  },
  {
    id: 7,
    name: "Salted potato chips",
    detail: "Family pack · 150 g",
    price: 49,
    category: "Munchies",
    image: "photo-1566478989037-eec170784d0b",
    imageAlt: "Crispy potato chips",
    tint: "#f3eddf",
  },
  {
    id: 8,
    name: "Greek yoghurt",
    detail: "Plain · 400 g",
    price: 99,
    originalPrice: 120,
    category: "Dairy",
    image: "photo-1488477181946-6428a0291777",
    imageAlt: "A bowl of creamy yoghurt",
    badge: "FRESH PICK",
    tint: "#eee9df",
  },
];

const imageUrl = (image: string) =>
  `https://images.unsplash.com/${image}?auto=format&fit=crop&w=640&q=85`;

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>("All items");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortByDiscount, setSortByDiscount] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All items" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.detail.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    return sortByDiscount
      ? [...filtered].sort(
          (a, b) =>
            (b.originalPrice ? b.originalPrice - b.price : 0) -
            (a.originalPrice ? a.originalPrice - a.price : 0),
        )
      : filtered;
  }, [activeCategory, search, sortByDiscount]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = cartItems.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  );

  const changeQuantity = (productId: number, change: number) => {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + change;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: nextQuantity };
    });
    setOrderPlaced(false);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const selectCategory = (category: Category) => {
    setActiveCategory(category);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Freshly home">
          <span className="brand-mark"><span /></span>
          <span>freshly<span className="brand-period">.</span></span>
        </a>

        <button className="delivery-location" type="button">
          <span className="location-icon"><MapPin size={17} strokeWidth={2.2} /></span>
          <span className="location-copy">
            <span className="eyebrow">DELIVERING TO</span>
            <span className="location-address">Indiranagar, Bengaluru <ChevronDown size={14} /></span>
          </span>
        </button>

        <label className="search-box">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search for fruits, veggies, snacks..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              if (event.target.value) setActiveCategory("All items");
            }}
          />
          <kbd>⌘ K</kbd>
        </label>

        <button
          className={`cart-button ${cartCount ? "has-items" : ""}`}
          onClick={() => setIsCartOpen(true)}
          type="button"
          aria-label={`Open cart, ${cartCount} items`}
        >
          <ShoppingBag size={18} />
          <span>My cart</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </header>

      <main>
        <section className="welcome-strip">
          <div className="welcome-message">
            <span className="welcome-sparkle"><Sparkles size={14} /></span>
            Good afternoon, Maya <span className="wave">✳</span>
          </div>
          <div className="welcome-meta"><Clock3 size={14} /> Your next delivery is just 10 mins away</div>
        </section>

        <div className="page-layout">
          <aside className="sidebar">
            <div className="sidebar-heading">YOUR PANTRY</div>
            <nav className="category-nav" aria-label="Shop categories">
              {categories.map((category) => (
                <button
                  type="button"
                  className={`category-link ${activeCategory === category.name ? "active" : ""}`}
                  key={category.name}
                  onClick={() => selectCategory(category.name)}
                >
                  <span className={`category-emoji ${category.name === "All items" ? "all-icon" : ""}`}>
                    {category.emoji}
                  </span>
                  <span className="category-name">{category.name}</span>
                  {activeCategory === category.name && <span className="active-dot" />}
                </button>
              ))}
            </nav>

            <div className="sidebar-divider" />
            <div className="sidebar-promo">
              <span className="promo-leaf">✳</span>
              <p className="promo-title">Good food,<br />good mood.</p>
              <p className="promo-copy">A little fresh goes a long way.</p>
              <button type="button" onClick={() => selectCategory("Vegetables")}>
                Explore fresh picks <ArrowRight size={14} />
              </button>
              <span className="promo-illustration" aria-hidden="true">🥑</span>
            </div>

            <div className="sidebar-footer">
              <span className="footer-dot" /> Freshness you can feel good about
            </div>
          </aside>

          <div className="content">
            <section className="hero">
              <div className="hero-copy">
                <div className="hero-kicker"><span /> THE GOOD STUFF, FAST</div>
                <h1>Fresh finds.<br /><span>Happy you.</span></h1>
                <p>Your everyday favourites, picked fresh<br className="desktop-break" /> and at your door in minutes.</p>
                <button className="hero-button" type="button" onClick={() => selectCategory("All items")}>
                  Shop all groceries <ArrowRight size={16} />
                </button>
                <div className="hero-note"><Check size={13} /> Free delivery on your first order</div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="hero-circle" />
                <img
                  className="hero-produce"
                  src={imageUrl("photo-1540420773420-3366772f4999")}
                  alt=""
                />
                <div className="floating-note"><span className="note-icon">✿</span><span>Picked fresh<br /><b>just for you</b></span></div>
                <span className="hero-sparkle sparkle-one">✳</span>
                <span className="hero-sparkle sparkle-two">✦</span>
              </div>
              <div className="hero-pagination"><i className="selected" /><i /><i /></div>
            </section>

            <section className="quick-categories" aria-label="Browse categories">
              <div className="section-heading">
                <div>
                  <span className="overline">A LITTLE BIT OF EVERYTHING</span>
                  <h2>Shop by category</h2>
                </div>
                <button className="text-link" type="button" onClick={() => selectCategory("All items")}>
                  View all <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="category-cards">
                {categories.slice(1).map((category, index) => (
                  <button
                    type="button"
                    key={category.name}
                    className={`category-card category-card-${index + 1}`}
                    onClick={() => selectCategory(category.name)}
                  >
                    <span className="category-card-emoji">{category.emoji}</span>
                    <span className="category-card-title">{category.name}</span>
                    <span className="category-card-caption">{category.caption}</span>
                    <span className="category-card-arrow"><ArrowUpRight size={14} /></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="products-section" id="shop">
              <div className="product-section-heading">
                <div>
                  <span className="overline">{search ? "YOUR SEARCH RESULTS" : "GOOD THINGS, RIGHT THIS WAY"}</span>
                  <h2>{search ? `Results for “${search}”` : activeCategory === "All items" ? "Popular right now" : activeCategory}</h2>
                  {!search && <p>Little favourites our customers can’t stop adding.</p>}
                </div>
                <button
                  type="button"
                  className={`filter-button ${sortByDiscount ? "filter-active" : ""}`}
                  onClick={() => setSortByDiscount((value) => !value)}
                  aria-pressed={sortByDiscount}
                >
                  <SlidersHorizontal size={15} /> Offers first
                  {sortByDiscount ? <ArrowDown size={13} /> : null}
                </button>
              </div>

              {visibleProducts.length > 0 ? (
                <div className="product-grid">
                  {visibleProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <div className="product-image-wrap" style={{ backgroundColor: product.tint }}>
                        <img src={imageUrl(product.image)} alt={product.imageAlt} loading="lazy" />
                        {product.badge && <span className="product-badge">{product.badge}</span>}
                        <button
                          className={`favorite-button ${favorites.includes(product.id) ? "favorited" : ""}`}
                          type="button"
                          aria-label={favorites.includes(product.id) ? "Remove from favourites" : "Add to favourites"}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart size={16} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p className="product-detail">{product.detail}</p>
                        <div className="product-buy-row">
                          <div className="product-prices">
                            <span className="product-price">₹{product.price}</span>
                            {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
                          </div>
                          {cart[product.id] ? (
                            <div className="quantity-control">
                              <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button>
                              <span>{cart[product.id]}</span>
                              <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={13} /></button>
                            </div>
                          ) : (
                            <button className="add-button" type="button" onClick={() => changeQuantity(product.id, 1)}>
                              ADD <Plus size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-search">
                  <span>🧺</span>
                  <h3>Nothing in the basket yet</h3>
                  <p>Try a different search, or browse all of our fresh picks.</p>
                  <button type="button" onClick={() => { setSearch(""); setActiveCategory("All items"); }}>
                    Browse all items <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </section>

            <footer className="page-footer">
              <span className="footer-brand"><span className="brand-mark"><span /></span> freshly<span className="brand-period">.</span></span>
              <span>Good groceries. Good days.</span>
              <span>Made for your everyday <span className="footer-heart">♥</span></span>
            </footer>
          </div>
        </div>
      </main>

      {isCartOpen && (
        <div className="cart-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsCartOpen(false);
        }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-header">
              <div>
                <span className="overline">YOUR GOODIES</span>
                <h2 id="cart-title">My cart <span>({cartCount})</span></h2>
              </div>
              <button className="close-cart" type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart"><X size={20} /></button>
            </div>
            {orderPlaced ? (
              <div className="order-success">
                <span className="success-check"><Check size={25} /></span>
                <h3>You're all set!</h3>
                <p>Your fresh picks are being packed. See you in about 10 minutes.</p>
                <button type="button" onClick={() => { setIsCartOpen(false); setOrderPlaced(false); }}>Keep browsing</button>
              </div>
            ) : cartItems.length ? (
              <>
                <div className="delivery-promise"><Clock3 size={15} /><span>At your door in <b>10 minutes</b></span><span className="promise-dot" /></div>
                <div className="cart-items">
                  {cartItems.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <img src={imageUrl(product.image)} alt="" />
                      <div className="cart-item-info">
                        <h3>{product.name}</h3>
                        <span>{product.detail}</span>
                        <b>₹{product.price}</b>
                      </div>
                      <div className="quantity-control">
                        <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button>
                        <span>{cart[product.id]}</span>
                        <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="free-delivery-note"><span>✿</span> You’ve got free delivery!</div>
                  <div className="subtotal-row"><span>Subtotal</span><b>₹{subtotal}</b></div>
                  <div className="total-row"><span>To pay</span><b>₹{subtotal}</b></div>
                  <button className="checkout-button" type="button" onClick={() => { setCart({}); setOrderPlaced(true); }}>
                    Place your order <span>₹{subtotal}</span><ArrowRight size={16} />
                  </button>
                  <p className="checkout-footnote">Taxes included · No extra delivery fee</p>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛍️</span>
                <h3>Your cart feels a little light</h3>
                <p>Fill it with something fresh, crunchy, or chocolatey.</p>
                <button type="button" onClick={() => setIsCartOpen(false)}>Explore the good stuff <ArrowRight size={15} /></button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
