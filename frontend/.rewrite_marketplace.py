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
'''
}
for path, content in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')
print('wrote', len(files), 'files')
