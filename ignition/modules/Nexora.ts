import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NexoraModule", (m) => {
  const nexora = m.contract("Nexora");

  return { nexora };
});
