"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../../shared/CartContext";


export default function ProductInfoSection({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [screen, setScreen] = useState("Full HD");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    setProduct(null);
    setError("");
    if (!slug || slug === "undefined") {
      setError("Aucun produit sélectionné (slug manquant ou invalide).");
      return;
    }
    fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Produit introuvable.");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.imageUrl || "");
        }
      })
      .catch(() => setError("Erreur de chargement du produit."));
  }, [slug]);

  if (error) return <div className="text-red-600 font-bold">{error}</div>;
  if (!product) return <div className="text-gray-500">Chargement du produit...</div>;
  const images = product.images || (product.imageUrl ? [product.imageUrl] : []);

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: images[0] || "",
      source: "marketplace-global",
    });
  };

  return (
    <section className="w-full max-w-none mx-auto rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 mt-12 bg-yellow-50" style={{background: 'linear-gradient(120deg, #f7e1b5 0%, #fffbe6 100%)'}}>
      {/* Gallery */}
      <div className="flex md:w-1/2 w-full" style={{ minHeight: '420px' }}>
        {/* Miniatures à gauche */}
        <div className="flex flex-col gap-2 justify-center mr-4" style={{ height: '400px' }}>
          {images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt="thumb"
              className={`w-16 h-16 object-cover rounded cursor-pointer border ${selectedImage === img ? 'border-blue-500' : 'border-gray-200'}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        {/* Grande image à droite */}
        <div className="flex-1 flex items-center justify-center" style={{ height: '400px' }}>
          <img src={selectedImage} alt="Product" className="rounded-xl object-contain w-full max-w-md h-full border" />
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 text-xl">★</span>
          <span className="font-semibold text-gray-900">4.5</span>
          <span className="text-gray-900">· 154 orders</span>
        </div>
        <div className="text-gray-900 text-sm mb-2">
          <div><span className="font-semibold text-gray-900">Made in:</span> {product.madeIn}</div>
          <div><span className="font-semibold text-gray-900">Design:</span> {product.design}</div>
          <div><span className="font-semibold text-gray-900">Delivery:</span> {product.delivery}</div>
        </div>
        <hr className="my-2" />
        <div className="mb-2">
          <span className="font-semibold text-gray-900">Screen size:</span>
          <div className="flex gap-2 mt-1">
            {['Full HD', 'Standart', 'HD screen'].map(opt => (
              <button
                key={opt}
                className={`px-4 py-1 rounded border ${screen === opt ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-900 text-gray-900 border-gray-300'}`}
                onClick={() => setScreen(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2 flex items-center gap-4">
          <span className="font-semibold text-gray-900">Quantity:</span>
          <div className="flex items-center border rounded border-gray-300">
            <button className="px-2 py-1 text-gray-900" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span className="px-4 text-gray-900">{quantity}</span>
            <button className="px-2 py-1 text-gray-900" onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-4">Price<br /><span className="text-3xl text-gray-900">{product.price}</span></div>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <button className="bg-blue-100 text-blue-700 px-6 py-2 rounded font-semibold hover:bg-blue-200">Buy now</button>
          <button className="border p-2 rounded text-gray-500 hover:text-blue-600">♡</button>
        </div>
      </div>
    </section>
  );
}
