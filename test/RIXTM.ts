import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

const UNIT = 10n ** 18n;
const INITIAL_SUPPLY = 100_000_000n * UNIT;

describe("RIXTM", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [owner, recipient, stranger] = await viem.getWalletClients();

  async function waitFor(hash: `0x${string}`) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    assert.equal(receipt.status, "success");
  }

  it("deploys with the correct metadata, owner and fixed maximum supply", async function () {
    const rixtm = await viem.deployContract("RIXTM");

    assert.equal(await rixtm.read.name(), "RIXTM");
    assert.equal(await rixtm.read.symbol(), "RIXTM");
    assert.equal(await rixtm.read.decimals(), 18);
    assert.equal(await rixtm.read.totalSupply(), INITIAL_SUPPLY);
    assert.equal(await rixtm.read.MAX_SUPPLY(), INITIAL_SUPPLY);
    assert.equal(
      (await rixtm.read.owner()).toLowerCase(),
      owner.account.address.toLowerCase(),
    );
    assert.equal(await rixtm.read.balanceOf([owner.account.address]), INITIAL_SUPPLY);
  });

  it("transfers tokens and updates both balances", async function () {
    const rixtm = await viem.deployContract("RIXTM");
    const amount = 10n * UNIT;

    await waitFor(await rixtm.write.transfer([recipient.account.address, amount]));

    assert.equal(
      await rixtm.read.balanceOf([owner.account.address]),
      INITIAL_SUPPLY - amount,
    );
    assert.equal(await rixtm.read.balanceOf([recipient.account.address]), amount);
  });

  it("burns tokens and reduces total supply", async function () {
    const rixtm = await viem.deployContract("RIXTM");
    const amount = 25n * UNIT;

    await waitFor(await rixtm.write.burn([amount]));

    assert.equal(await rixtm.read.totalSupply(), INITIAL_SUPPLY - amount);
    assert.equal(
      await rixtm.read.balanceOf([owner.account.address]),
      INITIAL_SUPPLY - amount,
    );
  });

  it("allows only the owner to pause and blocks transfers while paused", async function () {
    const rixtm = await viem.deployContract("RIXTM");
    const strangerContract = await viem.getContractAt("RIXTM", rixtm.address, {
      client: { public: publicClient, wallet: stranger },
    });

    await viem.assertions.revertWithCustomError(
      strangerContract.write.pause(),
      strangerContract,
      "OwnableUnauthorizedAccount",
    );

    await waitFor(await rixtm.write.pause());
    assert.equal(await rixtm.read.paused(), true);

    await viem.assertions.revertWithCustomError(
      rixtm.write.transfer([recipient.account.address, UNIT]),
      rixtm,
      "EnforcedPause",
    );

    await waitFor(await rixtm.write.unpause());
    await waitFor(await rixtm.write.transfer([recipient.account.address, UNIT]));
    assert.equal(await rixtm.read.balanceOf([recipient.account.address]), UNIT);
  });

  it("never permits total supply to exceed 100,000,000 RIXTM", async function () {
    const rixtm = await viem.deployContract("RIXTM");
    const amount = 5n * UNIT;

    await viem.assertions.revertWith(
      rixtm.write.mint([recipient.account.address, 1n]),
      "Max supply exceeded",
    );

    await waitFor(await rixtm.write.burn([amount]));
    await waitFor(await rixtm.write.mint([recipient.account.address, amount]));

    assert.equal(await rixtm.read.totalSupply(), INITIAL_SUPPLY);
    assert.equal(await rixtm.read.balanceOf([recipient.account.address]), amount);

    await viem.assertions.revertWith(
      rixtm.write.mint([recipient.account.address, 1n]),
      "Max supply exceeded",
    );
  });

  it("rejects owner-only operations from another wallet", async function () {
    const rixtm = await viem.deployContract("RIXTM");
    const strangerContract = await viem.getContractAt("RIXTM", rixtm.address, {
      client: { public: publicClient, wallet: stranger },
    });

    await viem.assertions.revertWithCustomError(
      strangerContract.write.mint([stranger.account.address, UNIT]),
      strangerContract,
      "OwnableUnauthorizedAccount",
    );
    await viem.assertions.revertWithCustomError(
      strangerContract.write.unpause(),
      strangerContract,
      "OwnableUnauthorizedAccount",
    );
    await viem.assertions.revertWithCustomError(
      strangerContract.write.transferOwnership([stranger.account.address]),
      strangerContract,
      "OwnableUnauthorizedAccount",
    );
  });
});
