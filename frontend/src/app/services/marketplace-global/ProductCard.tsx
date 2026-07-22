"use client";
import Link from "next/link";
import type { MouseEvent } from "react";

export default function ProductCard({ product, selectable, selected, onSelect }: { product: any, selectable?: boolean, selected?: boolean, onSelect?: (id: string, checked: boolean) => void }) {
  const slug = product.slug ||
    product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('input[type="checkbox"]') || target?.closest('label')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative">
      {selectable && (
        <label
          className="absolute top-3 left-3 z-10"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={!!selected}
            onChange={(e) => onSelect?.(product._id ?? product.id ?? product.slug ?? product.name, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-5 h-5"
          />
        </label>
      )}
      <Link
        href={`/services/marketplace-global/produit/${slug}`}
        onClick={handleLinkClick}
        className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl min-w-[220px] cursor-pointer group"
        prefetch={false}
      >
      <div className="w-36 h-36 bg-gray-100 mb-3 flex items-center justify-center rounded-lg overflow-hidden border border-gray-200">
        {product.images?.[0] || product.imageUrl || product.image ? (
          <img src={product.images?.[0] || product.imageUrl || product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-gray-400">Sin imagen</span>
        )}
      </div>
      <div className="font-bold text-lg mb-1 text-gray-800 text-center truncate w-full" title={product.name}>{product.name}</div>
      <div className="text-black font-extrabold text-xl mb-3">{product.price ? `${product.price} €` : "Precio no disponible"}</div>
      <span className="mt-auto px-6 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition w-full text-center">Ver</span>
    </Link>
    </div>
  );
}
