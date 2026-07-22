import { useEffect, useState } from "react";

export interface Hotel {
  id: string;
  name: string;
  image: string;
  location: string;
  description: string;
}

export function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Remplacer l'URL par celle de votre future API
    fetch("/api/hotels")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des hôtels");
        return res.json();
      })
      .then((data) => setHotels(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { hotels, loading, error };
}
