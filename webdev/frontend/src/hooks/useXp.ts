"use client";

import { useState, useEffect, useCallback } from "react";

export type MasteryTier = "Unlocked" | "Mudah" | "Menengah" | "Sulit";

export interface RankInfo {
  name: string;
  min: number;
  max: number;
  badge: string;
  description: string;
}

export const RANKS: RankInfo[] = [
  { 
    name: "Pelajar Budaya", 
    min: 0, 
    max: 250, 
    badge: "Tingkat I", 
    description: "Mengenal dasar ornamen geometris dan keindahan visual wastra." 
  },
  { 
    name: "Penjelajah Ragam Hias", 
    min: 251, 
    max: 600, 
    badge: "Tingkat II", 
    description: "Memahami ragam motif pesisiran, keraton, dan filosofi maknanya." 
  },
  { 
    name: "Kolektor Batik Nusantara", 
    min: 601, 
    max: 1200, 
    badge: "Tingkat III", 
    description: "Menguasai peta sentra budaya, observasi mikro, dan teknik cap." 
  },
  { 
    name: "Empu Batik Digital", 
    min: 1201, 
    max: Infinity, 
    badge: "Tingkat IV", 
    description: "Pakar sejati pelestari warisan adiluhung batik Indonesia." 
  },
];

export function getRank(xp: number): string {
  return RANKS.find((r) => xp >= r.min && xp <= r.max)?.name ?? "Pelajar Budaya";
}

export function getRankInfo(xp: number): RankInfo {
  return RANKS.find((r) => xp >= r.min && xp <= r.max) ?? RANKS[0];
}

const DIFFICULTY_WEIGHT: Record<MasteryTier, number> = {
  Unlocked: 1,
  Mudah: 2,
  Menengah: 3,
  Sulit: 4,
};

export function useXp() {
  const [xp, setXp] = useState(0);
  const [unlockedCards, setUnlockedCards] = useState<string[]>([]);
  const [masteryCards, setMasteryCards] = useState<Record<string, MasteryTier>>({});
  const [levelUpInfo, setLevelUpInfo] = useState<{
    show: boolean;
    newRank: string;
    previousRank: string;
  }>({ show: false, newRank: "", previousRank: "" });

  // Initial load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedXp = parseInt(localStorage.getItem("batikkita_xp") ?? "0", 10);
      if (!isNaN(storedXp)) {
        setXp(storedXp);
      }

      const storedMastery = localStorage.getItem("batik_mastery_cards");
      if (storedMastery) {
        const parsed = JSON.parse(storedMastery);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setMasteryCards(parsed);
        }
      }

      const storedUnlocked = localStorage.getItem("batik_unlocked_cards");
      if (storedUnlocked) {
        const parsed = JSON.parse(storedUnlocked);
        if (Array.isArray(parsed)) {
          setUnlockedCards(parsed);
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Add XP with level up detection
  const addXp = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      const oldRank = getRank(prev);
      const newRank = getRank(next);

      localStorage.setItem("batikkita_xp", String(next));

      if (oldRank !== newRank && next > prev) {
        setLevelUpInfo({
          show: true,
          newRank,
          previousRank: oldRank,
        });
      }

      return next;
    });
  }, []);

  // Unlock or upgrade motif mastery
  const unlockMotif = useCallback((motifId: string, difficulty?: "Mudah" | "Menengah" | "Sulit") => {
    if (typeof window === "undefined") return;

    const currentTier: MasteryTier = difficulty ?? "Unlocked";

    // 1. Update Unlocked list
    setUnlockedCards((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (!safePrev.includes(motifId)) {
        const next = [...safePrev, motifId];
        localStorage.setItem("batik_unlocked_cards", JSON.stringify(next));
        return next;
      }
      return safePrev;
    });

    // 2. Update Mastery tier
    setMasteryCards((prev) => {
      const safePrev = prev && typeof prev === "object" ? prev : {};
      const existing = safePrev[motifId] ?? "Unlocked";
      const existingWeight = DIFFICULTY_WEIGHT[existing] ?? 0;
      const newWeight = DIFFICULTY_WEIGHT[currentTier] ?? 1;

      // Only upgrade if higher or equal
      if (newWeight >= existingWeight) {
        const next = { ...safePrev, [motifId]: currentTier };
        localStorage.setItem("batik_mastery_cards", JSON.stringify(next));
        return next;
      }
      return safePrev;
    });
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo((prev) => ({ ...prev, show: false }));
  }, []);

  return {
    xp,
    rank: getRank(xp),
    rankInfo: getRankInfo(xp),
    addXp,
    unlockedCards: Array.isArray(unlockedCards) ? unlockedCards : [],
    masteryCards: masteryCards && typeof masteryCards === "object" ? masteryCards : {},
    unlockMotif,
    levelUpInfo,
    dismissLevelUp,
  };
}
