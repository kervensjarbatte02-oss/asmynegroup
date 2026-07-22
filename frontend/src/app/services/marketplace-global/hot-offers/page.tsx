
"use client";
import Navbar from "../Navbar";
import Footer from "@/app/PageFooter";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

export default function HotOffersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/products?sort=price_asc&limit=24")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 md:px-0">
        <h1 className="text-2xl font-bold mt-8 mb-4 text-pink-600">Ofertas destacadas</h1>
        {loading ? (
          <div className="mt-12">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="mt-12 text-gray-500">No se encontró ningún producto.</div>
        ) : (
          <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4 mb-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
