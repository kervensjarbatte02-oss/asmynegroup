"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  description?: string;
  status?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
  image?: string;
  storeName?: string;
  price?: number;
  slug?: string;
  published?: boolean;
  publishedAt?: string;
  variants?: string[];
};

type SellerProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  location: string;
  bio: string;
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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [profile, setProfile] = useState<SellerProfile>({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    location: "",
    bio: "",
  });
  const [sellerName, setSellerName] = useState("Nombre del vendedor");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSavedMessage, setProfileSavedMessage] = useState<string | null>(null);
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("No configurado");
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [otherSettings, setOtherSettings] = useState({
    notifyOrders: true,
    notifyMessages: true,
    accountVisible: true,
  });
  const [otherMessage, setOtherMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam && ["home", "produit", "produit-add", "order", "message", "setting"].includes(sectionParam)) {
      setSection(sectionParam);
    }

    if (sectionParam === "produit-add") {
      const productId = searchParams.get("productId");
      if (productId) {
        const foundProduct = products.find((product) => product._id === productId);
        if (foundProduct) {
          setSelectedProduct(foundProduct);
        }
      }
    }
  }, [searchParams, products]);

  const refreshProducts = async () => {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los productos.");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      setProductsError(err instanceof Error ? err.message : "Error desconocido.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const res = await fetch("/api/marketplace/orders", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los pedidos.");
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : "Error desconocido.");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    void loadOrders();
    void refreshProducts();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const res = await fetch("/api/account/profile", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "No se pudo cargar el perfil.");
        const profileData = data.profile ?? {};
        setProfile({
          name: profileData.name ?? "",
          email: profileData.email ?? "",
          phone: profileData.phone ?? "",
          city: profileData.city ?? "",
          country: profileData.country ?? "",
          location: profileData.location ?? "",
          bio: profileData.bio ?? "",
        });
        setSellerName(profileData.name?.trim() ? profileData.name : "Nombre del vendedor");
        setPaymentEmail(profileData.paymentEmail ?? profileData.email ?? "");
        setPaymentStatus(profileData.paymentEmail ? "Conectado" : "No configurado");
        setOtherSettings({
          notifyOrders: profileData.notifyOrders ?? true,
          notifyMessages: profileData.notifyMessages ?? true,
          accountVisible: profileData.accountVisible ?? true,
        });
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setProfileLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const saveProfile = async () => {
    setProfileSavedMessage(null);
    setProfileError(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo actualizar el perfil.");
      setProfileSavedMessage("Perfil actualizado con éxito.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Error desconocido.");
    }
  };

  const savePaymentSettings = async () => {
    setPaymentMessage(null);
    if (!paymentEmail.trim()) {
      setPaymentMessage("Veuillez saisir une adresse e-mail de paiement valide.");
      return;
    }

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar el método de pago.");
      setPaymentStatus("Conectado");
      setPaymentMessage("Tu correo de pago se ha guardado correctamente.");
    } catch (err) {
      setPaymentMessage(err instanceof Error ? err.message : "Ha ocurrido un error.");
      setPaymentStatus("Error");
    }
  };

  const saveOtherSettings = async () => {
    setOtherMessage(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otherSettings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron guardar las preferencias.");
      setOtherMessage("Tus preferencias se han guardado.");
    } catch (err) {
      setOtherMessage(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  };

  const logout = () => {
    document.cookie = "asmyne_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/services/marketplace-global/login";
  };

  const displayedProducts = useMemo(() => {
    if (!profile.name) return products;
    return products.filter((product) => product.storeName === profile.name || product.storeName === "Marketplace");
  }, [products, profile.name]);

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

  const closeProductForm = () => {
    setSelectedProduct(null);
    setSection("produit");
    router.push("/services/marketplace-global/dashboard");
  };

  const openAddProductPage = () => {
    setSelectedProduct(null);
    setSection("produit-add");
    router.push("/services/marketplace-global/dashboard?section=produit-add");
  };

  const openEditProductPage = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setSection("produit-add");
    router.push(`/services/marketplace-global/dashboard?section=produit-add&productId=${product._id}`);
  };

  const saveProduct = async (productData: {
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    status: string;
    images: string[];
    variants: string[];
  }) => {
    setIsSavingProduct(true);
    setProductsError(null);

    const payload = {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      stock: productData.quantity,
      status: productData.status,
      published: productData.status === "Active",
      imageUrl: productData.images?.[0] || "",
      images: productData.images,
      variants: productData.variants,
      storeName: selectedProduct?.storeName || profile.name || "Espace vendeur",
      slug: selectedProduct?.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };

    try {
      const endpoint = selectedProduct?._id ? `/api/products/${selectedProduct._id}` : "/api/products";
      const method = selectedProduct?._id ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar el producto.");

      await refreshProducts();
      closeProductForm();
    } catch (err) {
      setProductsError(err instanceof Error ? err.message : "Error al guardar el producto.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const publishProduct = async (productId: string) => {
    setProductsError(null);
    try {
      const res = await fetch(`/api/products/${productId}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo publicar el producto.");

      await refreshProducts();
    } catch (err) {
      setProductsError(err instanceof Error ? err.message : "Error al publicar el producto.");
    }
  };

  const deleteSelectedProducts = async () => {
    if (!selectedProductIds.length) return;
    if (!window.confirm(`¿Eliminar ${selectedProductIds.length} producto(s) seleccionado(s)?`)) {
      return;
    }

    setProductsError(null);
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedProductIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron eliminar los productos.");

      setSelectedProductIds([]);
      setActionsOpen(false);
      await refreshProducts();
    } catch (err) {
      setProductsError(err instanceof Error ? err.message : "Error al eliminar los productos.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-inter">
      <aside className="fixed left-0 top-0 w-60 bg-white border-r border-slate-200 flex flex-col h-screen z-20 shadow-sm">
        <div className="flex flex-col justify-center h-28 px-6 border-b border-slate-200">
          <span className="text-xl font-bold tracking-tight text-slate-900">Mon espace</span>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-lg font-bold">
              {sellerName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{sellerName}</p>
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
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition"
          >
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
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Cargando pedidos...</div>
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
                  <div className="flex flex-wrap items-center justify-end gap-3 relative">
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">Export</button>
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">Import</button>
                    {selectedProductIds.length > 0 && (
                      <button
                        onClick={deleteSelectedProducts}
                        className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition shadow-sm"
                      >
                        Supprimer ({selectedProductIds.length})
                      </button>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActionsOpen((prev) => !prev)}
                        className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                      >
                        <span>More actions</span>
                        <span className="ml-2 text-xs">▾</span>
                      </button>
                      {actionsOpen && (
                        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                          <button
                            type="button"
                            onClick={deleteSelectedProducts}
                            disabled={selectedProductIds.length === 0}
                            className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                          >
                            Supprimer les produits sélectionnés
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={openAddProductPage} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-sm">Add product</button>
                  </div>
                </div>
              </div>
              {loadingProducts ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Cargando productos...</div>
              ) : productsError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{productsError}</div>
              ) : (
                <div className="overflow-x-auto rounded-[32px] border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-[720px] w-full table-auto">
                    <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={displayedProducts.length > 0 && selectedProductIds.length === displayedProducts.length}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSelectedProductIds(checked ? displayedProducts.map((product) => product._id) : []);
                            }}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-2 py-2">Produit</th>
                        <th className="px-2 py-2">Statut</th>
                        <th className="px-2 py-2">Inventaire</th>
                        <th className="px-2 py-2">Catégorie</th>
                        <th className="px-2 py-2">Actions</th>
                        <th className="px-2 py-2">Vendor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {displayedProducts.map((product) => {
                        const displayStatus = product.published ? "Publié" : product.status || "Brouillon";
                        const badgeClass = product.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700";

                        return (
                          <tr
                            key={product._id ?? product.slug ?? product.name}
                            className="hover:bg-slate-50 cursor-pointer"
                            onClick={() => openEditProductPage(product)}
                          >
                            <td className="px-2 py-2">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(product._id)}
                                onClick={(event) => event.stopPropagation()}
                                onMouseDown={(event) => event.stopPropagation()}
                                onChange={(event) => {
                                  event.stopPropagation();
                                  const checked = event.target.checked;
                                  setSelectedProductIds((current) =>
                                    checked
                                      ? [...current, product._id].filter((value, index, self) => self.indexOf(value) === index)
                                      : current.filter((id) => id !== product._id)
                                  );
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-2 py-2 font-medium text-slate-900">{product.name}</td>
                            <td className="px-2 py-2">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                                {displayStatus}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-slate-500">{product.stock != null ? `${product.stock} en stock` : "N/A"}</td>
                            <td className="px-2 py-2 text-slate-500">{product.category || "Autres"}</td>
                            <td className="px-2 py-2 text-slate-500">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openEditProductPage(product);
                                  }}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                  Modifier
                                </button>
                                {!product.published ? (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      publishProduct(product._id);
                                    }}
                                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                  >
                                    Publier
                                  </button>
                                ) : (
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    Déjà publié
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-slate-500">{product.storeName || "Marketplace"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                    <span>1–{displayedProducts.length} sur {products.length}</span>
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
                  <button onClick={closeProductForm} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">Retour aux produits</button>
                </div>
              </div>
              <ProductForm
                product={selectedProduct ?? undefined}
                onCancel={closeProductForm}
                onSubmit={saveProduct}
                submitLabel={isSavingProduct ? "Enregistrement..." : selectedProduct ? "Mettre à jour" : "Créer produit"}
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
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">Cargando pedidos…</div>
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
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">Messages</h2>
                  <p className="text-slate-600">Discutez avec vos clients et suivez vos conversations marketplace.</p>
                </div>
                <Link
                  href="/services/marketplace-global/messages"
                  className="inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Ouvrir la messagerie
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Derniers messages</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">--</p>
                  <p className="mt-3 text-sm text-slate-500">Cette fonctionnalité est en cours d’intégration.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm text-slate-500">Notifications</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">À venir</p>
                  <p className="mt-3 text-sm text-slate-500">Préparez-vous à répondre rapidement aux clients.</p>
                </div>
              </div>
            </div>
          )}

          {section === "setting" && (
            <div className="w-full mt-4 space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm px-4 lg:px-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Paramètres</h2>
                <p className="text-slate-600">Modifiez vos informations, configurez vos paiements et adaptez votre boutique vendeur.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Informations profil</h3>
                  {profileLoading ? (
                    <p className="text-sm text-slate-500">Cargando información del perfil...</p>
                  ) : (
                    <div className="space-y-4">
                      {profileError && <p className="text-sm text-rose-600">{profileError}</p>}
                      {profileSavedMessage && <p className="text-sm text-emerald-600">{profileSavedMessage}</p>}
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Nom</label>
                        <input
                          value={profile.name}
                          onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                          placeholder="Nom du vendeur ou boutique"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                          value={profile.email}
                          onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Téléphone</label>
                        <input
                          value={profile.phone}
                          onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Ville / Pays</label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={profile.city}
                            onChange={(event) => setProfile({ ...profile, city: event.target.value })}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            placeholder="Paris"
                          />
                          <input
                            value={profile.country}
                            onChange={(event) => setProfile({ ...profile, country: event.target.value })}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                            placeholder="France"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Description de la boutique</label>
                        <textarea
                          value={profile.bio}
                          onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                          className="mt-2 w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                          placeholder="Présentez votre boutique et vos produits aux clients."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={saveProfile}
                        className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Enregistrer le profil
                      </button>
                    </div>
                  )}
                </section>

                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Configuration Paiement</h3>
                  <p className="text-sm text-slate-600 mb-4">Indiquez l’adresse de paiement à laquelle vous souhaitez recevoir les virements ou notifications.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email de paiement</label>
                      <input
                        value={paymentEmail}
                        onChange={(event) => setPaymentEmail(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        placeholder="paiement@votreboutique.com"
                      />
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="font-medium">Statut actuel</p>
                      <p>{paymentStatus}</p>
                    </div>
                    {paymentMessage && <p className="text-sm text-slate-700">{paymentMessage}</p>}
                    <button
                      type="button"
                      onClick={savePaymentSettings}
                      className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Enregistrer le paiement
                    </button>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="font-semibold">Conseil</p>
                      <p>Pour être payé rapidement, renseignez une adresse e-mail valide et activez la réception de notifications sur votre compte vendeur.</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Autres réglages</h3>
                  <p className="text-sm text-slate-600 mb-4">Choisissez vos préférences pour les notifications et la visibilité de votre boutique.</p>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={otherSettings.notifyOrders}
                        onChange={(event) => setOtherSettings({ ...otherSettings, notifyOrders: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <span className="text-sm text-slate-700">Notifications des nouvelles commandes</span>
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={otherSettings.notifyMessages}
                        onChange={(event) => setOtherSettings({ ...otherSettings, notifyMessages: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <span className="text-sm text-slate-700">Notifications des messages clients</span>
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={otherSettings.accountVisible}
                        onChange={(event) => setOtherSettings({ ...otherSettings, accountVisible: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <span className="text-sm text-slate-700">Boutique visible publiquement</span>
                    </label>
                    {otherMessage && <p className="text-sm text-slate-700">{otherMessage}</p>}
                    <button
                      type="button"
                      onClick={saveOtherSettings}
                      className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Enregistrer les préférences
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
