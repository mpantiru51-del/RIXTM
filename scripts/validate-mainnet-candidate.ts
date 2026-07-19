import assert from "node:assert/strict";
import { network } from "hardhat";
import { getAddress, isAddress, zeroAddress } from "viem";

const SEPOLIA_CHAIN_ID = 11_155_111;
const EXPECTED_MAX_SUPPLY = 100_000_000n * 10n ** 18n;

function requireAddress(name: string): `0x${string}` {
  const value = process.env[name]?.trim();
  assert.ok(value !== undefined && isAddress(value), `${name} is invalid`);
  return getAddress(value);
}

const candidateAddress = requireAddress("RIXTM_CANDIDATE_ADDRESS");
const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();

assert.equal(
  await publicClient.getChainId(),
  SEPOLIA_CHAIN_ID,
  "Connected network is not Sepolia",
);

const candidateBytecode = await publicClient.getBytecode({
  address: candidateAddress,
});
assert.ok(
  candidateBytecode !== undefined && candidateBytecode !== "0x",
  "RIXTM_CANDIDATE_ADDRESS has no deployed bytecode",
);

const candidate = await viem.getContractAt("RIXTMMainnet", candidateAddress);
const [name, symbol, maximumSupply, totalSupply, owner, pendingOwner, paused] =
  await Promise.all([
    candidate.read.name(),
    candidate.read.symbol(),
    candidate.read.MAX_SUPPLY(),
    candidate.read.totalSupply(),
    candidate.read.owner(),
    candidate.read.pendingOwner(),
    candidate.read.paused(),
  ]);

assert.equal(name, "RIXTM", "Unexpected token name");
assert.equal(symbol, "RIXTM", "Unexpected token symbol");
assert.equal(maximumSupply, EXPECTED_MAX_SUPPLY, "Unexpected maximum supply");
assert.ok(totalSupply <= maximumSupply, "Total supply exceeds the fixed cap");

console.log("RIXTM Mainnet candidate validation: PASS");
console.log("Candidate:", candidateAddress);
console.log("Maximum supply:", maximumSupply);
console.log("Current total supply:", totalSupply);
console.log("Owner:", owner);
console.log("Pending owner:", pendingOwner);
console.log("Paused:", paused);

const multisigValue = process.env.RIXTM_MULTISIG_ADDRESS?.trim();
if (multisigValue !== undefined && multisigValue.length > 0) {
  assert.ok(isAddress(multisigValue), "RIXTM_MULTISIG_ADDRESS is invalid");
  const multisigAddress = getAddress(multisigValue);
  const multisigBytecode = await publicClient.getBytecode({
    address: multisigAddress,
  });

  assert.ok(
    multisigBytecode !== undefined && multisigBytecode !== "0x",
    "RIXTM_MULTISIG_ADDRESS is not a deployed smart contract on Sepolia",
  );

  if (getAddress(owner) === multisigAddress && pendingOwner === zeroAddress) {
    console.log("Ownership state: accepted by the configured multisig");
  } else if (getAddress(pendingOwner) === multisigAddress) {
    console.log("Ownership state: awaiting multisig acceptance");
  } else {
    console.log("Ownership state: transfer to the multisig has not started");
  }
}
