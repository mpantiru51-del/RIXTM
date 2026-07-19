import { network } from "hardhat";

const { viem } = await network.connect();

const token = await viem.deployContract("RIXTM");

console.log("RIXTM deployed to:", token.address);
