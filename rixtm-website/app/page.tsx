/* eslint-disable @next/next/no-img-element */

import LiveTokenStats from "./live-token-stats";
import WalletControls from "./wallet-controls";

const TOKEN_URL =
  "https://sepolia.etherscan.io/token/0x274C858E052A7566F645d9C1918ACe26d5CC821d";
const CONTRACT_URL =
  "https://sepolia.etherscan.io/address/0x274C858E052A7566F645d9C1918ACe26d5CC821d";

export default function Home() {
  return (
    <main className="exact-page" aria-label="RIXTM — Invest, Earn, Grow">
      <WalletControls />

      <section className="poster-frame">
        <img
          className="exact-artwork"
          src="/rixtm-exact.jpeg"
          alt="Pagina oficială RIXTM: Security, Innovation, Growth — Invest, Earn, Grow"
          draggable={false}
        />
      </section>

      <section
        className="network-stats"
        id="network-stats"
        aria-label="Informații despre rețeaua RIXTM"
      >
        <a className="stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
          <span>TRANZACȚII</span>
          <strong className="live-value">Live</strong>
          <small>Timpul depinde de rețeaua Ethereum</small>
          <i>Vezi pe Etherscan ↗</i>
        </a>
        <a
          className="stat-card"
          href="https://sepolia.etherscan.io/gastracker"
          target="_blank"
          rel="noreferrer"
        >
          <span>COMISIOANE REȚEA</span>
          <strong>Variabile</strong>
          <small>În funcție de Ethereum</small>
          <i>Vezi gas tracker ↗</i>
        </a>
        <a
          className="stat-card technical-card"
          href={`${CONTRACT_URL}#code`}
          target="_blank"
          rel="noreferrer"
        >
          <span>SECURITATE</span>
          <strong>Contract verificat</strong>
          <small>ERC-20 · OpenZeppelin · Solidity 0.8.28</small>
          <i>Vezi codul verificat ↗</i>
        </a>
        <a className="stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
          <span>SUPPLY TOTAL</span>
          <strong>100.000.000</strong>
          <small>RIXTM</small>
          <i>Vezi tokenul ↗</i>
        </a>
      </section>

      <LiveTokenStats />
    </main>
  );
}
