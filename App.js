import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  LayoutDashboard, Package, Boxes, Truck, ShoppingCart, History, BarChart3, Settings,
  Search, Bell, User, Plus, Minus, Pencil, Trash2, Eye, X, Tag,
  ArrowDownCircle, ArrowUpCircle, Wallet, CalendarDays, Flame, TrendingUp, TrendingDown,
  AlertTriangle, Moon, FileDown, FileSpreadsheet, Store, Coins, Percent, Palette,
  CloudUpload, Download, Globe, Check, RefreshCw, Phone,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

/* ============================================================
   SMARTSTOCK PRO — APPLICATION ASSEMBLÉE
   Fondations + Dashboard + Produits + Stock + Fournisseurs +
   Achats + Ventes + Rapports + Notifications (alertes) + Paramètres
   Tous les modules partagent le même état (produits, stock, etc.)
   ============================================================ */

const theme = {
  bgPrimary: "#0A0D12", bgCard: "#141A22", bgInput: "#1B2430",
  gold: "#D4AF37", goldLight: "#FFD86B", green: "#19C37D",
  steel: "#2A3441", danger: "#E74C3C", warning: "#F39C12", blue: "#3B9EFF",
  textPrimary: "#F5F7FA", textSecondary: "#AAB4C0",
};
const fontHead = { fontFamily: "'Space Grotesk', sans-serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };
const fontMono = { fontFamily: "'Roboto Mono', monospace" };

const TYPES = {
  critique: { label: "Stock critique", icon: AlertTriangle, color: theme.danger },
  vente: { label: "Forte vente", icon: Flame, color: theme.gold },
  dormant: { label: "Produit dormant", icon: Moon, color: theme.warning },
  entree: { label: "Entrée importante", icon: ArrowUpCircle, color: theme.blue },
};

/* ============================== COMPOSANTS DE BASE ============================== */

function Card({ children, style = {}, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-200 ${className}`}
      style={{ backgroundColor: theme.bgCard, border: "1px solid rgba(212,175,55,0.12)", ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(25,195,125,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,175,55,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </div>
  );
}

function Button({ children, variant = "primary", onClick, icon: Icon, small, disabled }) {
  const base = `flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${small ? "px-3 h-[36px] text-xs" : "px-4 h-[46px] text-sm"}`;
  const styles = {
    primary: { background: `linear-gradient(135deg, ${theme.gold}, #B8912A)`, color: "#0A0D12" },
    secondary: { backgroundColor: theme.steel, color: theme.textPrimary },
    danger: { backgroundColor: theme.danger, color: "#fff" },
    success: { backgroundColor: theme.green, color: "#0A0D12" },
    ghost: { backgroundColor: "transparent", color: theme.textSecondary },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={base}
      style={{ ...styles[variant], ...fontBody, border: variant === "ghost" ? `1px solid ${theme.steel}` : "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
      onMouseEnter={(e) => { if (disabled) return; if (variant === "primary" || variant === "success") e.currentTarget.style.boxShadow = `0 0 18px rgba(25,195,125,0.4)`; if (variant === "danger") e.currentTarget.style.boxShadow = `0 0 18px rgba(231,76,60,0.4)`; }}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {Icon && <Icon size={small ? 14 : 16} />}
      {children}
    </button>
  );
}

function Input({ placeholder, icon: Icon, value, onChange, type = "text", label }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{label}</label>}
      <div className="flex items-center gap-2 rounded-[10px] px-3 h-[46px]" style={{ backgroundColor: theme.bgInput, border: `1px solid ${focused ? theme.gold : theme.steel}`, boxShadow: focused ? `0 0 12px rgba(212,175,55,0.25)` : "none", transition: "all 200ms" }}>
        {Icon && <Icon size={16} color={theme.textSecondary} />}
        <input placeholder={placeholder} type={type} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="bg-transparent outline-none w-full text-sm" style={{ color: theme.textPrimary, ...fontBody }} />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{label}</label>}
      <div className="flex items-center gap-2 rounded-[10px] px-3 h-[46px]" style={{ backgroundColor: theme.bgInput, border: `1px solid ${theme.steel}` }}>
        {Icon && <Icon size={16} color={theme.textSecondary} />}
        <select value={value} onChange={onChange} className="bg-transparent outline-none w-full text-sm" style={{ color: theme.textPrimary, ...fontBody }}>
          {options.map((o) => <option key={o} value={o} style={{ backgroundColor: theme.bgCard }}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-11 h-6 rounded-full relative transition-all duration-200" style={{ backgroundColor: checked ? theme.green : theme.steel, border: "none", cursor: "pointer" }}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200" style={{ left: checked ? "22px" : "2px" }} />
    </button>
  );
}

function Badge({ status }) {
  const map = {
    ok: { label: "OK", color: theme.green, bg: "rgba(25,195,125,0.12)" },
    faible: { label: "Faible", color: theme.warning, bg: "rgba(243,156,18,0.12)" },
    rupture: { label: "Rupture", color: theme.danger, bg: "rgba(231,76,60,0.12)" },
    entree: { label: "Entrée", color: theme.green, bg: "rgba(25,195,125,0.12)" },
    sortie: { label: "Sortie", color: theme.gold, bg: "rgba(212,175,55,0.12)" },
  };
  const s = map[status];
  return <span className="px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: s.color, backgroundColor: s.bg, ...fontBody }}>{s.label}</span>;
}

function StatCard({ label, value, delta, positive, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(212,175,55,0.12)" }}>
          <Icon size={18} color={theme.gold} />
        </div>
        {delta && (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: positive ? theme.green : theme.danger, ...fontMono }}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: theme.textPrimary, ...fontMono }}>{value}</div>
      <div className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{label}</div>
    </Card>
  );
}

const statusOf = (stock, seuil) => (stock === 0 ? "rupture" : stock <= seuil ? "faible" : "ok");
const money = (n) => `${Math.round(n).toLocaleString()} F`;

/* ============================== LAYOUT ============================== */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "produits", label: "Produits", icon: Package },
  { key: "stock", label: "Stock", icon: Boxes },
  { key: "fournisseurs", label: "Fournisseurs", icon: Truck },
  { key: "achats", label: "Achats", icon: ShoppingCart },
  { key: "ventes", label: "Ventes", icon: History },
  { key: "rapports", label: "Rapports", icon: BarChart3 },
  { key: "parametres", label: "Paramètres", icon: Settings },
];

function Sidebar({ active, setActive }) {
  return (
    <div className="w-[280px] shrink-0 h-full flex flex-col py-6" style={{ backgroundColor: theme.bgCard, borderRight: "1px solid rgba(212,175,55,0.1)" }}>
      <div className="px-6 mb-8">
        <span className="text-xl font-bold" style={{ ...fontHead, color: theme.gold, textShadow: `0 0 16px rgba(212,175,55,0.4)` }}>
          SmartStock <span style={{ color: theme.goldLight }}>Pro</span>
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{
                background: isActive ? `linear-gradient(90deg, rgba(10,13,18,0), rgba(25,195,125,0.15))` : "transparent",
                color: isActive ? theme.gold : theme.textSecondary,
                ...fontBody, fontWeight: isActive ? 600 : 400, border: "none", cursor: "pointer", textAlign: "left",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(25,195,125,0.2)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <item.icon size={18} color={isActive ? theme.gold : theme.textSecondary} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function TopBar({ activeLabel, alertCount, query, setQuery }) {
  return (
    <div className="h-[70px] shrink-0 flex items-center justify-between px-6" style={{ backgroundColor: "rgba(10,13,18,0.7)", backdropFilter: "blur(10px)", borderBottom: `1px solid rgba(212,175,55,0.15)` }}>
      <span style={{ ...fontHead, color: theme.textPrimary }} className="font-bold text-lg">{activeLabel}</span>
      <div className="w-[400px] hidden md:block">
        <Input placeholder="Rechercher un produit, fournisseur..." icon={Search} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} color={theme.textSecondary} />
          {alertCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: theme.danger, color: "#fff", ...fontMono }}>
              {alertCount}
            </span>
          )}
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.steel }}>
          <User size={16} color={theme.textPrimary} />
        </div>
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  const T = TYPES[toast.type];
  useEffect(() => { const t = setTimeout(() => onClose(toast.id), 4000); return () => clearTimeout(t); }, [toast.id, onClose]);
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl w-80" style={{ backgroundColor: theme.bgCard, border: `1px solid ${T.color}`, boxShadow: `0 0 24px ${T.color}66` }}>
      <T.icon size={18} color={T.color} style={{ marginTop: 2, flexShrink: 0 }} />
      <div className="flex-1">
        <div className="text-xs font-semibold mb-0.5" style={{ color: T.color, ...fontBody }}>{T.label}</div>
        <div className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{toast.text}</div>
      </div>
      <X size={14} color={theme.textSecondary} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => onClose(toast.id)} />
    </div>
  );
}

/* ============================== DONNÉES INITIALES ============================== */

const INITIAL_CATEGORIES = ["Accessoires", "Audio", "Protection", "Informatique"];

const INITIAL_PRODUCTS = [
  { id: 1, nom: "Câble USB-C 1m", cat: "Accessoires", prixAchat: 2500, prixVente: 4500, stock: 128, seuil: 20, emplacement: "Étagère A1" },
  { id: 2, nom: "Chargeur rapide 20W", cat: "Accessoires", prixAchat: 6000, prixVente: 9000, stock: 14, seuil: 15, emplacement: "Étagère A2" },
  { id: 3, nom: "Écouteurs BT Pro", cat: "Audio", prixAchat: 14000, prixVente: 22000, stock: 0, seuil: 10, emplacement: "Dépôt B" },
  { id: 4, nom: "Coque silicone", cat: "Protection", prixAchat: 1200, prixVente: 3000, stock: 76, seuil: 20, emplacement: "Étagère A3" },
  { id: 5, nom: "Support téléphone", cat: "Accessoires", prixAchat: 2800, prixVente: 5500, stock: 41, seuil: 10, emplacement: "Étagère A1" },
  { id: 6, nom: "Souris sans fil", cat: "Informatique", prixAchat: 5000, prixVente: 8500, stock: 9, seuil: 10, emplacement: "Dépôt B" },
];

const INITIAL_SUPPLIERS = [
  { id: 1, nom: "Distri-Tech SARL", contact: "+225 07 00 00 01", produits: ["Câble USB-C 1m", "Chargeur rapide 20W"] },
  { id: 2, nom: "AudioPlus Import", contact: "+225 05 00 00 02", produits: ["Écouteurs BT Pro"] },
  { id: 3, nom: "Protec Mobile", contact: "+225 01 00 00 03", produits: ["Coque silicone", "Support téléphone"] },
];

const todayStr = new Date().toLocaleDateString("fr-FR");

const INITIAL_STOCK_HISTORY = [
  { id: 1, produit: "Câble USB-C 1m", type: "entree", qte: 50, date: "28/06/2026", detail: "Réapprovisionnement" },
  { id: 2, produit: "Écouteurs BT Pro", type: "sortie", qte: 12, date: "27/06/2026", detail: "Vente manuelle" },
  { id: 3, produit: "Chargeur rapide 20W", type: "sortie", qte: 6, date: "26/06/2026", detail: "Vente manuelle" },
];

const INITIAL_PURCHASES = [
  { id: 1, produit: "Câble USB-C 1m", fournisseur: "Distri-Tech SARL", qte: 50, prixTotal: 125000, date: "28/06/2026" },
  { id: 2, produit: "Écouteurs BT Pro", fournisseur: "AudioPlus Import", qte: 20, prixTotal: 280000, date: "22/06/2026" },
];

const INITIAL_SALES = [
  { id: 1, produit: "Câble USB-C 1m", qte: 3, prix: 4500, date: todayStr },
  { id: 2, produit: "Coque silicone", qte: 2, prix: 3000, date: todayStr },
  { id: 3, produit: "Écouteurs BT Pro", qte: 1, prix: 22000, date: "29/06/2026" },
  { id: 4, produit: "Chargeur rapide 20W", qte: 4, prix: 9000, date: "29/06/2026" },
];

const INITIAL_ALERTS = [
  { id: 1, type: "critique", text: "Écouteurs BT Pro — stock épuisé", date: "Il y a 2h" },
  { id: 2, type: "vente", text: "Câble USB-C 1m — ventes en hausse", date: "Il y a 4h" },
];

/* ============================== MODULE : DASHBOARD ============================== */

function DashboardModule({ products, sales, stockHistory, alerts }) {
  const [period, setPeriod] = useState("semaine");

  const stockTotal = products.reduce((a, p) => a + p.stock, 0);
  const valeurStock = products.reduce((a, p) => a + p.stock * p.prixAchat, 0);
  const rupture = products.filter((p) => p.stock === 0).length;
  const unitesVendues = sales.reduce((a, s) => a + s.qte, 0);

  const chartData = useMemo(() => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    return days.map((d) => ({
      label: d,
      entrees: stockHistory.filter((h) => h.type === "entree").length ? Math.floor(Math.random() * 40) + 10 : 0,
      sorties: stockHistory.filter((h) => h.type === "sortie").length ? Math.floor(Math.random() * 40) + 10 : 0,
    }));
  }, [stockHistory, period]);

  const recentProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5);
  const recentAlerts = alerts.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Stock total" value={stockTotal.toLocaleString()} delta="4.2%" positive icon={Boxes} />
        <StatCard label="Valeur du stock" value={money(valeurStock)} delta="2.1%" positive icon={TrendingUp} />
        <StatCard label="Produits en rupture" value={rupture} delta="—" positive={rupture === 0} icon={AlertTriangle} />
        <StatCard label="Unités vendues" value={unitesVendues} delta="6.8%" positive icon={Flame} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Mouvements de stock</h3>
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: theme.bgInput }}>
              {["jour", "semaine", "mois"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 rounded-md text-xs capitalize transition-all"
                  style={{ backgroundColor: period === p ? theme.gold : "transparent", color: period === p ? "#0A0D12" : theme.textSecondary, fontWeight: period === p ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(42,52,65,0.5)" vertical={false} />
                <XAxis dataKey="label" stroke={theme.textSecondary} tick={{ fontSize: 11, fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <YAxis stroke={theme.textSecondary} tick={{ fontSize: 11, fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.gold}`, borderRadius: 10, fontSize: 12 }} labelStyle={{ color: theme.textPrimary }} />
                <Line type="monotone" dataKey="entrees" stroke={theme.green} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sorties" stroke={theme.gold} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Alertes rapides</h3>
          <div className="flex flex-col gap-3">
            {recentAlerts.length === 0 && <p className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>Aucune alerte pour le moment.</p>}
            {recentAlerts.map((a) => {
              const T = TYPES[a.type];
              return (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.bgInput, borderLeft: `3px solid ${T.color}` }}>
                  <T.icon size={16} color={T.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{a.text}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Produits récents</h3>
        <div className="flex flex-col gap-2">
          {recentProducts.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between py-2.5 px-2 rounded-lg" style={{ borderBottom: i < recentProducts.length - 1 ? `1px solid rgba(42,52,65,0.5)` : "none" }}>
              <div>
                <div className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{p.nom}</div>
                <div className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{p.cat}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm" style={{ color: theme.textPrimary, ...fontMono }}>{p.prixVente.toLocaleString()} F</span>
                <span className="text-xs w-10 text-right" style={{ color: theme.textSecondary, ...fontMono }}>x{p.stock}</span>
                <Badge status={statusOf(p.stock, p.seuil)} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================== MODULE : PRODUITS ============================== */

function ProductModal({ categories, onClose, onSave }) {
  const [form, setForm] = useState({ nom: "", cat: categories[0], prixAchat: "", prixVente: "", stock: "", seuil: "", emplacement: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const handleSave = () => {
    if (!form.nom || !form.prixVente) return;
    onSave({ id: Date.now(), nom: form.nom, cat: form.cat, prixAchat: Number(form.prixAchat) || 0, prixVente: Number(form.prixVente) || 0, stock: Number(form.stock) || 0, seuil: Number(form.seuil) || 5, emplacement: form.emplacement || "—" });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(10,13,18,0.75)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.bgCard, border: `1px solid rgba(212,175,55,0.3)` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold text-lg">Nouveau produit</h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={theme.textSecondary} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nom du produit" value={form.nom} onChange={set("nom")} />
          <Select label="Catégorie" value={form.cat} onChange={set("cat")} options={categories} />
          <Input label="Prix d'achat (F)" type="number" value={form.prixAchat} onChange={set("prixAchat")} />
          <Input label="Prix de vente (F)" type="number" value={form.prixVente} onChange={set("prixVente")} />
          <Input label="Quantité initiale" type="number" value={form.stock} onChange={set("stock")} />
          <Input label="Seuil minimum" type="number" value={form.seuil} onChange={set("seuil")} />
          <Input label="Emplacement" value={form.emplacement} onChange={set("emplacement")} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="primary" icon={Plus} onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function ProduitsModule({ products, categories, addProduct, deleteProduct, addCategory, removeCategory, searchQuery }) {
  const [tab, setTab] = useState("liste");
  const [catFilter, setCatFilter] = useState("Toutes");
  const [newCat, setNewCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchQuery = p.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = catFilter === "Toutes" || p.cat === catFilter;
    return matchQuery && matchCat;
  });

  return (
    <>
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ backgroundColor: theme.bgInput }}>
        {[{ key: "liste", label: "Liste des produits" }, { key: "categories", label: "Catégories" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ backgroundColor: tab === t.key ? theme.gold : "transparent", color: tab === t.key ? "#0A0D12" : theme.textSecondary, fontWeight: tab === t.key ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "liste" ? (
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Liste des produits ({filtered.length})</h3>
            <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Ajouter un produit</Button>
          </div>
          <div className="w-full sm:w-56 mb-4">
            <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} options={["Toutes", ...categories]} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Nom", "Catégorie", "Prix vente", "Stock", "Statut", "Actions"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{p.nom}</td>
                    <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontBody }}>{p.cat}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.prixVente.toLocaleString()} F</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.stock}</td>
                    <td className="py-3 px-2"><Badge status={statusOf(p.stock, p.seuil)} /></td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <Eye size={15} color={theme.textSecondary} style={{ cursor: "pointer" }} />
                        <Pencil size={15} color={theme.gold} style={{ cursor: "pointer" }} />
                        <Trash2 size={15} color={theme.danger} style={{ cursor: "pointer" }} onClick={() => deleteProduct(p.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Gestion des catégories</h3>
          <div className="flex gap-3 mb-5 max-w-md">
            <Input placeholder="Nouvelle catégorie..." icon={Tag} value={newCat} onChange={(e) => setNewCat(e.target.value)} />
            <Button variant="primary" icon={Plus} onClick={() => { if (newCat.trim()) { addCategory(newCat.trim()); setNewCat(""); } }}>Ajouter</Button>
          </div>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bgInput }}>
                <div className="flex items-center gap-2">
                  <Tag size={14} color={theme.gold} />
                  <span className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{cat}</span>
                  <span className="text-xs" style={{ color: theme.textSecondary, ...fontMono }}>({products.filter((p) => p.cat === cat).length} produits)</span>
                </div>
                <Trash2 size={15} color={theme.danger} style={{ cursor: "pointer" }} onClick={() => removeCategory(cat)} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {modalOpen && <ProductModal categories={categories} onClose={() => setModalOpen(false)} onSave={(p) => { addProduct(p); setModalOpen(false); }} />}
    </>
  );
}

/* ============================== MODULE : STOCK ============================== */

function ProductSelect({ products, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>Produit</label>
      <select value={value} onChange={onChange} className="rounded-[10px] px-3 h-[46px] text-sm outline-none w-full" style={{ backgroundColor: theme.bgInput, border: `1px solid ${theme.steel}`, color: theme.textPrimary, ...fontBody }}>
        {products.map((p) => <option key={p.id} value={p.id}>{p.nom} (stock: {p.stock})</option>)}
      </select>
    </div>
  );
}

function StockModule({ products, stockHistory, applyMovement }) {
  const [tab, setTab] = useState("inventaire");
  const totalQty = products.reduce((a, p) => a + p.stock, 0);
  const totalValue = products.reduce((a, p) => a + p.stock * p.prixAchat, 0);

  return (
    <>
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit flex-wrap" style={{ backgroundColor: theme.bgInput }}>
        {[{ key: "inventaire", label: "Inventaire" }, { key: "entree", label: "Entrée de stock" }, { key: "sortie", label: "Sortie de stock" }, { key: "historique", label: "Historique" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ backgroundColor: tab === t.key ? theme.gold : "transparent", color: tab === t.key ? "#0A0D12" : theme.textSecondary, fontWeight: tab === t.key ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inventaire" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Quantité totale</div><div className="text-2xl font-bold" style={{ color: theme.textPrimary, ...fontMono }}>{totalQty.toLocaleString()}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Valeur estimée</div><div className="text-2xl font-bold" style={{ color: theme.gold, ...fontMono }}>{money(totalValue)}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Références</div><div className="text-2xl font-bold" style={{ color: theme.textPrimary, ...fontMono }}>{products.length}</div></Card>
          </div>
          <Card>
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Vue globale du stock</h3>
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Produit", "Catégorie", "Quantité", "Valeur estimée", "Statut"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{p.nom}</td>
                    <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontBody }}>{p.cat}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.stock}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{(p.stock * p.prixAchat).toLocaleString()} F</td>
                    <td className="py-3 px-2"><Badge status={statusOf(p.stock, p.seuil)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {(tab === "entree" || tab === "sortie") && (
        <MovementForm mode={tab} products={products} onSubmit={applyMovement} />
      )}

      {tab === "historique" && (
        <Card>
          <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Historique des mouvements</h3>
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Produit", "Type", "Quantité", "Détail", "Date"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
            <tbody>
              {stockHistory.map((h) => (
                <tr key={h.id} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                  <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{h.produit}</td>
                  <td className="py-3 px-2"><Badge status={h.type} /></td>
                  <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{h.type === "entree" ? "+" : "-"}{h.qte}</td>
                  <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontBody }}>{h.detail}</td>
                  <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontMono }}>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

function MovementForm({ mode, products, onSubmit }) {
  const isEntree = mode === "entree";
  const [produitId, setProduitId] = useState(products[0]?.id || "");
  const [qte, setQte] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [raison, setRaison] = useState("Vente manuelle");

  const handleSubmit = () => {
    const quantite = Number(qte);
    if (!produitId || !quantite || quantite <= 0) return;
    const produit = products.find((p) => p.id === Number(produitId));
    onSubmit({ produitId: Number(produitId), produitNom: produit?.nom, type: mode, qte: quantite, detail: isEntree ? (commentaire || "Réapprovisionnement") : raison });
    setQte(""); setCommentaire("");
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isEntree ? "rgba(25,195,125,0.12)" : "rgba(212,175,55,0.12)" }}>
          {isEntree ? <ArrowDownCircle size={20} color={theme.green} /> : <ArrowUpCircle size={20} color={theme.gold} />}
        </div>
        <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">{isEntree ? "Entrée de stock" : "Sortie de stock"}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <ProductSelect products={products} value={produitId} onChange={(e) => setProduitId(e.target.value)} />
        <Input label={isEntree ? "Quantité ajoutée" : "Quantité retirée"} type="number" value={qte} onChange={(e) => setQte(e.target.value)} />
        <Input label="Date" value={todayStr} onChange={() => {}} />
        {isEntree ? <Input label="Commentaire (optionnel)" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} /> : <Select label="Raison" value={raison} onChange={(e) => setRaison(e.target.value)} options={["Vente manuelle", "Perte", "Ajustement"]} />}
      </div>
      <div className="mt-5"><Button variant={isEntree ? "success" : "primary"} icon={isEntree ? Plus : Minus} onClick={handleSubmit}>{isEntree ? "Valider l'entrée" : "Valider la sortie"}</Button></div>
    </Card>
  );
}

/* ============================== MODULE : FOURNISSEURS ============================== */

function SupplierModal({ onClose, onSave }) {
  const [nom, setNom] = useState(""); const [contact, setContact] = useState(""); const [produits, setProduits] = useState("");
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(10,13,18,0.75)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: theme.bgCard, border: `1px solid rgba(212,175,55,0.3)` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold text-lg">Nouveau fournisseur</h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={theme.textSecondary} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Nom du fournisseur" value={nom} onChange={(e) => setNom(e.target.value)} />
          <Input label="Contact" icon={Phone} value={contact} onChange={(e) => setContact(e.target.value)} />
          <Input label="Produits fournis (séparés par une virgule)" value={produits} onChange={(e) => setProduits(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant="primary" icon={Plus} onClick={() => { if (nom.trim()) onSave({ id: Date.now(), nom, contact, produits: produits.split(",").map((p) => p.trim()).filter(Boolean) }); }}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function FournisseursModule({ suppliers, addSupplier, deleteSupplier }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Fournisseurs ({suppliers.length})</h3>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>Ajouter un fournisseur</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="p-4 rounded-xl" style={{ backgroundColor: theme.bgInput, border: `1px solid ${theme.steel}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-medium text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{s.nom}</div>
                <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: theme.textSecondary, ...fontMono }}><Phone size={12} /> {s.contact || "—"}</div>
              </div>
              <Trash2 size={14} color={theme.danger} style={{ cursor: "pointer" }} onClick={() => deleteSupplier(s.id)} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {s.produits.map((p, i) => <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: "rgba(212,175,55,0.1)", color: theme.gold, ...fontBody }}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && <SupplierModal onClose={() => setModalOpen(false)} onSave={(s) => { addSupplier(s); setModalOpen(false); }} />}
    </Card>
  );
}

/* ============================== MODULE : ACHATS ============================== */

function AchatsModule({ products, suppliers, purchases, addPurchase }) {
  const [tab, setTab] = useState("nouvel-achat");
  const [produit, setProduit] = useState(products[0]?.nom || "");
  const [fournisseur, setFournisseur] = useState(suppliers[0]?.nom || "");
  const [qte, setQte] = useState(""); const [prixTotal, setPrixTotal] = useState("");

  const totalDepenses = purchases.reduce((a, p) => a + p.prixTotal, 0);
  const monthlyStats = useMemo(() => {
    const map = {};
    purchases.forEach((p) => { const [, m] = p.date.split("/"); map[m] = (map[m] || 0) + p.prixTotal; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [purchases]);
  const moisLabel = (m) => ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][Number(m) - 1] || m;

  const handleSubmit = () => {
    const quantite = Number(qte); const total = Number(prixTotal);
    if (!quantite || !total) return;
    addPurchase({ id: Date.now(), produit, fournisseur, qte: quantite, prixTotal: total, date: todayStr });
    setQte(""); setPrixTotal(""); setTab("historique-achats");
  };

  return (
    <>
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit flex-wrap" style={{ backgroundColor: theme.bgInput }}>
        {[{ key: "nouvel-achat", label: "Nouvel achat" }, { key: "historique-achats", label: "Historique achats" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ backgroundColor: tab === t.key ? theme.gold : "transparent", color: tab === t.key ? "#0A0D12" : theme.textSecondary, fontWeight: tab === t.key ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "nouvel-achat" ? (
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(212,175,55,0.12)" }}><ShoppingCart size={20} color={theme.gold} /></div>
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Enregistrer un achat</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Select label="Produit acheté" value={produit} onChange={(e) => setProduit(e.target.value)} options={products.map((p) => p.nom)} />
            <Select label="Fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} options={suppliers.map((s) => s.nom)} />
            <Input label="Quantité" type="number" value={qte} onChange={(e) => setQte(e.target.value)} />
            <Input label="Prix total (F)" type="number" icon={Wallet} value={prixTotal} onChange={(e) => setPrixTotal(e.target.value)} />
            <Input label="Date" icon={CalendarDays} value={todayStr} onChange={() => {}} />
          </div>
          <div className="mt-5"><Button variant="primary" icon={Plus} onClick={handleSubmit}>Valider l'achat</Button></div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Total des dépenses</div><div className="text-2xl font-bold" style={{ color: theme.gold, ...fontMono }}>{money(totalDepenses)}</div></Card>
            <Card>
              <div className="text-xs mb-2" style={{ color: theme.textSecondary, ...fontBody }}>Statistiques mensuelles</div>
              <div className="flex flex-col gap-1.5">{monthlyStats.map(([m, total]) => <div key={m} className="flex justify-between text-sm"><span style={{ color: theme.textSecondary, ...fontBody }}>{moisLabel(m)}</span><span style={{ color: theme.textPrimary, ...fontMono }}>{total.toLocaleString()} F</span></div>)}</div>
            </Card>
          </div>
          <Card>
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Historique des achats</h3>
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Produit", "Fournisseur", "Quantité", "Prix total", "Date"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{p.produit}</td>
                    <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontBody }}>{p.fournisseur}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.qte}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.prixTotal.toLocaleString()} F</td>
                    <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontMono }}>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}

/* ============================== MODULE : VENTES ============================== */

function VentesModule({ products, sales, addSale }) {
  const [tab, setTab] = useState("nouvelle-vente");
  const [produitNom, setProduitNom] = useState(products[0]?.nom || "");
  const [qte, setQte] = useState("1");
  const [prix, setPrix] = useState(String(products[0]?.prixVente || 0));

  const handleProductChange = (nom) => {
    setProduitNom(nom);
    const p = products.find((p) => p.nom === nom);
    if (p) setPrix(String(p.prixVente));
  };

  const total = (Number(qte) || 0) * (Number(prix) || 0);

  const handleSubmit = () => {
    const quantite = Number(qte); const prixApplique = Number(prix);
    if (!quantite || !prixApplique) return;
    addSale({ id: Date.now(), produit: produitNom, qte: quantite, prix: prixApplique, date: todayStr });
    setQte("1"); setTab("historique");
  };

  const totalJournalier = sales.filter((s) => s.date === todayStr).reduce((a, s) => a + s.qte * s.prix, 0);
  const totalPeriode = sales.reduce((a, s) => a + s.qte * s.prix, 0);
  const topProduits = useMemo(() => {
    const map = {}; sales.forEach((s) => (map[s.produit] = (map[s.produit] || 0) + s.qte));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [sales]);

  return (
    <>
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ backgroundColor: theme.bgInput }}>
        {[{ key: "nouvelle-vente", label: "Nouvelle vente" }, { key: "historique", label: "Historique" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ backgroundColor: tab === t.key ? theme.gold : "transparent", color: tab === t.key ? "#0A0D12" : theme.textSecondary, fontWeight: tab === t.key ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "nouvelle-vente" ? (
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(25,195,125,0.12)" }}><ShoppingCart size={20} color={theme.green} /></div>
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Enregistrer une vente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Select label="Produit" value={produitNom} onChange={(e) => handleProductChange(e.target.value)} options={products.map((p) => p.nom)} />
            <Input label="Quantité vendue" type="number" value={qte} onChange={(e) => setQte(e.target.value)} />
            <Input label="Prix appliqué (F, par unité)" type="number" icon={Wallet} value={prix} onChange={(e) => setPrix(e.target.value)} />
            <Input label="Date" icon={CalendarDays} value={todayStr} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between mt-5 max-w-2xl">
            <div><div className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>Total de la vente</div><div className="text-xl font-bold" style={{ color: theme.gold, ...fontMono }}>{total.toLocaleString()} F</div></div>
            <Button variant="primary" icon={Plus} onClick={handleSubmit}>Enregistrer la vente</Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Total journalier</div><div className="text-2xl font-bold" style={{ color: theme.green, ...fontMono }}>{money(totalJournalier)}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Total (période)</div><div className="text-2xl font-bold" style={{ color: theme.gold, ...fontMono }}>{money(totalPeriode)}</div></Card>
            <Card>
              <div className="text-xs mb-2" style={{ color: theme.textSecondary, ...fontBody }}>Produits les plus vendus</div>
              <div className="flex flex-col gap-1.5">{topProduits.map(([nom, q], i) => <div key={nom} className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5" style={{ color: theme.textPrimary, ...fontBody }}>{i === 0 && <Flame size={13} color={theme.gold} />} {nom}</span><span style={{ color: theme.textSecondary, ...fontMono }}>x{q}</span></div>)}</div>
            </Card>
          </div>
          <Card>
            <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold mb-4">Historique des ventes</h3>
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Produit", "Quantité", "Prix appliqué", "Total", "Date"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{s.produit}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{s.qte}</td>
                    <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{s.prix.toLocaleString()} F</td>
                    <td className="py-3 px-2" style={{ color: theme.gold, ...fontMono }}>{(s.qte * s.prix).toLocaleString()} F</td>
                    <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontMono }}>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}

/* ============================== MODULE : RAPPORTS ============================== */

function RapportsModule({ products, sales }) {
  const [report, setReport] = useState("ventes-jour");
  const REPORTS = [
    { key: "ventes-jour", label: "Ventes journalières" },
    { key: "ventes-mois", label: "Ventes mensuelles" },
    { key: "rentables", label: "Produits rentables" },
    { key: "perte", label: "Produits en perte" },
    { key: "stock", label: "Stock & valeur" },
  ];

  const ventesJour = useMemo(() => {
    const map = {}; sales.forEach((s) => (map[s.date] = (map[s.date] || 0) + s.qte * s.prix));
    return Object.entries(map).slice(-7).map(([label, valeur]) => ({ label, valeur }));
  }, [sales]);

  const ventesMois = useMemo(() => {
    const map = {}; sales.forEach((s) => { const [, m] = s.date.split("/"); map[m] = (map[m] || 0) + s.qte * s.prix; });
    const noms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    return Object.entries(map).map(([m, valeur]) => ({ label: noms[Number(m) - 1] || m, valeur }));
  }, [sales]);

  const rentables = useMemo(() => {
    return products.map((p) => {
      const unites = sales.filter((s) => s.produit === p.nom).reduce((a, s) => a + s.qte, 0);
      const marge = p.prixVente - p.prixAchat;
      return { nom: p.nom, marge, unites, profit: marge * unites };
    }).sort((a, b) => b.profit - a.profit).slice(0, 5);
  }, [products, sales]);

  const enPerte = useMemo(() => {
    return products.filter((p) => sales.filter((s) => s.produit === p.nom).length === 0)
      .map((p) => ({ nom: p.nom, raison: "Aucune vente enregistrée — coût de stockage", perte: -Math.round(p.stock * p.prixAchat * 0.03) }));
  }, [products, sales]);

  const stockTotal = products.reduce((a, p) => a + p.stock, 0);
  const valeurStock = products.reduce((a, p) => a + p.stock * p.prixAchat, 0);

  const ExportBar = ({ label }) => (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      <h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">{label}</h3>
      <div className="flex gap-2"><Button variant="secondary" small icon={FileDown}>Export PDF</Button><Button variant="secondary" small icon={FileSpreadsheet}>Export Excel</Button></div>
    </div>
  );

  return (
    <>
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit flex-wrap" style={{ backgroundColor: theme.bgInput }}>
        {REPORTS.map((r) => (
          <button key={r.key} onClick={() => setReport(r.key)} className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ backgroundColor: report === r.key ? theme.gold : "transparent", color: report === r.key ? "#0A0D12" : theme.textSecondary, fontWeight: report === r.key ? 600 : 400, ...fontBody, border: "none", cursor: "pointer" }}>
            {r.label}
          </button>
        ))}
      </div>

      {(report === "ventes-jour" || report === "ventes-mois") && (
        <Card>
          <ExportBar label={report === "ventes-jour" ? "Ventes journalières (F CFA)" : "Ventes mensuelles (F CFA)"} />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={report === "ventes-jour" ? ventesJour : ventesMois} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(42,52,65,0.5)" vertical={false} />
                <XAxis dataKey="label" stroke={theme.textSecondary} tick={{ fontSize: 11, fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <YAxis stroke={theme.textSecondary} tick={{ fontSize: 11, fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.gold}`, borderRadius: 10, fontSize: 12 }} labelStyle={{ color: theme.textPrimary }} />
                <Bar dataKey="valeur" fill={theme.gold} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {report === "rentables" && (
        <Card>
          <ExportBar label="Produits rentables" />
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: `1px solid ${theme.steel}` }}>{["Produit", "Marge unitaire", "Unités vendues", "Profit total"].map((h) => <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: theme.textSecondary, ...fontBody }}>{h}</th>)}</tr></thead>
            <tbody>
              {rentables.map((p) => (
                <tr key={p.nom} style={{ borderBottom: `1px solid rgba(42,52,65,0.5)` }}>
                  <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontBody }}>{p.nom}</td>
                  <td className="py-3 px-2" style={{ color: theme.textSecondary, ...fontMono }}>{p.marge.toLocaleString()} F</td>
                  <td className="py-3 px-2" style={{ color: theme.textPrimary, ...fontMono }}>{p.unites}</td>
                  <td className="py-3 px-2 flex items-center gap-1.5" style={{ color: theme.green, ...fontMono }}><TrendingUp size={13} /> {p.profit.toLocaleString()} F</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {report === "perte" && (
        <Card>
          <ExportBar label="Produits en perte" />
          <div className="flex flex-col gap-3">
            {enPerte.length === 0 && <p className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>Aucun produit en perte actuellement.</p>}
            {enPerte.map((p) => (
              <div key={p.nom} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bgInput, borderLeft: `3px solid ${theme.danger}` }}>
                <div><div className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>{p.nom}</div><div className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{p.raison}</div></div>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: theme.danger, ...fontMono }}><TrendingDown size={13} /> {p.perte.toLocaleString()} F</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {report === "stock" && (
        <Card>
          <ExportBar label="Stock & valeur financière" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bgInput }}><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Stock total</div><div className="text-2xl font-bold" style={{ color: theme.textPrimary, ...fontMono }}>{stockTotal.toLocaleString()} unités</div></div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bgInput }}><div className="text-xs mb-1" style={{ color: theme.textSecondary, ...fontBody }}>Valeur financière</div><div className="text-2xl font-bold" style={{ color: theme.gold, ...fontMono }}>{money(valeurStock)}</div></div>
          </div>
        </Card>
      )}
    </>
  );
}

/* ============================== MODULE : PARAMÈTRES ============================== */

function ParametresModule({ settings, updateSettings }) {
  const [syncing, setSyncing] = useState(false);
  const handleSync = () => { setSyncing(true); setTimeout(() => setSyncing(false), 1200); };
  const swatches = [theme.bgPrimary, theme.bgCard, theme.gold, theme.green, theme.steel, theme.danger];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Card>
        <div className="flex items-center gap-3 mb-5"><Store size={18} color={theme.gold} /><h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Informations du magasin</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nom du magasin" value={settings.nomMagasin} onChange={(e) => updateSettings("nomMagasin", e.target.value)} />
          <Select label="Devise" icon={Coins} value={settings.devise} onChange={(e) => updateSettings("devise", e.target.value)} options={["Franc CFA (F)", "Euro (€)", "Dollar US ($)"]} />
          <Input label="Taux de taxe (%)" icon={Percent} value={settings.taxe} onChange={(e) => updateSettings("taxe", e.target.value)} />
          <Select label="Langue" icon={Globe} value={settings.langue} onChange={(e) => updateSettings("langue", e.target.value)} options={["Français", "English"]} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-5"><Palette size={18} color={theme.gold} /><h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Thème</h3></div>
        <p className="text-xs mb-4" style={{ color: theme.textSecondary, ...fontBody }}>Noir premium + vert métallique + argent — thème actif.</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {swatches.map((hex) => <div key={hex} className="w-full aspect-square rounded-lg" style={{ backgroundColor: hex, border: `1px solid ${theme.steel}` }} />)}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-5"><CloudUpload size={18} color={theme.gold} /><h3 style={{ ...fontHead, color: theme.textPrimary }} className="font-bold">Sauvegarde & export</h3></div>
        <div className="flex items-center justify-between p-3 rounded-lg mb-3" style={{ backgroundColor: theme.bgInput }}>
          <div><div className="text-sm" style={{ color: theme.textPrimary, ...fontBody }}>Sauvegarde cloud automatique</div><div className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>Synchronise vos données en temps réel</div></div>
          <Toggle checked={settings.cloudSync} onChange={(v) => updateSettings("cloudSync", v)} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg mb-4" style={{ backgroundColor: theme.bgInput }}>
          <div className="flex items-center gap-2">{settings.cloudSync ? <Check size={14} color={theme.green} /> : <RefreshCw size={14} color={theme.textSecondary} />}<span className="text-xs" style={{ color: theme.textSecondary, ...fontBody }}>{settings.cloudSync ? "Synchronisé" : "Désactivé"}</span></div>
          <Button variant="secondary" small icon={RefreshCw} onClick={handleSync}>{syncing ? "Synchronisation..." : "Synchroniser"}</Button>
        </div>
        <Button variant="secondary" icon={Download}>Exporter toutes les données</Button>
      </Card>

      <div className="flex justify-end"><Button variant="primary" icon={Check}>Enregistrer les paramètres</Button></div>
    </div>
  );
}

/* ============================== APP RACINE ============================== */

export default function SmartStockPro() {
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [stockHistory, setStockHistory] = useState(INITIAL_STOCK_HISTORY);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState({ nomMagasin: "SmartStock Boutique", devise: "Franc CFA (F)", taxe: "18", langue: "Français", cloudSync: true });

  const labels = { dashboard: "Dashboard", produits: "Produits", stock: "Stock", fournisseurs: "Fournisseurs", achats: "Achats", ventes: "Ventes", rapports: "Rapports", parametres: "Paramètres" };

  const closeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const pushAlert = useCallback((type, text) => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [{ id, type, text, date: "À l'instant" }, ...prev]);
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  /* ---- Actions partagées entre modules ---- */

  const addProduct = (p) => setProducts((prev) => [p, ...prev]);
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const addCategory = (cat) => !categories.includes(cat) && setCategories((prev) => [...prev, cat]);
  const removeCategory = (cat) => setCategories((prev) => prev.filter((c) => c !== cat));

  const applyMovement = ({ produitId, produitNom, type, qte, detail }) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== produitId) return p;
      const newStock = type === "entree" ? p.stock + qte : Math.max(0, p.stock - qte);
      if (newStock === 0) pushAlert("critique", `${p.nom} — stock épuisé`);
      else if (newStock <= p.seuil && p.stock > p.seuil) pushAlert("critique", `${p.nom} — stock faible (${newStock} restants)`);
      if (type === "entree" && qte >= 100) pushAlert("entree", `${p.nom} — entrée importante de ${qte} unités`);
      return { ...p, stock: newStock };
    }));
    setStockHistory((prev) => [{ id: Date.now(), produit: produitNom, type, qte, date: todayStr, detail }, ...prev]);
  };

  const addSupplier = (s) => setSuppliers((prev) => [s, ...prev]);
  const deleteSupplier = (id) => setSuppliers((prev) => prev.filter((s) => s.id !== id));

  const addPurchase = (purchase) => {
    setPurchases((prev) => [purchase, ...prev]);
    const produit = products.find((p) => p.nom === purchase.produit);
    if (produit) applyMovement({ produitId: produit.id, produitNom: produit.nom, type: "entree", qte: purchase.qte, detail: `Achat — ${purchase.fournisseur}` });
  };

  const addSale = (sale) => {
    setSales((prev) => [sale, ...prev]);
    const produit = products.find((p) => p.nom === sale.produit);
    if (produit) applyMovement({ produitId: produit.id, produitNom: produit.nom, type: "sortie", qte: sale.qte, detail: "Vente manuelle" });
  };

  const updateSettings = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="w-full h-screen flex" style={{ backgroundColor: theme.bgPrimary, ...fontBody }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');`}</style>

      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => <Toast key={t.id} toast={t} onClose={closeToast} />)}
      </div>

      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activeLabel={labels[active]} alertCount={alerts.length} query={query} setQuery={setQuery} />
        <div className="flex-1 overflow-y-auto p-6">
          {active === "dashboard" && <DashboardModule products={products} sales={sales} stockHistory={stockHistory} alerts={alerts} />}
          {active === "produits" && <ProduitsModule products={products} categories={categories} addProduct={addProduct} deleteProduct={deleteProduct} addCategory={addCategory} removeCategory={removeCategory} searchQuery={query} />}
          {active === "stock" && <StockModule products={products} stockHistory={stockHistory} applyMovement={applyMovement} />}
          {active === "fournisseurs" && <FournisseursModule suppliers={suppliers} addSupplier={addSupplier} deleteSupplier={deleteSupplier} />}
          {active === "achats" && <AchatsModule products={products} suppliers={suppliers} purchases={purchases} addPurchase={addPurchase} />}
          {active === "ventes" && <VentesModule products={products} sales={sales} addSale={addSale} />}
          {active === "rapports" && <RapportsModule products={products} sales={sales} />}
          {active === "parametres" && <ParametresModule settings={settings} updateSettings={updateSettings} />}
        </div>
      </div>
    </div>
  );
}
