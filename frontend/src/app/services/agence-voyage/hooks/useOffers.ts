import { useEffect, useState } from "react";

export interface Offer {
  id: string;
  title: string;
  image: string;
  description: string;
}

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Remplacer l'URL par celle de votre future API
    fetch("/api/offers")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des offres");
        return res.json();
      })
      .then((data) => setOffers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { offers, loading, error };
}
