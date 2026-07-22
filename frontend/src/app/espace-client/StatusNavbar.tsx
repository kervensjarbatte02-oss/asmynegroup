"use client";

import { useEffect, useState } from "react";

type StatusItem = {
  id: string;
  name: string;
  avatar: string;
  statusText: string;
  online: boolean;
};

type StatusApiResult = {
  statuses?: StatusItem[];
  error?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "CL";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function StatusNavbar() {
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadStatuses() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/statuses", { cache: "no-store" });
        const data = (await response.json()) as StatusApiResult;

        if (!response.ok) {
          throw new Error(data.error ?? "Erreur de chargement");
        }

        const list = data.statuses ?? [];

        if (!mounted) {
          return;
        }

        setStatusItems(list);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStatuses();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <nav className="p-0">
      <div className="overflow-x-auto pr-12">
        <div className="flex min-w-max items-start gap-4">
          {loading ? <p className="text-sm text-pink-100">Chargement des statuts...</p> : null}
          {!loading && error ? <p className="text-sm text-red-300">{error}</p> : null}
          {!loading && !error && statusItems.length === 0 ? (
            <p className="text-sm text-pink-100">Aucun client disponible pour le moment.</p>
          ) : null}
          {!loading && !error
            ? statusItems.map((item) => {
                return (
                  <div key={item.id} className="group flex flex-col items-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ea2e96] to-[#5774ff] p-[2px]">
                      <span className="relative inline-flex h-full w-full overflow-hidden rounded-full border-2 border-[#2a1331] bg-[#2a1331]">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-[#4a2a57] text-sm font-bold text-white">
                            {initials(item.name)}
                          </span>
                        )}
                        {item.online ? (
                          <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border border-[#2a1331] bg-green-400" />
                        ) : null}
                      </span>
                    </span>
                    <span className="mt-1 max-w-[84px] truncate text-sm font-medium text-pink-100 group-hover:text-white">
                      {item.name}
                    </span>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </nav>
  );
}
