import { network } from "hardhat";

const { viem } = await network.connect();

const token = await viem.deployContract("Nexora");

console.log("Token deployed to:", token.address)