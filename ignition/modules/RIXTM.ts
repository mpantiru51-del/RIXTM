import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RIXTMModule", (m) => {
  const rixtm = m.contract("RIXTM");

  return { rixtm };
});
