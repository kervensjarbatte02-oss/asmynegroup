'use client';
import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Charge Stripe dynamiquement
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    stripePromise = new Promise((resolve) => {
      if ((window as any).Stripe) {
        resolve((window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
      } else {
        // Charge le script Stripe
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
          resolve((window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
        };
        document.body.appendChild(script);
      }
    });
  }
  return stripePromise;
};

type CartItem = {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

type StripeCheckoutProps = {
  items: CartItem[];
  total: number;
  onSuccess: () => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

function PaymentForm({ items, total, onSuccess, setError }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Créer le Payment Intent côté serveur
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          metadata: {
            email,
            items: items.length,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to create payment intent');

      const { clientSecret } = await res.json();

      // Confirmer le paiement avec le card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { email },
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        
        // Créer la commande après le paiement réussi
        const token = localStorage.getItem('shebas_token');
        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
            stripePaymentIntentId: paymentIntent.id,
          }),
        });

        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment error');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div>
        <label className="block text-yellow-900 font-semibold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
        />
      </div>

      <div>
        <label className="block text-yellow-900 font-semibold mb-2">Carte bancaire</label>
        <div className="p-4 border border-yellow-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#854e24',
                  '::placeholder': {
                    color: '#d4a574',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg w-full"
      >
        {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} $`}
      </button>

      {success && (
        <div className="text-green-700 font-semibold p-3 bg-green-50 rounded-lg">
          ✓ Paiement réussi! Votre commande a été créée.
        </div>
      )}
    </form>
  );
}

export function StripeCheckout({ items, total, onSuccess, setError }: StripeCheckoutProps) {
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const loader = getStripe();
    if (!loader) return;
    loader.then((s) => setStripe(s));
  }, []);

  if (!stripe) {
    return <div className="text-gray-500">Chargement du paiement...</div>;
  }

  return (
    <Elements stripe={stripe}>
      <PaymentForm items={items} total={total} onSuccess={onSuccess} setError={setError} />
    </Elements>
  );
}
