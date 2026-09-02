"use client";

import { useState, useEffect, useCallback } from "react";

const RANKS = [
  { name: "Pelajar Budaya", min: 0, max: 250 },
  { name: "Penjelajah Ragam Hias", min: 251, max: 600 },
  { name: "Kolektor Batik Nusantara", min: 601, max: 1200 },
  { name: "Empu Batik Digital", min: 1201, max: Infinity },
];

function getRank(xp: number) {
  return RANKS.find((r) => xp >= r.min && xp <= r.max)?.name ?? "Pelajar Budaya";
}

export function useXp() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("batikkita_xp") ?? "0", 10);
    setXp(stored);
  }, []);

  const addXp = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem("batikkita_xp", String(next));
      return next;
    });
  }, []);

  return { xp, rank: getRank(xp), addXp };
}
