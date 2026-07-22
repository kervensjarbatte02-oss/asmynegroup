"use client";

import Navbar from "../../Navbar";
import MarketplaceFooter from "../../MarketplaceFooter";
import ProductCard from "../../ProductCard";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function CollectionClient({ collectionName }: { collectionName?: string }) {
  const params = useParams();
  const clientCollectionName = collectionName ?? (params?.name ? decodeURIComponent(String(params.name)) : "");
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
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los productos.");
        const productsData = Array.isArray(data.products) ? data.products : [];
        setProducts(productsData);
        const categoryNames = Array.from(
          new Set(productsData.map((product: any) => String(product.category || product.collection || "Autres")))
        ) as string[];
        const categories = categoryNames.map((name) => ({ name }));

        try {
          const cRes = await fetch("/api/marketplace/collections", { cache: "no-store" });
          if (cRes.ok) {
            const cData = await cRes.json();
            const cols = Array.isArray(cData.collections)
              ? cData.collections.map((c: any) => ({ name: c.title || c.name || String(c) }))
              : categories;
            setCollections(cols);
          } else {
            setCollections(categories);
          }
        } catch (err) {
          setCollections(categories);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [collectionName]);

  const filteredProducts = useMemo(
    () => {
      const name = clientCollectionName;
      return products.filter((product) => product.category === name || product.collection === name);
    },
    [clientCollectionName, products]
  );

  // Selection state for checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar collections={collections} />
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-black">Colección: {clientCollectionName || "(desconocida)"}</h1>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">{filteredProducts.length} producto(s)</div>
          <div className="text-sm text-gray-600">Seleccionados: {selectedIds.length}</div>
        </div>
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">Cargando productos...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-500">No hay productos en esta colección.</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id ?? prod.slug ?? prod.name}
                product={{ ...prod, image: prod.imageUrl || prod.image, id: prod._id ?? prod.slug ?? prod.name }}
                selectable={true}
                selected={selectedIds.includes(prod._id ?? prod.slug ?? prod.name)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </main>
      <MarketplaceFooter />
    </div>
  );
}
