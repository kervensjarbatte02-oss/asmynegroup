"use client";

import Navbar from "../../Navbar";
import MarketplaceFooter from "../../MarketplaceFooter";
import ProductCard from "../../ProductCard";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/shared/CartContext";
import { FaHeart, FaStar, FaFacebookF, FaInstagram, FaWhatsapp, FaPinterest, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const COLOR_SYNONYMS: Record<string, string> = {
  black: "#000000",
  noir: "#000000",
  gray: "#6b7280",
  gris: "#6b7280",
  grey: "#6b7280",
  white: "#ffffff",
  blanc: "#ffffff",
  rojo: "#dc2626",
  red: "#dc2626",
  rouge: "#dc2626",
  azul: "#2563eb",
  blue: "#2563eb",
  bleu: "#2563eb",
  verde: "#16a34a",
  green: "#16a34a",
  jaune: "#f59e0b",
  yellow: "#f59e0b",
  rose: "#ec4899",
  pink: "#ec4899",
  orange: "#f97316",
  violet: "#8b5cf6",
  purple: "#8b5cf6",
  marron: "#7c3aed",
  brown: "#7c3aed",
  beige: "#d1c4b9",
  cyan: "#06b6d4",
};

const SIZE_KEYWORDS = new Set([
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "xxxl",
  "xxxl",
  "small",
  "medium",
  "large",
  "extra small",
  "extra large",
  "petit",
  "moyen",
  "grand",
  "très grand",
  "tres grand",
  "grande",
  "grandes",
  "taille unique",
]);

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function isColorVariant(value: string) {
  const normalized = normalizeValue(value);
  return (
    COLOR_SYNONYMS.hasOwnProperty(normalized) ||
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized)
  );
}

function getColorCode(value: string) {
  const normalized = normalizeValue(value);
  return COLOR_SYNONYMS[normalized] || value;
}

function isSizeVariant(value: string) {
  const normalized = normalizeValue(value);
  return (
    SIZE_KEYWORDS.has(normalized) ||
    /^[0-9]+(cm|mm|in|inch|e|eu?)?$/i.test(normalized) ||
    /^[xyz]+l?$/.test(normalized)
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("/images/default-product.png");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Imposible cargar el producto.");
        const found = data.product ?? null;
        if (!found) throw new Error("Producto no encontrado.");
        setProduct(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const validImages = Array.isArray(product.images)
      ? product.images.filter((image: string) => typeof image === "string" && image.trim())
      : [];
    const imageList = validImages.length
      ? validImages
      : product.imageUrl?.trim()
      ? [product.imageUrl.trim()]
      : [];

    setSelectedImage(imageList[0] || "/images/default-product.png");

    const variants = Array.isArray(product.variants)
      ? product.variants.map((variant: any) => String(variant)).map((variant: string) => variant.trim()).filter(Boolean)
      : [];
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    } else {
      setSelectedVariant("");
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const category = product.category || (Array.isArray(product.categories) ? product.categories[0] : null);
    const tags = [product.tag]
      .concat(Array.isArray(product.tags) ? product.tags : [])
      .filter(Boolean);

    fetch("/api/marketplace/products?limit=24", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("No fue posible cargar las recomendaciones.");
        const data = await res.json();
        return data.products || data.items || data || [];
      })
      .then((products: any[]) => {
        const similar = products
          .filter((p: any) => p._id !== product._id && p.slug !== slug)
          .filter((p: any) => {
            const sameCategory = category && (p.category === category || (Array.isArray(p.categories) && p.categories.includes(category)));
            const sameTag = tags.length > 0 && ((p.tag && tags.includes(p.tag)) || (Array.isArray(p.tags) && p.tags.some((tag: string) => tags.includes(tag))));
            return sameCategory || sameTag;
          });

        if (similar.length > 0) {
          setRecommendedProducts(similar.slice(0, 4));
          return;
        }

        setRecommendedProducts(products.filter((p: any) => p._id !== product._id && p.slug !== slug).slice(0, 4));
      })
      .catch(() => setRecommendedProducts([]));
  }, [product, slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-10 text-slate-600">Cargando el producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-10 text-red-600 font-semibold">{error || "Producto no encontrado."}</div>
        <MarketplaceFooter />
      </div>
    );
  }

  const sellerId = product.vendorId || product.userId || product.sellerId || null;
  const contactSellerMessage = `Hola, me gustaría saber más sobre tu producto ${product.name}.`;
  const contactSellerUrl = sellerId
    ? `/services/marketplace-global/messages?recipientId=${encodeURIComponent(sellerId)}&message=${encodeURIComponent(contactSellerMessage)}`
    : null;

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter((image: string) => typeof image === "string" && image.trim())
    : product.imageUrl?.trim()
    ? [product.imageUrl.trim()]
    : ["/images/default-product.png"];

  const variantOptions: string[] = Array.isArray(product.variants)
    ? product.variants.map((variant: any) => String(variant)).map((variant: string) => variant.trim()).filter(Boolean)
    : [];
  const hasVariants = variantOptions.length > 0;
  const onlyColorVariants = hasVariants && variantOptions.every(isColorVariant);
  const onlySizeVariants = hasVariants && !onlyColorVariants && variantOptions.every(isSizeVariant);
  const variantLabel = onlyColorVariants ? "Color" : onlySizeVariants ? "Size" : "Option";

  const features: string[] = Array.isArray(product.features)
    ? product.features
    : product.description
    ? product.description.split(". ").filter(Boolean).slice(0, 4)
    : [];

  const categories = Array.isArray(product.categories)
    ? product.categories
    : product.category
    ? [product.category]
    : [];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: Number(product.price ?? 0),
      quantity,
      image: selectedImage,
      sellerId: sellerId ?? undefined,
      source: "marketplace-global",
      variant: selectedVariant || undefined,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/services/marketplace-global/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full px-4 py-20">
        <div className="w-full max-w-none grid grid-cols-1 gap-8">
          <section className="w-full rounded-[32px] bg-white p-6 shadow-sm border border-slate-200 min-h-[calc(100vh-8rem)]">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="rounded-[32px] border border-slate-200 overflow-hidden bg-slate-100">
                  <img src={selectedImage} alt={product.name} className="w-full h-[520px] object-contain bg-white" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`rounded-3xl overflow-hidden border ${selectedImage === image ? "border-blue-500" : "border-slate-200"}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image} alt={`Miniature ${index + 1}`} className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="inline-flex items-center gap-1 text-amber-500">
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                      </div>
                      <span className="text-slate-400">(3 avis)</span>
                    </div>
                  </div>

                  <div className="mt-6 text-3xl font-extrabold text-slate-900">{product.price ? `${product.price} €` : "Precio no disponible"}</div>

                  <div className="mt-6 text-slate-600 space-y-2">
                    {features.slice(0, 4).map((feature, idx) => (
                      <p key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-900" />
                        <span>{feature.trim().replace(/\.$/, "")}</span>
                      </p>
                    ))}
                  </div>

                  {hasVariants && (
                    <div className="mt-6">
                      <div className="text-sm font-semibold text-slate-900 mb-3">{variantLabel}:</div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {variantOptions.map((variant) => (
                          <button
                            key={variant}
                            type="button"
                            aria-label={variant}
                            className={`transition ${
                              selectedVariant === variant
                                ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:shadow-sm"
                            } ${onlyColorVariants ? "h-14 w-14 rounded-full p-0" : "min-w-[5rem] rounded-2xl px-5 py-3 text-sm font-semibold"}`}
                            onClick={() => setSelectedVariant(variant)}
                            style={onlyColorVariants ? { backgroundColor: getColorCode(variant) } : undefined}
                          >
                            {!onlyColorVariants ? variant : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-4 sm:items-center">
                    <div className="flex items-center border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        className="px-5 py-3 text-slate-700 hover:bg-slate-100"
                        onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                      >
                        -
                      </button>
                      <div className="min-w-[3.5rem] text-center text-slate-900 font-semibold text-lg">{quantity}</div>
                      <button
                        type="button"
                        className="px-5 py-3 text-slate-700 hover:bg-slate-100"
                        onClick={() => setQuantity((qty) => qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto rounded-full bg-gradient-to-r from-cyan-700 via-sky-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-cyan-200/30 hover:brightness-105 transition"
                      >
                        Añadir al carrito
                      </button>
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full sm:w-auto rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-500/20 hover:bg-slate-900 transition"
                      >
                        Comprar ahora
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                    <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 hover:bg-slate-100">
                      <FaHeart /> Añadir a favoritos
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 hover:bg-slate-100">
                      <FaLink /> Comparar
                    </button>
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-900">{product.stock > 0 ? "Disponible" : "Agotado"}</span>
                      <span className="text-slate-500">SKU: {product.sku || "-"}</span>
                    </div>
                    <div className="mt-3 text-slate-500">Categoría: {categories.join(", ") || "-"}</div>
                    <div className="mt-2 text-slate-500">Etiqueta: {product.tag || "-"}</div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-900 mb-3">Compartir</div>
                    <div className="flex flex-wrap gap-3 text-slate-600">
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition" type="button" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                        <FaLink />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1877F2] hover:bg-slate-100 transition" type="button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank") }>
                        <FaFacebookF />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1DA1F2] hover:bg-slate-100 transition" type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank") }>
                        <FaXTwitter />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#E4405F] hover:bg-slate-100 transition" type="button" onClick={() => window.open(`https://www.instagram.com/`, "_blank") }>
                        <FaInstagram />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#25D366] hover:bg-slate-100 transition" type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${shareUrl}`)}`, "_blank") }>
                        <FaWhatsapp />
                      </button>
                      <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#E60023] hover:bg-slate-100 transition" type="button" onClick={() => window.open(`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(product.name)}`, "_blank") }>
                        <FaPinterest />
                      </button>
                    </div>
                  </div>

                  {!contactSellerUrl && (
                    <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      Vendedor no disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <section className="w-full px-4 pb-16 bg-slate-50">
        <div className="w-full max-w-none grid grid-cols-1 gap-6">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Productos similares</h2>
            <p className="text-slate-600 mb-8">También te podrían gustar estos productos similares.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">No hay productos recomendados disponibles en este momento.</div>
              ) : (
                recommendedProducts.map((recommendedProduct) => (
                  <ProductCard key={recommendedProduct._id ?? recommendedProduct.slug ?? recommendedProduct.name} product={recommendedProduct} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <MarketplaceFooter />
    </div>
  );
}
