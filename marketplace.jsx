import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro Max", price: 1299, originalPrice: 1499, category: "Electrónica", rating: 4.8, reviews: 2341, image: "📱", seller: "TechStore Pro", stock: 15, badge: "Top Ventas", description: "El iPhone más avanzado con chip A17 Pro, cámara de 48MP y titanio premium.", tags: ["nuevo", "garantía", "envío rápido"] },
  { id: 2, name: "MacBook Air M3", price: 1099, originalPrice: 1299, category: "Computadoras", rating: 4.9, reviews: 876, image: "💻", seller: "AppleWorld", stock: 8, badge: "Nuevo", description: "Potencia increíble con batería de 18 horas. El laptop perfecto para todo.", tags: ["nuevo", "garantía"] },
  { id: 3, name: "Sony WH-1000XM5", price: 279, originalPrice: 379, category: "Audio", rating: 4.7, reviews: 5432, image: "🎧", seller: "AudioTech", stock: 42, badge: "Oferta", description: "Cancelación de ruido líder en la industria. Audio Hi-Res certificado.", tags: ["oferta", "envío rápido"] },
  { id: 4, name: "Samsung OLED 65\"", price: 1799, originalPrice: 2499, category: "TV & Video", rating: 4.6, reviews: 1203, image: "📺", seller: "ElectroHogar", stock: 5, badge: "Hot Deal", description: "Panel OLED 4K con 120Hz. Gaming Mode y Dolby Atmos integrado.", tags: ["oferta", "garantía"] },
  { id: 5, name: "Nike Air Max 2024", price: 189, originalPrice: 229, category: "Calzado", rating: 4.5, reviews: 8765, image: "👟", seller: "SportZone", stock: 120, badge: "Bestseller", description: "Comodidad extrema con tecnología Air Max de última generación.", tags: ["nuevo", "envío rápido"] },
  { id: 6, name: "PS5 Slim Bundle", price: 599, originalPrice: 699, category: "Gaming", rating: 4.9, reviews: 4321, image: "🎮", seller: "GamersHub", stock: 3, badge: "Agotándose", description: "PS5 Slim + 2 juegos AAA. La mejor experiencia gaming de consola.", tags: ["nuevo", "garantía"] },
  { id: 7, name: "iPad Pro M4 11\"", price: 999, originalPrice: 1099, category: "Tablets", rating: 4.8, reviews: 654, image: "📟", seller: "AppleWorld", stock: 22, badge: "Nuevo", description: "El iPad más delgado jamás creado. Pantalla OLED Ultra Retina XDR.", tags: ["nuevo", "garantía"] },
  { id: 8, name: "Dyson V15 Detect", price: 449, originalPrice: 599, category: "Hogar", rating: 4.7, reviews: 2109, image: "🌀", seller: "HomeElite", stock: 30, badge: "Oferta", description: "Aspiradora inalámbrica con láser detector de polvo. Filtración HEPA.", tags: ["oferta", "envío rápido"] },
];

const ORDERS = [
  { id: "#ORD-8821", product: "iPhone 15 Pro Max", date: "10 May 2026", status: "Entregado", amount: 1299, tracking: "AR123456789" },
  { id: "#ORD-8754", product: "Sony WH-1000XM5", date: "5 May 2026", status: "En camino", amount: 279, tracking: "AR987654321" },
  { id: "#ORD-8612", product: "Nike Air Max 2024", date: "28 Abr 2026", status: "En preparación", amount: 189, tracking: "AR456123789" },
];

const MESSAGES = [
  { id: 1, from: "TechStore Pro", avatar: "TS", msg: "Tu pedido fue enviado hoy ✓", time: "10:23", unread: true },
  { id: 2, from: "SportZone", avatar: "SZ", msg: "¿Querés que te reserve el talle?", time: "Ayer", unread: true },
  { id: 3, from: "GamersHub", avatar: "GH", msg: "Stock disponible, comprá ya!", time: "Lun", unread: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "order", msg: "Tu pedido #ORD-8754 está en camino", time: "Hace 2h", icon: "🚚" },
  { id: 2, type: "promo", msg: "¡20% off en toda la categoría Gaming!", time: "Hace 5h", icon: "🎯" },
  { id: 3, type: "message", msg: "Nuevo mensaje de TechStore Pro", time: "Ayer", icon: "💬" },
  { id: 4, type: "review", msg: "Dejá tu reseña del iPhone 15 Pro Max", time: "Ayer", icon: "⭐" },
];

const SELLER_STATS = [
  { label: "Ventas del mes", value: "$48,290", trend: "+18%", up: true },
  { label: "Pedidos activos", value: "127", trend: "+8", up: true },
  { label: "Calificación", value: "4.9★", trend: "Excelente", up: true },
  { label: "Visitas hoy", value: "3,421", trend: "+22%", up: true },
];

const CATEGORIES = ["Todos", "Electrónica", "Computadoras", "Audio", "TV & Video", "Calzado", "Gaming", "Tablets", "Hogar"];

function Stars({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "var(--color-text-secondary)", marginLeft: 4, fontSize: 12 }}>{rating}</span>
    </span>
  );
}

function Badge({ text, type = "default" }) {
  const colors = {
    default: { bg: "#f3f4f6", color: "#374151" },
    hot: { bg: "#fef3c7", color: "#92400e" },
    new: { bg: "#dbeafe", color: "#1e40af" },
    sale: { bg: "#d1fae5", color: "#065f46" },
    low: { bg: "#fee2e2", color: "#991b1b" },
  };
  const style = type === "hot" ? colors.hot : type === "new" ? colors.new : type === "sale" ? colors.sale : type === "low" ? colors.low : colors.default;
  return <span style={{ background: style.bg, color: style.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3 }}>{text}</span>;
}

function ProductCard({ product, onAdd, onFav, favorites, onView }) {
  const isFav = favorites.includes(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <div onClick={() => onView(product)} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ background: "var(--color-background-secondary)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, position: "relative" }}>
        {product.image}
        <button onClick={e => { e.stopPropagation(); onFav(product.id); }} style={{ position: "absolute", top: 10, right: 10, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          {isFav ? "❤️" : "🤍"}
        </button>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge text={product.badge} type={product.badge === "Agotándose" ? "low" : product.badge === "Nuevo" ? "new" : product.badge === "Oferta" || product.badge === "Hot Deal" ? "sale" : "hot"} />
        </div>
        {discount > 0 && <div style={{ position: "absolute", bottom: 10, left: 10, background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>-{discount}%</div>}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{product.category}</p>
        <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 6px", lineHeight: 1.3, color: "var(--color-text-primary)" }}>{product.name}</p>
        <Stars rating={product.rating} />
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 10px" }}>({product.reviews.toLocaleString()} reseñas) · {product.seller}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>${product.price.toLocaleString()}</span>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "line-through" }}>${product.originalPrice.toLocaleString()}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); onAdd(product); }} style={{ width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#333"}
          onMouseLeave={e => e.currentTarget.style.background = "#111"}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, cartCount, msgCount }) {
  const items = [
    { id: "home", icon: "🏪", label: "Inicio" },
    { id: "products", icon: "📦", label: "Productos" },
    { id: "cart", icon: "🛒", label: "Carrito", badge: cartCount },
    { id: "favorites", icon: "❤️", label: "Favoritos" },
    { id: "orders", icon: "📋", label: "Mis Pedidos" },
    { id: "messages", icon: "💬", label: "Mensajes", badge: msgCount },
    { id: "seller", icon: "🏬", label: "Panel Vendedor" },
    { id: "profile", icon: "👤", label: "Mi Perfil" },
  ];
  return (
    <div style={{ width: 220, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", padding: "20px 12px", gap: 4, flexShrink: 0 }}>
      <div style={{ padding: "12px 12px 24px", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "var(--color-text-primary)" }}>◆ Nexo</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>Marketplace Premium</div>
      </div>
      {items.map(item => (
        <button key={item.id} onClick={() => setView(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: view === item.id ? "var(--color-background-secondary)" : "transparent", cursor: "pointer", textAlign: "left", color: view === item.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: view === item.id ? 500 : 400, fontSize: 14, transition: "background 0.15s", position: "relative" }}
          onMouseEnter={e => { if (view !== item.id) e.currentTarget.style.background = "var(--color-background-secondary)"; }}
          onMouseLeave={e => { if (view !== item.id) e.currentTarget.style.background = "transparent"; }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {item.label}
          {item.badge > 0 && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{item.badge}</span>}
        </button>
      ))}
      <div style={{ marginTop: "auto", padding: "12px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>MA</div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>María A.</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Comprador Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeView({ setView, onAdd, onFav, favorites, onView }) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div style={{ padding: 28 }}>
      <div style={{ background: "linear-gradient(135deg, #111 0%, #333 100%)", borderRadius: 20, padding: "40px 48px", marginBottom: 32, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontSize: 120, opacity: 0.15 }}>◆</div>
        <p style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, margin: "0 0 12px", fontWeight: 500 }}>Bienvenida al futuro del comercio</p>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px", letterSpacing: -1, lineHeight: 1.2 }}>Descubrí productos<br />extraordinarios</h1>
        <p style={{ opacity: 0.75, margin: "0 0 28px", fontSize: 15 }}>Miles de vendedores verificados. Envíos seguros. Garantía total.</p>
        <button onClick={() => setView("products")} style={{ background: "#fff", color: "#111", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Explorar ahora →</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[{ icon: "🚀", title: "Envío Express", sub: "24-48 horas" }, { icon: "🛡️", title: "Compra Segura", sub: "Garantía total" }, { icon: "💳", title: "12 cuotas sin interés", sub: "Con todas las tarjetas" }, { icon: "↩️", title: "Devolución gratis", sub: "30 días sin preguntas" }].map(f => (
          <div key={f.title} style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{f.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "var(--color-text-primary)" }}>Más vendidos</h2>
        <button onClick={() => setView("products")} style={{ background: "transparent", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", color: "var(--color-text-primary)" }}>Ver todos →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {featured.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onFav={onFav} favorites={favorites} onView={onView} />)}
      </div>

      <div style={{ marginTop: 32, padding: "28px", background: "var(--color-background-secondary)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>Oferta del día</p>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "var(--color-text-primary)" }}>Samsung OLED 65" — 28% OFF</h3>
          <p style={{ color: "var(--color-text-secondary)", margin: "0 0 16px", fontSize: 14 }}>Terminan en 06:42:18 · Solo quedan 5 unidades</p>
          <button onClick={() => setView("products")} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Aprovechar oferta</button>
        </div>
        <span style={{ fontSize: 100 }}>📺</span>
      </div>
    </div>
  );
}

function ProductsView({ onAdd, onFav, favorites, onView }) {
  const [cat, setCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevancia");

  const filtered = PRODUCTS.filter(p =>
    (cat === "Todos" || p.category === cat) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => sort === "precio-asc" ? a.price - b.price : sort === "precio-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 16px", color: "var(--color-text-primary)" }}>Explorar productos</h2>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Buscar productos, marcas, categorías..." style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", fontSize: 14, color: "var(--color-text-primary)" }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "10px 16px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", fontSize: 14, cursor: "pointer", color: "var(--color-text-primary)" }}>
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="rating">Mejor calificados</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 16px", borderRadius: 20, border: cat === c ? "none" : "0.5px solid var(--color-border-tertiary)", background: cat === c ? "#111" : "var(--color-background-secondary)", color: cat === c ? "#fff" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontWeight: cat === c ? 500 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 16px" }}>{filtered.length} productos encontrados</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onFav={onFav} favorites={favorites} onView={onView} />)}
      </div>
    </div>
  );
}

function CartView({ cart, setCart, setView }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [step, setStep] = useState(1);
  const [ordered, setOrdered] = useState(false);

  if (ordered) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", color: "var(--color-text-primary)" }}>¡Pedido confirmado!</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 16, margin: "0 0 8px" }}>Tu número de pedido: <strong>#ORD-9001</strong></p>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 32px" }}>Recibirás un email de confirmación y actualizaciones por WhatsApp.</p>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, display: "inline-block", marginBottom: 32 }}>
        <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--color-text-secondary)" }}>Número de seguimiento</p>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--color-text-primary)" }}>AR778899001AR</p>
      </div>
      <br />
      <button onClick={() => { setCart([]); setOrdered(false); setStep(1); setView("home"); }} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Volver al inicio</button>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 12px", color: "var(--color-text-primary)" }}>Tu carrito está vacío</h2>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 32 }}>Explorá nuestros productos y encontrá algo que te guste.</p>
      <button onClick={() => setView("products")} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Explorar productos</button>
    </div>
  );

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        {["Carrito", "Envío", "Pago", "Confirmación"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? "#111" : "var(--color-background-secondary)", color: step > i ? "#fff" : "var(--color-text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, border: step === i + 1 ? "2px solid #111" : "none" }}>{step > i ? "✓" : i + 1}</div>
            <span style={{ fontSize: 13, color: step === i + 1 ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: step === i + 1 ? 500 : 400 }}>{s}</span>
            {i < 3 && <span style={{ color: "var(--color-border-tertiary)", fontSize: 18 }}>›</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        <div>
          {step === 1 && cart.map(item => (
            <div key={item.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 52, background: "var(--color-background-secondary)", borderRadius: 10, width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{item.name}</p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-secondary)" }}>{item.seller} · En stock</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ width: 28, height: 28, borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", cursor: "pointer", fontSize: 16, color: "var(--color-text-primary)" }}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center", color: "var(--color-text-primary)" }}>{item.qty}</span>
                  <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} style={{ width: 28, height: 28, borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", cursor: "pointer", fontSize: 16, color: "var(--color-text-primary)" }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "var(--color-text-primary)" }}>${(item.price * item.qty).toLocaleString()}</p>
                <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} style={{ fontSize: 12, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer" }}>Eliminar</button>
              </div>
            </div>
          ))}
          {step === 2 && (
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>Dirección de envío</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Nombre", "Apellido", "Email", "Teléfono", "Dirección", "Ciudad", "Provincia", "Código Postal"].map(field => (
                  <input key={field} placeholder={field} defaultValue={field === "Nombre" ? "María" : field === "Apellido" ? "Alvarez" : field === "Email" ? "maria@email.com" : ""} style={{ padding: "10px 14px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", fontSize: 14, color: "var(--color-text-primary)", gridColumn: ["Dirección", "Email"].includes(field) ? "span 2" : "auto" }} />
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>Método de pago</h3>
              {[{ id: "card", label: "💳 Tarjeta de crédito/débito", sub: "Visa, Mastercard, Amex" }, { id: "mp", label: "💙 Mercado Pago", sub: "Hasta 12 cuotas sin interés" }, { id: "transfer", label: "🏦 Transferencia bancaria", sub: "CBU / CVU" }].map(m => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="radio" name="payment" defaultChecked={m.id === "card"} style={{ accentColor: "#111" }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{m.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{m.sub}</p>
                  </div>
                </label>
              ))}
              {step === 3 && (
                <div style={{ marginTop: 16, padding: 16, background: "var(--color-background-secondary)", borderRadius: 10 }}>
                  <input placeholder="Número de tarjeta" defaultValue="4242 4242 4242 4242" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 14, marginBottom: 10, background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input placeholder="MM/AA" defaultValue="12/28" style={{ padding: "10px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
                    <input placeholder="CVV" defaultValue="123" style={{ padding: "10px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 24, height: "fit-content", position: "sticky", top: 20 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>Resumen del pedido</h3>
          {cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{i.name} x{i.qty}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>${(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", margin: "16px 0", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Subtotal</span>
              <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>${total.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Envío</span>
              <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 500 }}>Gratis</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Descuento cupón</span>
              <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>-$0</span>
            </div>
            <input placeholder="Código de cupón" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 13, marginTop: 8, background: "var(--color-background-secondary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)" }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>${total.toLocaleString()}</span>
          </div>
          <button onClick={() => { if (step < 3) setStep(s => s + 1); else { setStep(4); setOrdered(true); } }} style={{ width: "100%", padding: "13px", background: "#111", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {step === 1 ? "Continuar →" : step === 2 ? "Ir al pago →" : "Confirmar pago →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--color-text-secondary)", margin: "12px 0 0" }}>🔒 Pago 100% seguro · SSL encriptado</p>
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 24px", color: "var(--color-text-primary)" }}>Mis Pedidos</h2>
      {ORDERS.map(order => (
        <div key={order.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)" }}>{order.id}</p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{order.product} · {order.date}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, background: order.status === "Entregado" ? "#d1fae5" : order.status === "En camino" ? "#dbeafe" : "#fef3c7", color: order.status === "Entregado" ? "#065f46" : order.status === "En camino" ? "#1e40af" : "#92400e" }}>{order.status}</span>
              <p style={{ margin: "8px 0 0", fontSize: 17, fontWeight: 700, color: "var(--color-text-primary)" }}>${order.amount.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {["Pedido", "En preparación", "Enviado", "En camino", "Entregado"].map((s, i) => {
                const active = order.status === "Entregado" ? 5 : order.status === "En camino" ? 4 : order.status === "En preparación" ? 2 : 1;
                return (
                  <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < active ? "#111" : "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: i < active ? "#fff" : "var(--color-text-secondary)", fontSize: 13, marginBottom: 6 }}>{i < active ? "✓" : i + 1}</div>
                    <span style={{ fontSize: 10, color: i < active ? "var(--color-text-primary)" : "var(--color-text-secondary)", textAlign: "center", fontWeight: i < active ? 500 : 400 }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>Seguimiento: <strong style={{ color: "var(--color-text-primary)", fontFamily: "monospace" }}>{order.tracking}</strong></p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "7px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--color-text-primary)" }}>Ver factura</button>
              {order.status === "Entregado" && <button style={{ padding: "7px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--color-text-primary)" }}>Dejar reseña</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesView() {
  const [active, setActive] = useState(MESSAGES[0]);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { from: "them", text: "Hola! Tu pedido ya fue enviado hoy a las 14:30hs.", time: "10:23" },
    { from: "me", text: "Perfecto, muchas gracias! ¿Tienen número de seguimiento?", time: "10:25" },
    { from: "them", text: "Sí! AR123456789 por vía Correo Argentino.", time: "10:26" },
    { from: "me", text: "Genial, lo reviso ahora.", time: "10:28" },
  ]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden" }}>
      <div style={{ width: 280, borderRight: "0.5px solid var(--color-border-tertiary)", overflow: "auto" }}>
        <div style={{ padding: "20px 16px 12px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "var(--color-text-primary)" }}>Mensajes</h2>
          <input placeholder="Buscar conversación..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", fontSize: 13, background: "var(--color-background-secondary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
        </div>
        {MESSAGES.map(m => (
          <div key={m.id} onClick={() => setActive(m)} style={{ padding: "14px 16px", cursor: "pointer", background: active?.id === m.id ? "var(--color-background-secondary)" : "transparent", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{m.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: m.unread ? 600 : 400, color: "var(--color-text-primary)" }}>{m.from}</p>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.msg}</p>
            </div>
            {m.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>{active.avatar}</div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{active.from}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#22c55e" }}>● En línea</p>
          </div>
        </div>
        <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {chat.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: c.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: c.from === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: c.from === "me" ? "#111" : "var(--color-background-secondary)", color: c.from === "me" ? "#fff" : "var(--color-text-primary)", fontSize: 14, lineHeight: 1.5 }}>
                {c.text}
                <p style={{ margin: "4px 0 0", fontSize: 10, opacity: 0.6, textAlign: c.from === "me" ? "right" : "left" }}>{c.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 10 }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && msg.trim()) { setChat(c => [...c, { from: "me", text: msg.trim(), time: "ahora" }]); setMsg(""); } }} placeholder="Escribir mensaje..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", fontSize: 14, background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }} />
          <button onClick={() => { if (msg.trim()) { setChat(c => [...c, { from: "me", text: msg.trim(), time: "ahora" }]); setMsg(""); } }} style={{ padding: "10px 18px", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>→</button>
        </div>
      </div>
    </div>
  );
}

function SellerView() {
  const [tab, setTab] = useState("dashboard");
  const tabs = [{ id: "dashboard", label: "Dashboard" }, { id: "products", label: "Mis Productos" }, { id: "orders", label: "Pedidos" }, { id: "analytics", label: "Analítica" }];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 4px", color: "var(--color-text-primary)" }}>Panel del Vendedor</h2>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>TechStore Pro · Nivel Platinum ⭐</p>
        </div>
        <button style={{ background: "#111", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>+ Publicar producto</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", border: "none", borderBottom: tab === t.id ? "2px solid #111" : "2px solid transparent", background: "transparent", fontSize: 14, cursor: "pointer", color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: tab === t.id ? 500 : 400 }}>{t.label}</button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {SELLER_STATS.map(s => (
              <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "18px 20px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                <p style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)" }}>{s.value}</p>
                <span style={{ fontSize: 12, color: s.up ? "#22c55e" : "#ef4444", fontWeight: 500 }}>{s.up ? "↑" : "↓"} {s.trend}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>Últimos pedidos</h3>
              {[{ id: "#9832", buyer: "Carlos M.", product: "iPhone 15 Pro", amount: 1299, status: "Nuevo" }, { id: "#9831", buyer: "Laura G.", product: "MacBook Air", amount: 1099, status: "Enviado" }, { id: "#9830", buyer: "Diego R.", product: "AirPods Pro", amount: 249, status: "Entregado" }].map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{o.buyer} — {o.product}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>{o.id}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>${o.amount}</p>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: o.status === "Nuevo" ? "#dbeafe" : o.status === "Enviado" ? "#fef3c7" : "#d1fae5", color: o.status === "Nuevo" ? "#1e40af" : o.status === "Enviado" ? "#92400e" : "#065f46", fontWeight: 600 }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>Productos más vendidos</h3>
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <span style={{ fontSize: 18, width: 20, color: "#f59e0b", fontWeight: 700 }}>#{i + 1}</span>
                  <span style={{ fontSize: 28 }}>{p.image}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{p.name}</p>
                    <div style={{ background: "var(--color-background-secondary)", borderRadius: 20, height: 4, marginTop: 6 }}>
                      <div style={{ width: `${100 - i * 20}%`, height: "100%", background: "#111", borderRadius: 20 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>${p.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "products" && (
        <div>
          {PRODUCTS.slice(0, 5).map(p => (
            <div key={p.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 40, background: "var(--color-background-secondary)", width: 60, height: 60, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.image}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{p.category} · Stock: {p.stock} unidades · {p.reviews} vendidos</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "var(--color-text-primary)" }}>${p.price.toLocaleString()}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--color-text-primary)" }}>Editar</button>
                  <button style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#111", color: "#fff", fontSize: 12, cursor: "pointer" }}>Ver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 24, alignItems: "flex-end" }}>
            {[65, 48, 72, 55, 88, 76, 92].map((v, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>${v * 100}</span>
                <div style={{ height: v * 2, background: i === 6 ? "#111" : "var(--color-background-secondary)", borderRadius: "6px 6px 0 0", width: "100%", border: "0.5px solid var(--color-border-tertiary)" }} />
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{["L", "M", "X", "J", "V", "S", "D"][i]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[{ label: "Tasa de conversión", value: "3.8%", sub: "↑ 0.4% esta semana" }, { label: "Ticket promedio", value: "$412", sub: "↑ $28 vs semana pasada" }, { label: "Clientes nuevos", value: "84", sub: "↑ 12 nuevos esta semana" }].map(m => (
              <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 18 }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</p>
                <p style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)" }}>{m.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#22c55e" }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesView({ favorites, onAdd, onFav, onView }) {
  const favProducts = PRODUCTS.filter(p => favorites.includes(p.id));
  if (favProducts.length === 0) return (
    <div style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>❤️</div>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 12px", color: "var(--color-text-primary)" }}>Sin favoritos aún</h2>
      <p style={{ color: "var(--color-text-secondary)" }}>Guardá los productos que más te gusten.</p>
    </div>
  );
  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 24px", color: "var(--color-text-primary)" }}>Mis Favoritos ({favProducts.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {favProducts.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onFav={onFav} favorites={favorites} onView={onView} />)}
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div style={{ padding: 28, maxWidth: 640 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 28px", color: "var(--color-text-primary)" }}>Mi Perfil</h2>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>MA</div>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 600, color: "var(--color-text-primary)" }}>María Alvarez</h3>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: "var(--color-text-secondary)" }}>maria.alvarez@email.com</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge text="Comprador Pro" type="new" />
              <Badge text="Verificado ✓" type="sale" />
            </div>
          </div>
          <button style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--color-text-primary)" }}>Editar foto</button>
        </div>
        {[["Nombre completo", "María Alvarez"], ["Email", "maria.alvarez@email.com"], ["Teléfono", "+54 11 4567-8901"], ["Dirección", "Av. Corrientes 1234, CABA"], ["Fecha de nacimiento", "15/03/1990"]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[{ label: "Compras", value: "23" }, { label: "Reseñas", value: "18" }, { label: "Ahorrado", value: "$4,320" }].map(s => (
          <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 18, textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)" }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onAdd, onFav, favorites }) {
  const isFav = favorites.includes(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 20, width: "100%", maxWidth: 700, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, padding: 40, position: "relative" }}>
            {product.image}
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
          <div style={{ padding: 32 }}>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3, color: "var(--color-text-primary)" }}>{product.name}</h2>
            <Stars rating={product.rating} />
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "4px 0 16px" }}>{product.reviews.toLocaleString()} reseñas · {product.seller}</p>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 20px" }}>{product.description}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "var(--color-text-primary)" }}>${product.price.toLocaleString()}</span>
              <span style={{ fontSize: 16, color: "var(--color-text-secondary)", textDecoration: "line-through" }}>${product.originalPrice.toLocaleString()}</span>
              <Badge text={`-${discount}%`} type="sale" />
            </div>
            <p style={{ fontSize: 12, color: "#22c55e", margin: "0 0 20px", fontWeight: 500 }}>✓ Envío gratis · Stock: {product.stock} unidades</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button onClick={() => { onAdd(product); onClose(); }} style={{ flex: 1, padding: "13px", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Agregar al carrito</button>
              <button onClick={() => onFav(product.id)} style={{ padding: "13px 16px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, background: "transparent", cursor: "pointer", fontSize: 20 }}>{isFav ? "❤️" : "🤍"}</button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>{product.tags.map(t => <Badge key={t} text={t} />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifPanel({ onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, right: 0, width: 360, height: "100vh", background: "var(--color-background-primary)", borderLeft: "0.5px solid var(--color-border-tertiary)", zIndex: 900, padding: 24, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)" }}>Notificaciones</h3>
        <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-text-secondary)" }}>×</button>
      </div>
      {NOTIFICATIONS.map(n => (
        <div key={n.id} style={{ padding: "14px 16px", background: "var(--color-background-secondary)", borderRadius: 12, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "var(--color-text-primary)" }}>{n.msg}</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modal, setModal] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
  };

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(i => i !== id) : [...f, id]);
  const unreadMsgs = MESSAGES.filter(m => m.unread).length;

  const views = { home: <HomeView setView={setView} onAdd={addToCart} onFav={toggleFav} favorites={favorites} onView={setModal} />, products: <ProductsView onAdd={addToCart} onFav={toggleFav} favorites={favorites} onView={setModal} />, cart: <CartView cart={cart} setCart={setCart} setView={setView} />, favorites: <FavoritesView favorites={favorites} onAdd={addToCart} onFav={toggleFav} onView={setModal} />, orders: <OrdersView />, messages: <MessagesView />, seller: <SellerView />, profile: <ProfileView /> };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "system-ui, -apple-system, sans-serif", background: "var(--color-background-tertiary)" }}>
      <Sidebar view={view} setView={setView} cartCount={cart.reduce((s, i) => s + i.qty, 0)} msgCount={unreadMsgs} />
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "12px 28px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
          <button onClick={() => setShowNotif(s => !s)} style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "7px 14px", fontSize: 14, cursor: "pointer", position: "relative", color: "var(--color-text-primary)" }}>
            🔔 {NOTIFICATIONS.length > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />}
          </button>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Sistema operativo · v2.4.1
          </div>
        </div>
        {views[view]}
      </div>
      {modal && <ProductModal product={modal} onClose={() => setModal(null)} onAdd={addToCart} onFav={toggleFav} favorites={favorites} />}
      {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
    </div>
  );
}
