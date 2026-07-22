"use client";

import { useEffect, useState } from "react";

const FALLBACK_CATEGORIES = ["Clothing", "Accessories", "Home", "Beauty"];
const STATUS_OPTIONS = ["Active", "Draft", "Archived"];

export default function ProductForm({
  product,
  onCancel,
  onSubmit,
  submitLabel = "Save product",
}: {
  product?: {
    name?: string;
    title?: string;
    description?: string;
    category?: string;
    price?: string | number;
    quantity?: number;
    status?: string;
    media?: string | null;
    imageUrl?: string;
    image?: string;
    images?: string[];
    variants?: string[];
  };
  onCancel?: () => void;
  onSubmit?: (data: {
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    status: string;
    images: string[];
    variants: string[];
  }) => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState(product?.name || product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [quantity, setQuantity] = useState(product?.quantity ?? 0);
  const [status, setStatus] = useState(product?.status || "Draft");
  const [images, setImages] = useState<string[]>(
    product?.images?.length
      ? product.images
      : product?.imageUrl
      ? [product.imageUrl]
      : product?.image
      ? [product.image]
      : []
  );
  const [variants, setVariants] = useState<string[]>(product?.variants || []);
  const [variantInput, setVariantInput] = useState("");
  const [error, setError] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(FALLBACK_CATEGORIES);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch("/api/marketplace/collections", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.collections)) {
          throw new Error(data?.error || "No se pudieron cargar las categorías.");
        }

        const categories = data.collections
          .map((item: any) => String(item.title || item.name || item).trim())
          .filter((name: string) => name.length > 0);

        const merged = Array.from(new Set([...(categories.length > 0 ? categories : FALLBACK_CATEGORIES), ...(category ? [category] : [])]));
        setCategoryOptions(merged.length > 0 ? merged : FALLBACK_CATEGORIES);
      } catch (err) {
        console.error("ProductForm category load error:", err);
        setCategoryOptions(Array.from(new Set([...FALLBACK_CATEGORIES, ...(category ? [category] : [])])));
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, [category]);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("No se pudo leer el archivo de imagen."));
        }
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo de imagen."));
      reader.readAsDataURL(file);
    });

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const urls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
        setImages((prev) => [...prev, ...urls]);
      } catch (err) {
        console.error("Error al leer las imágenes:", err);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (!variantInput.trim()) {
      return;
    }

    setVariants((prev) => [...prev, variantInput.trim()]);
    setVariantInput("");
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    setError("");
    onSubmit?.({
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price) || 0,
      quantity,
      status,
      images,
      variants,
    });
  };

  return (
    <form className="w-full max-w-6xl mx-auto space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Nom du produit</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Camiseta de manga corta"
              className="w-full rounded-[28px] bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-[28px] bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Elige una categoría</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del producto"
            className="w-full rounded-[28px] bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix</label>
          <div className="flex items-center gap-3 rounded-[28px] bg-slate-100 px-4 py-3">
            <span className="text-sm text-slate-700">$</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>
          <div className="rounded-[28px] bg-slate-100 px-4 py-5 text-center text-sm text-slate-500">
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="mx-auto" />
            <div className="mt-3 text-xs text-slate-400">Selecciona varias imágenes para el producto</div>
            {images.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <img src={img} alt={`Product ${idx + 1}`} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400">Aún no hay imágenes seleccionadas.</div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Quantité</label>
          <div className="rounded-[28px] bg-slate-100 px-4 py-3">
            <label className="block text-xs uppercase tracking-wide text-slate-400">Stock disponible</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2 w-full rounded-[24px] bg-white px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Variants</p>
            <p className="text-sm text-slate-500">Agrega opciones como talla o color</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              placeholder="Nueva opción"
              className="rounded-[24px] bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={handleAddVariant}
              className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Ajouter
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {variants.length > 0 ? (
            variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between rounded-[24px] bg-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">{variant}</span>
                <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Aún no hay opciones de variante.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-[28px] bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              Cancelar
            </button>
          )}
          <button type="submit" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
