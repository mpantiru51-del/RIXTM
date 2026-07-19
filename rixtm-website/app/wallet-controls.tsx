"use client";

import { useEffect, useState } from "react";

const RIXTM_ADDRESS = "0x274C858E052A7566F645d9C1918ACe26d5CC821d";
const SEPOLIA_CHAIN_ID = "0xaa36a7";

type ProviderRequest = { method: string; params?: unknown[] | Record<string, unknown> };
type EthereumProvider = {
  request: (request: ProviderRequest) => Promise<unknown>;
  on?: (event: string, listener: (value: unknown) => void) => void;
  removeListener?: (event: string, listener: (value: unknown) => void) => void;
};

declare global { interface Window { ethereum?: EthereumProvider } }

type Message = { text: string; tone: "success" | "error" | "info" } | null;

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function errorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? Number((error as { code: unknown }).code) : null;
}

async function selectSepolia(provider: EthereumProvider) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA_CHAIN_ID }] });
  } catch (error) {
    if (errorCode(error) !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: SEPOLIA_CHAIN_ID,
        chainName: "Sepolia",
        nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      }],
    });
  }
}

export default function WalletControls() {
  const [account, setAccount] = useState("");
  const [busy, setBusy] = useState<"connect" | "add" | null>(null);
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;
    const updateAccount = (value: unknown) => {
      const accounts = Array.isArray(value) ? value : [];
      setAccount(typeof accounts[0] === "string" ? accounts[0] : "");
    };
    void provider.request({ method: "eth_accounts" }).then(updateAccount).catch(() => undefined);
    provider.on?.("accountsChanged", updateAccount);
    return () => provider.removeListener?.("accountsChanged", updateAccount);
  }, []);

  function showMessage(nextMessage: Message) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 5_000);
  }

  function requireProvider() {
    if (window.ethereum) return window.ethereum;
    showMessage({ text: "Nu am găsit un wallet. Instalează MetaMask sau deschide pagina în browserul walletului.", tone: "error" });
    return null;
  }

  async function requestAccount(provider: EthereumProvider) {
    const result = await provider.request({ method: "eth_requestAccounts" });
    const accounts = Array.isArray(result) ? result : [];
    const selected = typeof accounts[0] === "string" ? accounts[0] : "";
    if (!selected) throw new Error("Nu a fost selectat niciun cont");
    setAccount(selected);
    return selected;
  }

  async function connectWallet() {
    const provider = requireProvider();
    if (!provider) return;
    setBusy("connect");
    setMessage({ text: "Confirmă conectarea în wallet…", tone: "info" });
    try {
      const selected = await requestAccount(provider);
      await selectSepolia(provider);
      showMessage({ text: `Wallet conectat: ${shortAddress(selected)} · Sepolia`, tone: "success" });
    } catch (error) {
      showMessage({ text: errorCode(error) === 4001 ? "Conectarea a fost anulată." : "Walletul nu s-a putut conecta.", tone: "error" });
    } finally { setBusy(null); }
  }

  async function addToken() {
    const provider = requireProvider();
    if (!provider) return;
    setBusy("add");
    setMessage({ text: "Confirmă adăugarea tokenului în wallet…", tone: "info" });
    try {
      await requestAccount(provider);
      await selectSepolia(provider);
      const added = await provider.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: RIXTM_ADDRESS, symbol: "RIXTM", decimals: 18 } },
      });
      showMessage({ text: added ? "RIXTM a fost adăugat în wallet." : "Adăugarea tokenului a fost anulată.", tone: added ? "success" : "error" });
    } catch (error) {
      showMessage({ text: errorCode(error) === 4001 ? "Adăugarea a fost anulată." : "RIXTM nu s-a putut adăuga în wallet.", tone: "error" });
    } finally { setBusy(null); }
  }

  function explore() {
    document.getElementById("network-stats")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RIXTM — prima pagină"><span>R</span>RIXTM</a>
        <nav aria-label="Navigație principală">
          <button className="explore-button" type="button" onClick={explore}>Explorare</button>
          <a href="#network-stats">Ecosistem</a>
        </nav>
        <div className="wallet-actions">
          <button className="token-add" type="button" onClick={addToken} disabled={busy !== null}>
            <span className="token-add-plus" aria-hidden="true">+</span>
            {busy === "add" ? "Se adaugă…" : "Adaugă RIXTM"}
          </button>
          <button
            className={`wallet-connect${account ? " is-connected" : ""}`}
            type="button"
            onClick={connectWallet}
            disabled={busy !== null}
            title={account || "Conectează walletul la Sepolia"}
          >
            <span className="wallet-connect-dot" aria-hidden="true" />
            {busy === "connect" ? "Se conectează…" : account ? shortAddress(account) : "Conectare wallet"}
          </button>
        </div>
      </header>
      {message && <div className={`wallet-message ${message.tone}`} role="status" aria-live="polite">{message.text}</div>}
    </>
  );
}
