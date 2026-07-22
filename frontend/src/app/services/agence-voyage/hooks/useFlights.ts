import { useEffect, useState } from "react";

export interface Flight {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
}

export function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Remplacer l'URL par celle de votre future API
    fetch("/api/flights")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des vols");
        return res.json();
      })
      .then((data) => setFlights(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { flights, loading, error };
}
