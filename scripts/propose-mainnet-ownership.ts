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
const multisigAddress = requireAddress("RIXTM_MULTISIG_ADDRESS");
const requiredConfirmation = `TRANSFER_TO_${multisigAddress}`;

assert.equal(
  process.env.RIXTM_CONFIRM_OWNERSHIP_TRANSFER,
  requiredConfirmation,
  `Set RIXTM_CONFIRM_OWNERSHIP_TRANSFER=${requiredConfirmation} to confirm`,
);
assert.notEqual(
  candidateAddress,
  multisigAddress,
  "Candidate and multisig addresses must differ",
);

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const [deployer] = await viem.getWalletClients();

assert.ok(deployer !== undefined, "No Sepolia deployer wallet is configured");
assert.equal(
  await publicClient.getChainId(),
  SEPOLIA_CHAIN_ID,
  "Connected network is not Sepolia",
);

const [candidateBytecode, multisigBytecode] = await Promise.all([
  publicClient.getBytecode({ address: candidateAddress }),
  publicClient.getBytecode({ address: multisigAddress }),
]);

assert.ok(
  candidateBytecode !== undefined && candidateBytecode !== "0x",
  "RIXTM_CANDIDATE_ADDRESS has no deployed bytecode",
);
assert.ok(
  multisigBytecode !== undefined && multisigBytecode !== "0x",
  "RIXTM_MULTISIG_ADDRESS is not a deployed smart contract on Sepolia",
);

const candidate = await viem.getContractAt(
  "RIXTMMainnet",
  candidateAddress,
  { client: { public: publicClient, wallet: deployer } },
);
const [name, symbol, maximumSupply, owner, pendingOwner] = await Promise.all([
  candidate.read.name(),
  candidate.read.symbol(),
  candidate.read.MAX_SUPPLY(),
  candidate.read.owner(),
  candidate.read.pendingOwner(),
]);

assert.equal(name, "RIXTM", "Unexpected token name");
assert.equal(symbol, "RIXTM", "Unexpected token symbol");
assert.equal(maximumSupply, EXPECTED_MAX_SUPPLY, "Unexpected maximum supply");

if (getAddress(owner) === multisigAddress && pendingOwner === zeroAddress) {
  console.log("Ownership has already been accepted by the configured multisig.");
} else if (getAddress(pendingOwner) === multisigAddress) {
  console.log("Ownership transfer is already awaiting multisig acceptance.");
} else {
  assert.equal(
    getAddress(owner),
    getAddress(deployer.account.address),
    "The configured deployer is not the current contract owner",
  );
  assert.equal(
    pendingOwner,
    zeroAddress,
    "A different ownership transfer is already pending",
  );

  const transactionHash = await candidate.write.transferOwnership([
    multisigAddress,
  ]);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  assert.equal(receipt.status, "success", "Ownership proposal reverted");
  assert.equal(
    getAddress(await candidate.read.pendingOwner()),
    multisigAddress,
    "Multisig was not recorded as pending owner",
  );

  console.log("Ownership transfer proposed successfully.");
  console.log("Transaction:", transactionHash);
  console.log("Pending owner:", multisigAddress);
  console.log("Next action: approve and execute acceptOwnership() in the multisig.");
}
