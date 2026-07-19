import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

const UNIT = 10n ** 18n;
const MAX_SUPPLY = 100_000_000n * UNIT;
const SEEDS = [0x00c0ffee, 0x0515151, 0x0badc0de, 0x005eed5];
const OPERATIONS_PER_SEED = 60;

function createRng(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state;
  };
}

function randomAmount(next: () => number, maximum: bigint): bigint {
  assert.ok(maximum > 0n);

  let value = 0n;
  for (let word = 0; word < 4; word += 1) {
    value = (value << 32n) | BigInt(next());
  }

  return (value % maximum) + 1n;
}

describe("RIXTMMainnet invariants", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const walletClients = await viem.getWalletClients();
  const actors = walletClients.slice(0, 5);

  assert.equal(actors.length, 5);

  async function waitFor(hash: `0x${string}`) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    assert.equal(receipt.status, "success");
  }

  it("preserves the supply cap and balance conservation across randomized operations", async function () {
    for (const seed of SEEDS) {
      const next = createRng(seed);
      const rixtm = await viem.deployContract("RIXTMMainnet");
      const actorContracts = await Promise.all(
        actors.map((actor) =>
          viem.getContractAt("RIXTMMainnet", rixtm.address, {
            client: { public: publicClient, wallet: actor },
          }),
        ),
      );
      const addresses = actors.map((actor) => actor.account.address);

      const readBalances = () =>
        Promise.all(
          addresses.map((address) => rixtm.read.balanceOf([address])),
        );

      const assertInvariants = async () => {
        const totalSupply = await rixtm.read.totalSupply();
        const balances = await readBalances();
        const accountedSupply = balances.reduce(
          (sum, balance) => sum + balance,
          0n,
        );

        assert.ok(totalSupply <= MAX_SUPPLY);
        assert.equal(accountedSupply, totalSupply);
      };

      await assertInvariants();

      for (let step = 0; step < OPERATIONS_PER_SEED; step += 1) {
        const action = step % 3;
        const balances = await readBalances();
        const fundedActorIndexes = balances
          .map((balance, index) => ({ balance, index }))
          .filter(({ balance }) => balance > 0n)
          .map(({ index }) => index);

        if (action === 0 && fundedActorIndexes.length > 0) {
          const sourceIndex =
            fundedActorIndexes[next() % fundedActorIndexes.length];
          let targetIndex = next() % actors.length;
          if (targetIndex === sourceIndex) {
            targetIndex = (targetIndex + 1) % actors.length;
          }
          const amount = randomAmount(next, balances[sourceIndex]);

          await waitFor(
            await actorContracts[sourceIndex].write.transfer([
              addresses[targetIndex],
              amount,
            ]),
          );
        } else if (action === 1 && fundedActorIndexes.length > 0) {
          const sourceIndex =
            fundedActorIndexes[next() % fundedActorIndexes.length];
          const amount = randomAmount(next, balances[sourceIndex]);

          await waitFor(
            await actorContracts[sourceIndex].write.burn([amount]),
          );
        } else if (action === 2) {
          const totalSupply = await rixtm.read.totalSupply();
          const mintingHeadroom = MAX_SUPPLY - totalSupply;

          if (mintingHeadroom > 0n) {
            const targetIndex = next() % actors.length;
            const amount = randomAmount(next, mintingHeadroom);

            await waitFor(
              await rixtm.write.mint([addresses[targetIndex], amount]),
            );
          }
        }

        await assertInvariants();
      }
    }
  });
});
