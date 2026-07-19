import { Contract, JsonRpcProvider, dataSlice, formatUnits, getAddress, id } from "ethers";

const CONTRACT_ADDRESS = "0x274C858E052A7566F645d9C1918ACe26d5CC821d";
const DEPLOYMENT_BLOCK = 11_273_225;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const TRANSFER_TOPIC = id("Transfer(address,address,uint256)");
const RPC_URL =
  process.env.SEPOLIA_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";
const LOGS_RPC_URL =
  process.env.SEPOLIA_LOGS_RPC_URL ?? "https://rpc.sepolia.ethpandaops.io";

const TOKEN_ABI = ["function totalSupply() view returns (uint256)"];

export const dynamic = "force-dynamic";

function formatTokenAmount(value: bigint) {
  const [whole] = formatUnits(value, 18).split(".");
  return BigInt(whole).toLocaleString("ro-RO");
}

export async function GET() {
  try {
    const provider = new JsonRpcProvider(RPC_URL, 11155111, {
      staticNetwork: true,
    });
    const logsProvider = new JsonRpcProvider(LOGS_RPC_URL, 11155111, {
      staticNetwork: true,
    });
    const token = new Contract(CONTRACT_ADDRESS, TOKEN_ABI, provider);

    const [totalSupply, logs] = await Promise.all([
      token.totalSupply() as Promise<bigint>,
      logsProvider.getLogs({
        address: CONTRACT_ADDRESS,
        fromBlock: DEPLOYMENT_BLOCK,
        toBlock: "latest",
        topics: [TRANSFER_TOPIC],
      }),
    ]);

    const balances = new Map<string, bigint>();

    for (const log of logs) {
      const from = getAddress(dataSlice(log.topics[1], 12)).toLowerCase();
      const to = getAddress(dataSlice(log.topics[2], 12)).toLowerCase();
      const value = BigInt(log.data);

      if (from !== ZERO_ADDRESS) {
        balances.set(from, (balances.get(from) ?? BigInt(0)) - value);
      }
      if (to !== ZERO_ADDRESS) {
        balances.set(to, (balances.get(to) ?? BigInt(0)) + value);
      }
    }

    const holders = [...balances.values()].filter(
      (balance) => balance > BigInt(0),
    ).length;

    return Response.json(
      {
        network: "Sepolia",
        holders,
        totalTransactions: logs.length,
        circulatingSupply: formatTokenAmount(totalSupply),
        live: true,
      },
      { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=45" } },
    );
  } catch {
    return Response.json({
      network: "Sepolia",
      holders: null,
      totalTransactions: null,
      circulatingSupply: "100.000.000",
      live: false,
    });
  }
}
