import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RIXTMMainnetModule", (m) => {
  const rixtm = m.contract("RIXTMMainnet");

  return { rixtm };
});
