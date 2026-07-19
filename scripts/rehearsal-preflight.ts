import assert from "node:assert/strict";
import { network } from "hardhat";
import { formatEther } from "viem";

const SEPOLIA_CHAIN_ID = 11_155_111;
const RECOMMENDED_MINIMUM_BALANCE = 5_000_000_000_000_000n;

function requireEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`${name} is missing from the local .env file`);
  }
  return value;
}

const rpcUrl = requireEnvironmentValue("SEPOLIA_RPC_URL");
const privateKey = requireEnvironmentValue("SEPOLIA_PRIVATE_KEY");
const etherscanApiKey = requireEnvironmentValue("ETHERSCAN_API_KEY");

assert.match(rpcUrl, /^https?:\/\//i, "SEPOLIA_RPC_URL must be an HTTP(S) URL");
assert.match(
  privateKey,
  /^0x[0-9a-fA-F]{64}$/,
  "SEPOLIA_PRIVATE_KEY must use 0x followed by 64 hexadecimal characters",
);
assert.ok(
  etherscanApiKey.length >= 8,
  "ETHERSCAN_API_KEY does not look complete",
);

const { viem, networkName } = await network.connect();
const publicClient = await viem.getPublicClient();
const walletClients = await viem.getWalletClients();
const [deployer] = walletClients;

assert.ok(deployer !== undefined, "No Sepolia deployer wallet is configured");

const chainId = await publicClient.getChainId();
assert.equal(chainId, SEPOLIA_CHAIN_ID, "Connected network is not Sepolia");

const [balance, blockNumber, gasPrice] = await Promise.all([
  publicClient.getBalance({ address: deployer.account.address }),
  publicClient.getBlockNumber(),
  publicClient.getGasPrice(),
]);

assert.ok(balance > 0n, "The deployer has no Sepolia ETH");

console.log("RIXTM Sepolia rehearsal preflight: PASS");
console.log("Network:", networkName);
console.log("Chain ID:", chainId);
console.log("Latest block:", blockNumber);
console.log("Deployer:", deployer.account.address);
console.log("Deployer balance:", `${formatEther(balance)} ETH`);
console.log("Current gas price:", `${gasPrice} wei`);
console.log("RPC URL: loaded (not displayed)");
console.log("Private key: loaded (not displayed)");
console.log("Etherscan API key: loaded (not displayed)");

if (balance < RECOMMENDED_MINIMUM_BALANCE) {
  console.warn(
    "Warning: deployer balance is below the recommended 0.005 Sepolia ETH.",
  );
}
