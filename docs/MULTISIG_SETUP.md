# RIXTM 2-of-3 Multisig Preparation

## Status

No RIXTM multisig has been created yet. The plan below is preparation only and
does not authorize an on-chain deployment or ownership transfer.

## Recommended structure

- Three independent signer wallets.
- Two signatures required for every transaction.
- Hardware-backed wallets on separate devices where possible.
- At least two people involved in approving sensitive operations.
- Secure, geographically separate backup procedures.

Only public wallet addresses are needed for setup. Private keys and seed
phrases must never be shared, uploaded, committed, or entered into project
files.

## Signer worksheet

- Signer A public address: `TBD`
- Signer B public address: `TBD`
- Signer C public address: `TBD`
- Approval threshold: `2 of 3`
- Signer replacement process: `TBD`
- Emergency contact process: `TBD`

## Sepolia rehearsal

Before any Mainnet use:

1. Select and independently verify the three signer addresses.
2. Create a 2-of-3 multisig on Ethereum Sepolia using a reviewed implementation.
3. Fund it only with the small amount of Sepolia ETH required for testing.
4. Execute a harmless test transaction requiring two independent approvals.
5. Deploy the `RIXTMMainnet` candidate to a fresh Sepolia address.
6. Call `transferOwnership(multisigAddress)` from the deployer wallet.
7. Call `acceptOwnership()` from the multisig with the required quorum.
8. Verify on-chain that `owner()` equals the multisig and `pendingOwner()` is
   the zero address.
9. Test multisig-approved `pause`, `unpause`, and a capped replacement mint
   after a controlled burn.
10. Publish transaction hashes and record the complete rehearsal results.

## Mainnet blockers

Do not repeat the process on Mainnet until the contract has completed an
independent audit, all findings are resolved, signer identities and recovery
procedures are approved, and the exact audited bytecode is frozen for
deployment.
