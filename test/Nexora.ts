import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("Nexora", async function () {
  const { viem } = await network.connect();

  it("Should deploy successfully", async function () {
    const nexora = await viem.deployContract("Nexora");

    assert.equal(await nexora.read.name(), "Nexora");
    assert.equal(await nexora.read.symbol(), "NXR");
  });
});