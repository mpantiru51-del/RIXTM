"use client";

import { useEffect, useState } from "react";

type TokenStats = {
  network: string;
  holders: number | null;
  totalTransactions: number | null;
  circulatingSupply: string;
  live: boolean;
};

const initialStats: TokenStats = {
  network: "Sepolia",
  holders: null,
  totalTransactions: null,
  circulatingSupply: "100.000.000",
  live: false,
};

const TOKEN_URL = "https://sepolia.etherscan.io/token/0x274C858E052A7566F645d9C1918ACe26d5CC821d";
const CONTRACT_URL = "https://sepolia.etherscan.io/address/0x274C858E052A7566F645d9C1918ACe26d5CC821d";

export default function LiveTokenStats() {
  const [stats, setStats] = useState<TokenStats>(initialStats);

  useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        const response = await fetch("/api/token-stats", { cache: "no-store" });
        if (!response.ok) throw new Error("Statisticile nu sunt disponibile");
        const data = (await response.json()) as TokenStats;
        if (active) setStats(data);
      } catch {
        if (active) setStats((current) => ({ ...current, live: false }));
      }
    }
    void loadStats();
    const refresh = window.setInterval(loadStats, 30_000);
    return () => { active = false; window.clearInterval(refresh); };
  }, []);

  const numberOrDash = (value: number | null) => value === null ? "—" : value.toLocaleString("ro-RO");

  return (
    <section className="live-stats" aria-label="Statistici live RIXTM">
      <div className="live-stats-heading">
        <div><span className={`status-dot${stats.live ? " is-live" : ""}`} /> DATE ON-CHAIN</div>
        <small>{stats.live ? "Actualizate live" : "Se conectează la Sepolia"}</small>
      </div>
      <div className="live-stats-grid">
        <a className="live-stat-card" href="https://sepolia.etherscan.io/" target="_blank" rel="noreferrer">
          <span className="live-stat-icon" aria-hidden="true">●</span>
          <div><small>NETWORK</small><strong>{stats.network}</strong></div>
        </a>
        <a className="live-stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
          <span className="live-stat-icon" aria-hidden="true">♙</span>
          <div><small>HOLDERS</small><strong>{numberOrDash(stats.holders)}</strong></div>
        </a>
        <a className="live-stat-card" href={`${CONTRACT_URL}#tokentxns`} target="_blank" rel="noreferrer">
          <span className="live-stat-icon" aria-hidden="true">↻</span>
          <div><small>TOTAL TRANSACTIONS</small><strong>{numberOrDash(stats.totalTransactions)}</strong></div>
        </a>
        <a className="live-stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
          <span className="live-stat-icon" aria-hidden="true">↗</span>
          <div><small>CIRCULATING SUPPLY</small><strong>{stats.circulatingSupply}</strong><em>RIXTM</em></div>
        </a>
      </div>
    </section>
  );
}
