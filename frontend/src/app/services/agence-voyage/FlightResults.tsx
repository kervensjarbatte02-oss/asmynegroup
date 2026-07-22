import React, { useEffect, useState } from "react";

interface Flight {
  origin: string;
  destination: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_at: string;
  return_at?: string;
  transfers: number;
  link: string;
}

interface FlightResultsProps {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
}

const API_TOKEN = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN || "";
const PARTNER_ID = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_PARTNER_ID || "";

export const FlightResults: React.FC<FlightResultsProps> = ({ origin, destination, departDate, returnDate }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Exemple d'appel à l'API Aviasales (Travelpayouts)
    // Voir la doc officielle pour d'autres endpoints
    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${departDate}${returnDate ? `&return_at=${returnDate}` : ''}&currency=eur&token=${API_TOKEN}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des vols");
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          setFlights(data.data);
        } else {
          setFlights([]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [origin, destination, departDate, returnDate]);

  if (loading) return <div>Chargement des vols...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!flights.length) return <div>Aucun vol trouvé.</div>;

  return (
    <div className="space-y-4">
      {flights.map((flight: any, idx: number) => (
        <div key={idx} className="border p-4 rounded shadow">
          <div><strong>{flight.origin} → {flight.destination}</strong></div>
          <div>Départ : {flight.departure_at}</div>
          {flight.return_at && <div>Retour : {flight.return_at}</div>}
          <div>Prix : {flight.price} €</div>
          <div>Compagnie : {flight.airline}</div>
          <div>Numéro de vol : {flight.flight_number}</div>
          <div>Nombre de correspondances : {flight.transfers}</div>
          <a href={flight.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir ce vol</a>
        </div>
      ))}
    </div>
  );
};
