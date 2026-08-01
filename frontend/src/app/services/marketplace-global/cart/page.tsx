"use client";

import { useCart } from "@/app/shared/CartContext";
import Navbar from "../Navbar";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  source?: string;
  variant?: string;
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
    return win.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) as Stripe | null;
  }

  return new Promise<Stripe | null>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      const loadedWindow = window as StripeLoaderWindow;
      if (typeof loadedWindow.Stripe === "function") {
        resolve(loadedWindow.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) as Stripe | null);
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
      setError("El pago aún no está listo. Inténtalo de nuevo en un momento.");
      return;
    }

    if (!buyerEmail) {
      setError("Introduce tu correo antes de pagar.");
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
        throw new Error(paymentData.error || "No se pudo crear el pago.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("No se pudo leer la información de la tarjeta.");
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
        throw new Error(error.message || "El pago ha fallado.");
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error("No se pudo confirmar el pago.");
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
        throw new Error(orderResult.error || "No se pudo crear el pedido.");
      }

      onSuccess(orderResult.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error durante el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Detalles de pago</label>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Usamos Stripe para procesar el pago de forma segura.</p>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Tarjeta de crédito</label>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <CardElement options={{ style: { base: { fontSize: "16px", color: "#111827", "::placeholder": { color: "#9ca3af" } } } }} />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Procesando pago…" : `Pagar ${total.toFixed(2)} $`}
          </button>
        </div>
      </div>
    </form>
  );
}

function MarketplaceStripeCheckout({ items, total, buyerEmail, onSuccess, setError }: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const stripeLoader = loadStripe();
    setStripePromise(stripeLoader);
    void stripeLoader.catch((error) => {
      console.error(error);
      setError("No se pudo cargar Stripe.");
    });
  }, [setError]);

  if (!stripePromise) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Cargando formulario de pago...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <MarketplacePaymentForm items={items} total={total} buyerEmail={buyerEmail} onSuccess={onSuccess} setError={setError} />
    </Elements>
  );
}

export default function MarketplaceCartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const marketplaceCart = cart.filter((item) => item.source === "marketplace-global");
  const [promo, setPromo] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("FR");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [step, setStep] = useState<1 | 2>(1);
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
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar las colecciones.");
        const products = Array.isArray(data.products) ? data.products : [];
        const categoryNames = Array.from(
          new Set(products.map((product: any) => String(product.category || product.collection || "Autres")))
        ) as string[];
        const categories: { name: string }[] = categoryNames.map((name) => ({ name }));
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
        setCollectionsError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingCollections(false);
      }
    };
    void loadCollections();
  }, []);

  const subtotal = useMemo(() => marketplaceCart.reduce((sum, item) => sum + item.price * item.quantity, 0), [marketplaceCart]);
  const discount = marketplaceCart.length > 0 ? 5.4 : 0;
  const delivery = marketplaceCart.length > 0 ? 9 : 0;
  const tax = marketplaceCart.length > 0 ? 3.9 : 0;
  const grandTotal = useMemo(
    () => Number((subtotal - discount + delivery + tax).toFixed(2)),
    [subtotal, discount, delivery, tax]
  );

  const handleContinueToPayment = () => {
    setCheckoutError("");
    if (!buyerEmail || !firstName || !lastName || !phone || !address || !city || !postalCode) {
      setCheckoutError("Todos los campos de envío son obligatorios.");
      return;
    }
    setStep(2);
  };

  const handleSuccess = (orderId: string) => {
    clearCart("marketplace-global");
    router.push(`/services/marketplace-global/cart/confirmation?orderId=${orderId}`);
  };

  return (
    <>
      <Navbar collections={collections} />
      <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">Checkout</p>
            <h1 className="text-3xl font-bold text-gray-900">Finaliza tu pedido</h1>
            <p className="text-gray-600 max-w-2xl">Completa tus datos de envío, elige tu método de pago y confirma tu pedido.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-8">
            <section className="space-y-8">
              <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">Paso 1</span>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Dirección de envío</h2>
                  </div>
                  <span className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">{marketplaceCart.length} artículo{marketplaceCart.length > 1 ? "s" : ""}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="Juan"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Pérez"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(event) => setBuyerEmail(event.target.value)}
                      placeholder="email@ejemplo.com"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+1 809 123 4567"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="123 Calle Ejemplo"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Santo Domingo"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Código postal</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(event) => setPostalCode(event.target.value)}
                        placeholder="01000"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 texto-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="FR">Francia</option>
                    <option value="CA">Canadá</option>
                    <option value="US">Estados Unidos</option>
                    <option value="GB">Reino Unido</option>
                    <option value="DR">República Dominicana</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="mt-8 w-full rounded-3xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Continuar al pago
                </button>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">Paso 2</span>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Método de pago</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <label className={`cursor-pointer rounded-3xl border p-4 transition ${paymentMethod === "card" ? "border-pink-500 bg-pink-50 text-gray-900" : "border-gray-200 bg-white text-gray-900"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-3 accent-pink-600"
                    />
                    <span className="font-semibold">Tarjeta de crédito</span>
                  </label>
                  <label className={`cursor-pointer rounded-3xl border p-4 transition ${paymentMethod === "paypal" ? "border-pink-500 bg-pink-50 text-gray-900" : "border-gray-200 bg-white text-gray-900"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="mr-3 accent-pink-600"
                    />
                    <span className="font-semibold">PayPal (próximamente disponible)</span>
                  </label>
                </div>

                <div className="mt-6">
                  {step === 2 ? (
                    paymentMethod === "card" ? (
                      <MarketplaceStripeCheckout
                        items={marketplaceCart}
                        total={grandTotal}
                        buyerEmail={buyerEmail}
                        onSuccess={handleSuccess}
                        setError={setCheckoutError}
                      />
                    ) : (
                      <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-900">
                        PayPal estará disponible próximamente. Selecciona tarjeta bancaria para finalizar tu pago ahora.
                      </div>
                    )
                  ) : (
                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
                      Primero completa la dirección de envío y haz clic en Continuar al pago.
                    </div>
                  )}
                </div>
              </div>

              {checkoutError ? (
                <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{checkoutError}</div>
              ) : null}
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de pedido</h2>
                <div className="space-y-4">
                  {marketplaceCart.map((item) => (
                    <div
                      key={`${item.id}-${item.source ?? "marketplace-global"}-${item.variant ?? "default"}`}
                      className="flex items-center gap-3 justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-16 w-16 overflow-hidden rounded-3xl bg-gray-100">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Cant. {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.source, item.variant)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 rounded-l-full text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                            aria-label={`Disminuir la cantidad de ${item.name}`}
                          >
                            −
                          </button>
                          <span className="px-3 text-sm font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.source, item.variant)}
                            className="h-8 w-8 rounded-r-full text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                            aria-label={`Aumentar la cantidad de ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} $</div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.source, item.variant)}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          <FaTimes />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-5 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)} $</span></div>
                  <div className="flex justify-between"><span>Descuento</span><span>-{discount.toFixed(2)} $</span></div>
                  <div className="flex justify-between"><span>Envío</span><span>{delivery.toFixed(2)} $</span></div>
                  <div className="flex justify-between"><span>Impuesto</span><span>{tax.toFixed(2)} $</span></div>
                </div>

                <div className="mt-4 rounded-3xl bg-gray-50 p-4 text-sm font-semibold text-gray-900">
                  <div className="flex justify-between">Total</div>
                  <div className="mt-2 text-2xl">{grandTotal.toFixed(2)} $</div>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Envío y soporte</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-600" /> Envío estándar 5-10 días hábiles.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-600" /> Pago seguro con Stripe.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-600" /> Atención al cliente disponible 7/7.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
