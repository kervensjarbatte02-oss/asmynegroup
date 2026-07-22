from pathlib import Path
base = Path('src/app/services/marketplace-global')
files = {
    base / 'page.tsx': '''"use client";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function MarketplaceGlobal() {
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<{ name: string }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les produits.");
        const productsData = Array.isArray(data.products) ? data.products : [];
        setProducts(productsData);
        const categories = Array.from(new Set(productsData.map((product) => product.category || product.collection || "Autres"))).map((name) => ({ name }));
        setCollections(categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(
    () => selectedCollection
      ? products.filter((product) => product.category === selectedCollection || product.collection === selectedCollection)
      : products,
    [products, selectedCollection]
  );

  const recommendedProducts = useMemo(() => products.slice(0, 3), [products]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        collections={collections}
        selectedCollection={selectedCollection}
        onCollectionChange={setSelectedCollection}
      />

      <section className="bg-gradient-to-r from-black to-indigo-500 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur le Marketplace Global</h1>
        <p className="text-lg md:text-xl mb-6">Découvrez les meilleures offres high-tech, smartphones, consoles, accessoires et plus encore !</p>
        <a href="#products" className="inline-block px-8 py-3 bg-white text-black font-bold rounded shadow hover:bg-gray-100">Voir les produits</a>
      </section>

      <section id="collections" className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-black mb-6">Collections</h2>
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Chargement des collections...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : collections.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Aucune collection trouvée.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {collections.map((col) => (
              <Link
                key={col.name}
                href={`/services/marketplace-global/collection/${encodeURIComponent(col.name)}`}
                className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-xl transition p-4 text-gray-800 cursor-pointer hover:bg-gray-100"
              >
                <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                  <span className="text-sm font-semibold text-slate-700">{col.name}</span>
                </div>
                <div className="text-base font-semibold mt-2 mb-1 text-center">{col.name}</div>
                <div className="text-sm font-medium text-center text-gray-600">{col.name}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-black mb-6">
          {selectedCollection ? `Produits de la collection : ${selectedCollection}` : "Tous les produits"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Chargement des produits...</div>
          ) : error ? (
            <div className="col-span-full rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-gray-500">Aucun produit trouvé pour cette sélection.</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product._id ?? product.slug ?? product.name} product={{ ...product, image: product.imageUrl || product.image }} />
            ))
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-xl font-bold text-black mb-4">Recommandés pour vous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommendedProducts.length === 0 ? (
            <div className="col-span-full text-gray-500">Aucun produit recommandé pour le moment.</div>
          ) : (
            recommendedProducts.map((product) => (
              <ProductCard key={product._id ?? product.slug ?? product.name} product={{ ...product, image: product.imageUrl || product.image }} />
            ))}
        </div>
      </section>

      <section className="w-full bg-gray-50 py-8 flex flex-col items-center mb-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 17.25V6.75A2.25 2.25 0 014.5 4.5h9.75a2.25 2.25 0 012.25 2.25v10.5m-14.25 0h14.25m-14.25 0a2.25 2.25 0 002.25 2.25h9.75a2.25 2.25 0 002.25-2.25m-14.25 0v-2.25m14.25 2.25v-2.25m0 0h2.25a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25h-2.25v5.25z" /></svg>
            <div className="font-bold text-lg text-gray-800">100% Genuine</div>
            <div className="text-gray-600 text-sm">Pour toutes commandes supérieures à 99€</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5-4.5v4.25l2.5 1.5" /></svg>
            <div className="font-bold text-lg text-gray-800">90 jours retour</div>
            <div className="text-gray-600 text-sm">Si le produit pose problème</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m12 0A2.25 2.25 0 0119.5 12.75v6A2.25 2.25 0 0117.25 21H6.75A2.25 2.25 0 014.5 18.75v-6A2.25 2.25 0 016.75 10.5h10.5z" /></svg>
            <div className="font-bold text-lg text-gray-800">Paiement sécurisé</div>
            <div className="text-gray-600 text-sm">100% sécurisé</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6m-6 3h3m9 0a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25H9.75A2.25 2.25 0 007.5 9.75v7.5A2.25 2.25 0 009.75 19.5h10.5z" /></svg>
            <div className="font-bold text-lg text-gray-800">Support 24/7</div>
            <div className="text-gray-600 text-sm">Toujours disponible</div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-black mb-6">FAQ</h2>
        <div className="space-y-4">
          <div className="bg-white rounded shadow p-4 text-gray-800">
            <div className="font-semibold mb-2 text-gray-900">Comment commander un produit ?</div>
            <div className="text-gray-700">Ajoutez le produit à votre panier puis validez votre commande en quelques clics.</div>
          </div>
          <div className="bg-white rounded shadow p-4 text-gray-800">
            <div className="font-semibold mb-2 text-gray-900">Quels sont les moyens de paiement acceptés ?</div>
            <div className="text-gray-700">Carte bancaire, PayPal, et paiement en plusieurs fois.</div>
          </div>
          <div className="bg-white rounded shadow p-4 text-gray-800">
            <div className="font-semibold mb-2 text-gray-900">Livrez-vous à l'international ?</div>
            <div className="text-gray-700">Oui, nous livrons dans de nombreux pays.</div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-gray-900 text-white pt-10 pb-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
          <div>
            <div className="font-extrabold text-2xl mb-2">Asmyne-group</div>
            <div className="text-gray-300 mb-4">Votre marketplace de confiance pour tout acheter et vendre facilement.</div>
            <a href="/services/marketplace-global/seller-login" className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-black transition">Devenir vendeur</a>
          </div>
          <div>
            <div className="font-bold mb-2">Navigation</div>
            <ul className="space-y-1 text-gray-300">
              <li><a href="#" className="hover:text-black transition">Accueil</a></li>
              <li><a href="#collections" className="hover:text-black transition">Collections</a></li>
              <li><a href="#products" className="hover:text-black transition">Produits</a></li>
              <li><a href="#faq" className="hover:text-black transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Contact</div>
            <div className="text-gray-300">Email : contact@asmyne-group.com</div>
            <div className="text-gray-300">Téléphone : +1 (809) 308-6370</div>
          </div>
          <div>
            <div className="font-bold mb-2">Suivez-nous</div>
            <div className="flex gap-4 mt-2 text-gray-300">
              <span>FB</span>
              <span>TW</span>
              <span>IG</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center pt-6 text-gray-400 text-sm">
          <div>© 2026 Asmyne-group. Tous droits réservés.</div>
          <div>Marketplace réalisé Jorgensen Kervens</div>
        </div>
      </footer>
    </div>
  );
}
''',
    base / 'collection' / '[name]' / 'page.tsx': '''"use client";
import Navbar from "../../Navbar";
import MarketplaceFooter from "../../MarketplaceFooter";
import ProductCard from "../../ProductCard";
import { useEffect, useMemo, useState } from "react";

export default function CollectionPage({ params }: { params: { name: string } }) {
  const collectionName = decodeURIComponent(params.name);
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les produits.");
        const productsData = Array.isArray(data.products) ? data.products : [];
        setProducts(productsData);
        const categories = Array.from(new Set(productsData.map((product) => product.category || product.collection || "Autres"))).map((name) => ({ name }));
        setCollections(categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === collectionName || product.collection === collectionName),
    [collectionName, products]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar collections={collections} />
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-black">Collection : {collectionName}</h1>
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Chargement des produits...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-500">Aucun produit dans cette collection.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id ?? prod.slug ?? prod.name} product={{ ...prod, image: prod.imageUrl || prod.image }} />
            ))}
          </div>
        )}
      </main>
      <MarketplaceFooter />
    </div>
  );
}
''',
    base / 'produit' / '[slug]' / 'page.tsx': '''"use client";

import Navbar from "../../Navbar";
import MarketplaceFooter from "../../MarketplaceFooter";
import { useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger le produit.");
        const products = Array.isArray(data.products) ? data.products : [];
        const found = products.find((p) => p.slug === params.slug || p.slug === decodeURIComponent(params.slug));
        if (!found) throw new Error("Produit introuvable.");
        setProduct(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-10 text-slate-600">Chargement du produit...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-10 text-red-600 font-semibold">{error || "Produit introuvable"}</div>
        <MarketplaceFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <img src={product.imageUrl || product.image || "/images/default-product.png"} alt={product.name} className="w-80 h-80 object-contain rounded-xl border mb-4 bg-white" />
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold mb-2 text-black">{product.name}</h1>
          <div className="text-2xl font-extrabold text-black mb-4">{product.price ? `${product.price} €` : "Prix indisponible"}</div>
          <div className="mb-4 text-gray-700">{product.description || "Description non disponible."}</div>
          <div className="mb-4 font-semibold text-green-600">{product.stock != null ? `${product.stock} en stock` : "Stock indisponible"}</div>
          <div className="flex gap-3 mb-6">
            <button className="px-6 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition">Ajouter au panier</button>
          </div>
          <div className="text-sm text-gray-500 mt-8">SKU: {product.sku || "-"}</div>
          <div className="text-sm text-gray-500">Catégories: {(product.categories || [product.category || ""]).join(", ")}</div>
          <div className="text-sm text-gray-500">Tag: {product.tag || "-"}</div>
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
''',
    base / 'dashboard' / 'page.tsx': '''"use client";

import { useEffect, useMemo, useState } from "react";
import { FaHome, FaBoxOpen, FaClipboardList, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
import ProductForm from "../ProductForm";

type MarketplaceOrderSummary = {
  id: string;
  createdAt: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  channel: string;
  itemsCount: number;
  grandTotal: number;
  buyerEmail?: string;
};

type MarketplaceProduct = {
  _id: string;
  name: string;
  status?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
  image?: string;
  storeName?: string;
  price?: number;
  slug?: string;
};

const SIDEBAR_LINKS = [
  { key: "home", label: "Accueil", icon: <FaHome size={18} /> },
  { key: "produit", label: "Produits", icon: <FaBoxOpen size={18} /> },
  { key: "order", label: "Commandes", icon: <FaClipboardList size={18} /> },
  { key: "message", label: "Messages", icon: <FaEnvelope size={18} /> },
  { key: "setting", label: "Paramètres", icon: <FaCog size={18} /> },
];

const formatCurrency = (amount: number) =>
  amount.toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
  });

export default function SellerDashboard() {
  const [section, setSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [orders, setOrders] = useState<MarketplaceOrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const res = await fetch("/api/marketplace/orders", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les commandes.");
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : "Erreur inconnue.");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les produits.");
        const productsData = Array.isArray(data.products) ? data.products : [];
        setProducts(productsData);
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : "Erreur inconnue.");
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    void loadOrders();
    void loadProducts();
  }, []);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal ?? 0), 0);
    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
    const fulfilledOrders = orders.filter((order) => order.status === "fulfilled" || order.fulfillmentStatus === "fulfilled").length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      paidOrders,
      fulfilledOrders,
      averageOrderValue,
      openOrders: totalOrders - fulfilledOrders,
    };
  }, [orders]);

  const openAddProductPage = () => {
    setSelectedProduct(null);
    setSection("produit-add");
  };

  const openEditProductPage = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setSection("produit-add");
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-inter">
      <aside className="fixed left-0 top-0 w-60 bg-white border-r border-slate-200 flex flex-col h-screen z-20 shadow-sm">
        <div className="flex flex-col justify-center h-28 px-6 border-b border-slate-200">
          <span className="text-xl font-bold tracking-tight text-slate-900">Mon espace</span>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-lg font-bold">N</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Nom Vendeur</p>
              <p className="text-xs text-slate-500">Vendeur marketplace</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.key}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-colors duration-200 text-left ${
                section === link.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
              }`}
              onClick={() => setSection(link.key)}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 lg:px-8 py-3 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Montant disponible :</span>
            <span className="text-blue-600 font-bold">{formatCurrency(metrics.totalRevenue)}</span>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition">
            <FaSignOutAlt /> Déconnexion
          </button>
        </header>

        <main className="flex-1 pt-0 pb-10 bg-slate-100">
          {section === "home" && (
            <div className="w-full space-y-6 px-4 lg:px-8 py-6">
              <div className="rounded-[32px] bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bienvenue sur votre espace vendeur</h1>
                    <p className="mt-2 text-sm text-slate-500">Vue d’ensemble en direct de vos ventes marketplace.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={openAddProductPage} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Ajouter un produit</button>
                    <button onClick={() => setSection("order")} className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Voir les commandes</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Chiffre d’affaires</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{formatCurrency(metrics.totalRevenue)}</p>
                  <p className="mt-3 text-sm text-slate-500">Total des ventes marketplace enregistrées.</p>
                </div>
                <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Commandes totales</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{metrics.totalOrders}</p>
                  <p className="mt-3 text-sm text-slate-500">Commandes créées depuis votre marketplace.</p>
                </div>
                <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Commandes payées</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{metrics.paidOrders}</p>
                  <p className="mt-3 text-sm text-slate-500">Paiements validés avec Stripe.</p>
                </div>
                <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Commandes en attente</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{metrics.openOrders}</p>
                  <p className="mt-3 text-sm text-slate-500">Commandes à traiter ou en cours de préparation.</p>
                </div>
              </div>

              <div className="rounded-[32px] bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Dernières commandes marketplace</h2>
                    <p className="mt-2 text-sm text-slate-500">Les commandes les plus récentes sont tirées en direct de MongoDB.</p>
                  </div>
                  <button onClick={() => setSection("order")} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">Voir toutes les commandes</button>
                </div>

                {loadingOrders ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Chargement des commandes...</div>
                ) : ordersError ? (
                  <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">Aucune commande marketplace n’a encore été enregistrée.</div>
                ) : (
                  <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200 bg-white">
                    <table className="min-w-[720px] w-full text-left text-sm text-slate-700">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Commande</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Articles</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Paiement</th>
                          <th className="px-4 py-3">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 font-semibold text-slate-900">#{order.id.slice(-6)}</td>
                            <td className="px-4 py-4 text-slate-600">{order.createdAt ? new Date(order.createdAt).toLocaleString("fr-FR") : "-"}</td>
                            <td className="px-4 py-4 text-slate-600">{order.itemsCount}</td>
                            <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(order.grandTotal)}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.status === "confirmed" || order.status === "fulfilled" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "produit" && (
            <div className="w-full space-y-6 mt-4 px-4 lg:px-8">
              <div className="rounded-[32px] bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-semibold text-slate-900">Produits</h2>
                    <p className="mt-2 text-sm text-slate-500">Gérez votre catalogue, suivez l’inventaire et publiez de nouveaux produits.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">Export</button>
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">Import</button>
                    <button className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                      <span>More actions</span>
                      <span className="ml-2 text-xs">▾</span>
                    </button>
                    <button onClick={openAddProductPage} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-sm">Add product</button>
                  </div>
                </div>
              </div>
              {loadingProducts ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Chargement des produits...</div>
              ) : productsError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{productsError}</div>
              ) : (
                <div className="overflow-x-auto rounded-[32px] border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-[720px] w-full table-auto">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2"><input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                        <th className="px-2 py-2">Product</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Inventory</th>
                        <th className="px-2 py-2">Category</th>
                        <th className="px-2 py-2">Channels</th>
                        <th className="px-2 py-2">Product type</th>
                        <th className="px-2 py-2">Vendor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {products.map((product) => (
                        <tr key={product._id ?? product.slug ?? product.name} className="hover:bg-slate-50 cursor-pointer" onClick={() => openEditProductPage(product)}>
                          <td className="px-2 py-2"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                          <td className="px-2 py-2 font-medium text-slate-900">{product.name}</td>
                          <td className="px-2 py-2"><span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{product.status || "Active"}</span></td>
                          <td className="px-2 py-2 text-slate-500">{product.stock != null ? `${product.stock} en stock` : "N/A"}</td>
                          <td className="px-2 py-2 text-slate-500">{product.category || "Autres"}</td>
                          <td className="px-2 py-2 text-slate-500">1</td>
                          <td className="px-2 py-2 text-slate-500">{product.category || "General"}</td>
                          <td className="px-2 py-2 text-slate-500">{product.storeName || "Marketplace"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                    <span>1–{products.length} of {products.length}</span>
                    <div className="flex items-center gap-2">
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-100">←</button>
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-100">→</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {section === "produit-add" && (
            <div className="w-full max-w-6xl mx-auto space-y-6 mt-4 px-4 sm:px-6">
              <div className="rounded-[32px] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{selectedProduct ? "Edit product" : "Add product"}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {selectedProduct
                        ? "Modifiez les informations du produit sélectionné."
                        : "Créez un nouveau produit dans votre catalogue."}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedProduct(null); setSection("produit"); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">Retour aux produits</button>
                </div>
              </div>
              <ProductForm
                product={selectedProduct ?? undefined}
                onCancel={() => { setSelectedProduct(null); setSection("produit"); }}
                onSubmit={() => { setSelectedProduct(null); setSection("produit"); }}
                submitLabel={selectedProduct ? "Update product" : "Create product"}
              />
            </div>
          )}

          {section === "order" && (
            <div className="w-full bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm mt-4 px-4 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Commandes</h2>
                  <p className="text-slate-600">Consultez et gérez vos commandes clients avec un tableau clair.</p>
                </div>
                <button
                  className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                  onClick={() => window.location.href = "/services/marketplace-global/orders"}
                >Voir toutes les commandes</button>
              </div>

              {loadingOrders ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Chargement des commandes…</div>
              ) : ordersError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">Aucune commande n’a encore été passée sur votre marketplace.</div>
              ) : (
                <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white">
                  <table className="min-w-[700px] w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-[10px] md:text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">N°</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Client</th>
                        <th className="px-4 py-3 hidden md:table-cell">Canal</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Paiement</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Statut</th>
                        <th className="px-4 py-3">Articles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{order.id.slice(-6)}</td>
                          <td className="px-4 py-4 text-slate-600">{order.createdAt ? new Date(order.createdAt).toLocaleString("fr-FR") : "-"}</td>
                          <td className="px-4 py-4 text-slate-600 hidden sm:table-cell">{order.buyerEmail ?? "-"}</td>
                          <td className="px-4 py-4 text-slate-600 hidden md:table-cell">{order.channel}</td>
                          <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(order.grandTotal)}</td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.status === "confirmed" || order.status === "fulfilled" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{order.itemsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "message" && (
            <div className="w-full bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm mt-4 px-4 lg:px-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Messages</h2>
              <p className="text-slate-600">Discutez avec vos clients et suivez vos conversations importantes.</p>
            </div>
          )}

          {section === "setting" && (
            <div className="w-full bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm mt-4 px-4 lg:px-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Paramètres</h2>
              <p className="text-slate-600">Modifiez vos informations et configurez vos préférences de compte.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
''',
    base / 'cart' / 'page.tsx': '''"use client";

import { useCart } from "@/app/shared/CartContext";
import Navbar from "../Navbar";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type PaymentFormProps = {
  items: CartItem[];
  total: number;
  buyerEmail: string;
  onSuccess: (orderId: string) => void;
  setError: (message: string) => void;
};

type StripeFactory = (publishableKey?: string | null) => unknown;
type StripeLoaderWindow = Window & { Stripe?: StripeFactory };

const loadStripe = async () => {
  if (typeof window === "undefined") return null;
  const win = window as StripeLoaderWindow;
  if (typeof win.Stripe === "function") {
    return win.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return new Promise<unknown>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      const loadedWindow = window as StripeLoaderWindow;
      if (typeof loadedWindow.Stripe === "function") {
        resolve(loadedWindow.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
      } else {
        reject(new Error("Stripe.js n'a pas pu être chargé."));
      }
    };
    script.onerror = () => reject(new Error("Stripe.js n'a pas pu être chargé."));
    document.body.appendChild(script);
  });
};

function MarketplacePaymentForm({ items, total, buyerEmail, onSuccess, setError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Le paiement n'est pas encore prêt. Réessayez dans un instant.");
      return;
    }

    if (!buyerEmail) {
      setError("Veuillez saisir votre email avant de payer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "usd",
          metadata: { email: buyerEmail, channel: "marketplace" },
        }),
      });

      const paymentData = await res.json();
      if (!res.ok || !paymentData.clientSecret) {
        throw new Error(paymentData.error || "Impossible de créer le paiement.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Impossible de lire les informations de carte.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: buyerEmail,
          },
        },
      });

      if (error) {
        throw new Error(error.message || "Le paiement a échoué.");
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error("Le paiement n'a pas pu être confirmé.");
      }

      const orderData = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: Number((item.price * item.quantity).toFixed(2)),
          })),
          paymentIntentId: paymentIntent.id,
          paymentStatus: "paid",
          channel: "marketplace",
          grandTotal: total,
        }),
      });

      const orderResult = await orderData.json();
      if (!orderData.ok) {
        throw new Error(orderResult.error || "Impossible de créer la commande.");
      }

      onSuccess(orderResult.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue pendant le paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Détails de paiement</label>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Nous utilisons Stripe pour traiter le paiement en toute sécurité.</p>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Carte bancaire</label>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <CardElement options={{ style: { base: { fontSize: "16px", color: "#111827", "::placeholder": { color: "#9ca3af" } } } }} />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Paiement en cours…" : `Payer ${total.toFixed(2)} $`}
          </button>
        </div>
      </div>
    </form>
  );
}

function MarketplaceStripeCheckout({ items, total, buyerEmail, onSuccess, setError }: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<unknown> | null>(null);

  useEffect(() => {
    void loadStripe().then(setStripePromise).catch((error) => {
      console.error(error);
      setError("Impossible de charger Stripe.");
    });
  }, [setError]);

  if (!stripePromise) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Chargement du formulaire de paiement...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <MarketplacePaymentForm items={items} total={total} buyerEmail={buyerEmail} onSuccess={onSuccess} setError={setError} />
    </Elements>
  );
}

export default function MarketplaceCartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promo, setPromo] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [collections, setCollections] = useState<{ name: string }[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCollections = async () => {
      setLoadingCollections(true);
      setCollectionsError(null);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les collections.");
        const products = Array.isArray(data.products) ? data.products : [];
        const categories = Array.from(new Set(products.map((product) => product.category || product.collection || "Autres"))).map((name) => ({ name }));
        setCollections(categories);
      } catch (err) {
        setCollectionsError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingCollections(false);
      }
    };
    void loadCollections();
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const discount = cart.length > 0 ? 5.4 : 0;
  const delivery = cart.length > 0 ? 9 : 0;
  const tax = cart.length > 0 ? 3.9 : 0;
  const grandTotal = useMemo(
    () => Number((subtotal - discount + delivery + tax).toFixed(2)),
    [subtotal, discount, delivery, tax]
  );

  const handleSuccess = (orderId: string) => {
    clearCart();
    router.push(`/services/marketplace-global/cart/confirmation?orderId=${orderId}`);
  };

  return (
    <>
      <Navbar collections={collections} />
      <div className="min-h-screen py-8" style={{ background: "linear-gradient(120deg, #eef2ff 0%, #f8fafc 100%)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 md:px-0">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1 text-gray-900">Marketplace cart</h1>
            <div className="text-gray-500 mb-4">{cart.length} produit{cart.length > 1 ? "s" : ""} dans votre panier marketplace</div>
            <div className="bg-white/95 rounded-xl shadow p-4 md:p-6 border border-gray-200">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-12">Votre panier marketplace est vide.</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="flex flex-col md:flex-row items-center md:items-stretch gap-4 py-4">
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full border border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-gray-900">{item.name}</div>
                        <div className="text-gray-500 text-sm">Vendu par Marketplace Global</div>
                      </div>
                      <div className="flex flex-col gap-2 items-end justify-between">
                        <div className="flex gap-2 items-center">
                          <label htmlFor={`qty-${item.id}`} className="text-sm font-medium text-gray-700">Qty:</label>
                          <select
                            id={`qty-${item.id}`}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            className="border rounded px-2 py-1 focus:ring focus:border-pink-400"
                          >
                            {[1, 2, 3, 4, 5].map((qty) => (
                              <option key={qty} value={qty}>{qty}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="text-sm text-red-600 hover:text-red-800"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTimes className="inline mr-1" /> Retirer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé de commande</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toFixed(2)} $</span></div>
                <div className="flex justify-between"><span>Remise</span><span>-{discount.toFixed(2)} $</span></div>
                <div className="flex justify-between"><span>Livraison</span><span>{delivery.toFixed(2)} $</span></div>
                <div className="flex justify-between"><span>Taxe</span><span>{tax.toFixed(2)} $</span></div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900"><span>Total</span><span>{grandTotal.toFixed(2)} $</span></div>
              </div>
              <div className="mt-6">
                <MarketplaceStripeCheckout
                  items={cart}
                  total={grandTotal}
                  buyerEmail={buyerEmail}
                  onSuccess={handleSuccess}
                  setError={setCheckoutError}
                />
              </div>
              {checkoutError ? <div className="mt-4 text-sm text-red-600">{checkoutError}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
''',
    base / 'ProductCard.tsx': '''"use client";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const slug = product.slug ||
    product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <Link href={`/services/marketplace-global/produit/${slug}`} className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl min-w-[220px] cursor-pointer group" prefetch={false}>
      <div className="w-36 h-36 bg-gray-100 mb-3 flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
        {product.imageUrl || product.image ? (
          <img src={product.imageUrl || product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-gray-400">Aucune image</span>
        )}
      </div>
      <div className="font-bold text-lg mb-1 text-gray-800 text-center truncate w-full" title={product.name}>{product.name}</div>
      <div className="text-black font-extrabold text-xl mb-3">{product.price ? `${product.price} €` : "Prix inconnu"}</div>
      <span className="mt-auto px-6 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition w-full text-center">Voir</span>
    </Link>
  );
}
''',
}

for path, content in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')
print('wrote', len(files), 'files')
