# RIXTM 2-of-3 Multisig Preparation

## Status

The RIXTM 2-of-3 Safe was created successfully on Ethereum Sepolia on
2026-07-21. It is active but has not yet been funded or used for the required
harmless 2-of-3 test transaction. This record does not authorize a Mainnet
deployment or an ownership transfer.

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

- Signer A public address: `0x9e8D1e60786F737FB5a88E51A639018451725042`
- Signer B public address: `0xA8d024c92f19C247aBAafA1f604DE0536c139Af0`
- Signer C public address: `0x5272768D0396f9ED101cE8E6ff14CD008B08E79C`
- Approval threshold: `2 of 3`
- Signer replacement process: `TBD`
- Emergency contact process: `TBD`

## Active Sepolia Safe

- Network: `Ethereum Sepolia`
- Safe address: `0xaA732ed2d17de570f7A8fE3A7406493E31c4788A`
- Creation transaction: [`0xe649c8389a2b33e6ddb0443a0fb78a92c81625d183778e35feda505e3085f92b`](https://sepolia.etherscan.io/tx/0xe649c8389a2b33e6ddb0443a0fb78a92c81625d183778e35feda505e3085f92b)
- Creation status: `Success`
- Created by: `0x9e8D1e60786F737FB5a88E51A639018451725042` (Signer A)
- Safe interface: [Open the RIXTM Sepolia Safe](https://app.safe.global/home?safe=sep:0xaA732ed2d17de570f7A8fE3A7406493E31c4788A)
- Harmless 2-of-3 test transaction: `TBD`

## Sepolia rehearsal

Before any Mainnet use:

Follow the guarded commands and evidence template in the
[complete Sepolia rehearsal runbook](SEPOLIA_REHEARSAL.md).

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
