"use client";

import ProductForm from "../../services/marketplace-global/ProductForm";

const Sidebar = () => (
  <aside className="w-60 min-h-screen bg-slate-50 px-4 py-8 flex flex-col gap-4 border-r border-slate-200">
    <h2 className="text-xl font-bold mb-6">Tableau vendeur</h2>
    <nav className="flex flex-col gap-2 text-sm text-slate-700">
      <a href="/dashboard" className="hover:text-slate-900">Accueil</a>
      <a href="/produit" className="hover:text-slate-900 font-semibold">Produits</a>
      <a href="/order" className="hover:text-slate-900">Commandes</a>
      <a href="/messages" className="hover:text-slate-900">Messages</a>
      <a href="/profil" className="hover:text-slate-900">Profil</a>
    </nav>
  </aside>
);

const Navbar = () => (
  <header className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
    <h1 className="text-2xl font-bold text-slate-900">Modifier le produit</h1>
    <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition" onClick={() => window.history.back()}>
      Retour
    </button>
  </header>
);

const mockProduct = {
  title: "Short sleeve t-shirt",
  description: "Un t-shirt confortable et léger, parfait pour toutes les saisons.",
  category: "Clothing",
  price: "24.99",
  quantity: 12,
  status: "Active",
  media: null,
  variants: ["Small", "Medium", "Large"],
};

const ProductEditPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 py-6">
          <ProductForm
            product={mockProduct}
            onCancel={() => window.history.back()}
            submitLabel="Save product"
          />
        </main>
      </div>
    </div>
  );
};

export default ProductEditPage;
