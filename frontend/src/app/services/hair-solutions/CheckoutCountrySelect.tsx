"use client";
import React, { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "./checkout/countries";

export default function CheckoutCountrySelect({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const selected = COUNTRIES.find(c => c.code === value) || COUNTRIES.find(c => c.code === 'US');

  const list = COUNTRIES.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button type="button" className="w-full text-left px-4 py-2 border border-yellow-300 rounded-lg bg-white text-yellow-900" onClick={() => setOpen(v => !v)}>
        {selected?.name}
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-yellow-200 rounded shadow-lg">
          <div className="p-2">
            <input autoFocus value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher un pays..." className="w-full px-3 py-2 border rounded focus:outline-none" />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {list.map(c => (
              <li key={c.code}>
                <button type="button" onClick={() => { onChange(c.code); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-yellow-50">
                  {c.name}
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="p-4 text-gray-500">Aucun pays trouvé</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
