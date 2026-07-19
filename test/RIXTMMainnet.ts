import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

const UNIT = 10n ** 18n;
const MAX_SUPPLY = 100_000_000n * UNIT;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("RIXTMMainnet", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [owner, nominee, stranger, recipient] = await viem.getWalletClients();

  async function waitFor(hash: `0x${string}`) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    assert.equal(receipt.status, "success");
  }

  it("deploys the full capped supply to the initial owner", async function () {
    const rixtm = await viem.deployContract("RIXTMMainnet");

    assert.equal(await rixtm.read.name(), "RIXTM");
    assert.equal(await rixtm.read.symbol(), "RIXTM");
    assert.equal(await rixtm.read.totalSupply(), MAX_SUPPLY);
    assert.equal(await rixtm.read.MAX_SUPPLY(), MAX_SUPPLY);
    assert.equal(
      (await rixtm.read.owner()).toLowerCase(),
      owner.account.address.toLowerCase(),
    );
    assert.equal(await rixtm.read.pendingOwner(), ZERO_ADDRESS);
  });

  it("requires the nominated owner to accept ownership", async function () {
    const rixtm = await viem.deployContract("RIXTMMainnet");
    const nomineeContract = await viem.getContractAt(
      "RIXTMMainnet",
      rixtm.address,
      { client: { public: publicClient, wallet: nominee } },
    );

    await waitFor(
      await rixtm.write.transferOwnership([nominee.account.address]),
    );

    assert.equal(
      (await rixtm.read.owner()).toLowerCase(),
      owner.account.address.toLowerCase(),
    );
    assert.equal(
      (await rixtm.read.pendingOwner()).toLowerCase(),
      nominee.account.address.toLowerCase(),
    );

    await waitFor(await nomineeContract.write.acceptOwnership());

    assert.equal(
      (await rixtm.read.owner()).toLowerCase(),
      nominee.account.address.toLowerCase(),
    );
    assert.equal(await rixtm.read.pendingOwner(), ZERO_ADDRESS);
  });

  it("rejects ownership acceptance from any other wallet", async function () {
    const rixtm = await viem.deployContract("RIXTMMainnet");
    const strangerContract = await viem.getContractAt(
      "RIXTMMainnet",
      rixtm.address,
      { client: { public: publicClient, wallet: stranger } },
    );

    await waitFor(
      await rixtm.write.transferOwnership([nominee.account.address]),
    );

    await viem.assertions.revertWithCustomError(
      strangerContract.write.acceptOwnership(),
      strangerContract,
      "OwnableUnauthorizedAccount",
    );
  });

  it("moves privileged controls to the accepted owner", async function () {
    const rixtm = await viem.deployContract("RIXTMMainnet");
    const nomineeContract = await viem.getContractAt(
      "RIXTMMainnet",
      rixtm.address,
      { client: { public: publicClient, wallet: nominee } },
    );

    await waitFor(
      await rixtm.write.transferOwnership([nominee.account.address]),
    );
    await waitFor(await nomineeContract.write.acceptOwnership());

    await viem.assertions.revertWithCustomError(
      rixtm.write.pause(),
      rixtm,
      "OwnableUnauthorizedAccount",
    );

    await waitFor(await nomineeContract.write.pause());
    assert.equal(await rixtm.read.paused(), true);
  });

  it("allows replacement minting after burns but never above the cap", async function () {
    const rixtm = await viem.deployContract("RIXTMMainnet");
    const amount = 5n * UNIT;

    await waitFor(await rixtm.write.burn([amount]));
    await waitFor(await rixtm.write.mint([recipient.account.address, amount]));

    assert.equal(await rixtm.read.totalSupply(), MAX_SUPPLY);
    assert.equal(await rixtm.read.balanceOf([recipient.account.address]), amount);

    await viem.assertions.revertWith(
      rixtm.write.mint([recipient.account.address, 1n]),
      "Max supply exceeded",
    );
  });
});
