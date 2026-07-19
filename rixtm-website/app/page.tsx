import Image from "next/image";
import LiveTokenStats from "./live-token-stats";
import WalletControls from "./wallet-controls";

const TOKEN_URL =
  "https://sepolia.etherscan.io/token/0x274C858E052A7566F645d9C1918ACe26d5CC821d";
const CONTRACT_URL =
  "https://sepolia.etherscan.io/address/0x274C858E052A7566F645d9C1918ACe26d5CC821d";

export default function Home() {
  return (
    <main className="site-shell" aria-label="RIXTM — Invest, Earn, Grow">
      <WalletControls />

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow"><i /> Ethereum Sepolia · Contract verificat</span>
          <h1>Viitorul digital,<span>construit împreună.</span></h1>
          <p>
            RIXTM este un ecosistem blockchain modern, creat pentru transparență,
            securitate și creștere sustenabilă.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#network-stats">
              Descoperă RIXTM <span aria-hidden="true">↘</span>
            </a>
            <a className="secondary-action" href={CONTRACT_URL} target="_blank" rel="noreferrer">
              Vezi contractul <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-trust">
            <span>ERC-20</span><span>OpenZeppelin</span><span>100M supply maxim</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="logo-orbit orbit-one" />
          <div className="logo-orbit orbit-two" />
          <div className="logo-aura" />
          <Image
            className="hero-logo"
            src="/logo.png"
            alt="Simbolul oficial RIXTM"
            width={1536}
            height={1536}
            priority
          />
          <div className="floating-chip chip-security">
            <small>SECURITATE</small><strong>Contract verificat</strong>
          </div>
          <div className="floating-chip chip-network">
            <small>NETWORK</small><strong><i /> Sepolia</strong>
          </div>
        </div>
      </section>

      <section className="network-section" id="network-stats">
        <div className="section-heading">
          <div><span className="eyebrow">RIXTM ÎN CIFRE</span><h2>Transparență, direct on-chain.</h2></div>
          <p>Date publice, verificabile în orice moment pe rețeaua Ethereum.</p>
        </div>
        <div className="network-stats">
          <a className="stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
            <span>TRANZACȚII</span><strong className="live-value">Live</strong>
            <small>Activitate publică pe Ethereum</small><i>Vezi pe Etherscan ↗</i>
          </a>
          <a className="stat-card" href="https://sepolia.etherscan.io/gastracker" target="_blank" rel="noreferrer">
            <span>COMISIOANE REȚEA</span><strong>Variabile</strong>
            <small>În funcție de Ethereum</small><i>Vezi gas tracker ↗</i>
          </a>
          <a className="stat-card technical-card" href={`${CONTRACT_URL}#code`} target="_blank" rel="noreferrer">
            <span>SECURITATE</span><strong>Cod verificat</strong>
            <small>ERC-20 · OpenZeppelin · Solidity 0.8.28</small><i>Inspectează codul ↗</i>
          </a>
          <a className="stat-card" href={TOKEN_URL} target="_blank" rel="noreferrer">
            <span>SUPPLY MAXIM</span><strong>100.000.000</strong><small>RIXTM</small><i>Vezi tokenul ↗</i>
          </a>
        </div>
      </section>

      <LiveTokenStats />

      <footer className="site-footer">
        <div className="footer-brand"><i>R</i> RIXTM</div>
        <p>Construim un ecosistem sigur, transparent și pregătit pentru viitor.</p>
        <span>© 2026 RIXTM · Sepolia Testnet</span>
      </footer>
    </main>
  );
}
