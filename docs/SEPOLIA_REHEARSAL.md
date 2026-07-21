# RIXTM Mainnet Candidate Sepolia Rehearsal

## Status and scope

This runbook is prepared but has not been executed. It is for Ethereum Sepolia
only. It does not authorize a Mainnet deployment, use of real funds, or an
ownership transfer on the existing RIXTM Sepolia contract.

The rehearsal deploys a new `RIXTMMainnet` candidate. The existing contract at
`0x274C858E052A7566F645d9C1918ACe26d5CC821d` must remain unchanged.

## Safety prerequisites

- Use a dedicated test-only deployer wallet with a small amount of Sepolia ETH.
- Create and test a reviewed 2-of-3 multisig on Sepolia first.
- Independently verify all three signer addresses and the multisig address.
- Use only public addresses in project records.
- Never share or commit private keys, seed phrases, RPC credentials, or API
  keys.
- Stop if any command reports a network, bytecode, owner, or address mismatch.

## 1. Configure the local environment

From the project root in PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill `SEPOLIA_RPC_URL`, `SEPOLIA_PRIVATE_KEY`, and `ETHERSCAN_API_KEY` locally.
The `.env` file is ignored by Git. Do not paste its contents into an issue,
chat, commit, screenshot, or deployment record.

Run the read-only network and wallet check:

```powershell
npm run rehearsal:preflight
```

It must report chain ID `11155111`, a nonzero test ETH balance, and `PASS`.
The command never sends a transaction and never displays credentials.

## 2. Re-run the production tests

```powershell
npm test -- --build-profile production
```

All thirteen tests must pass before deployment, including the deterministic
invariant test covering 240 transfer, burn, and replacement-mint operations.

## 3. Deploy and verify a fresh candidate

```powershell
npm run rehearsal:deploy
```

This command uses the optimized production profile, deploys
`RIXTMMainnetModule`, records local Ignition state under the dedicated rehearsal
deployment ID, and requests source verification. Do not use `--reset` unless a
deliberate fresh deployment has been reviewed.

Record the deployment address and transaction hash. Add the deployed address to
the local `.env` file as `RIXTM_CANDIDATE_ADDRESS`, then run:

```powershell
npm run rehearsal:validate
```

Validation must confirm deployed bytecode, the `RIXTM` name and symbol, the
100,000,000 RIXTM maximum supply, total supply at or below that cap, and the
expected initial owner.

## 4. Prepare the multisig

Create the reviewed Sepolia 2-of-3 multisig and execute one harmless transaction
with two independent approvals. Add its address to `.env` as
`RIXTM_MULTISIG_ADDRESS`, then run `npm run rehearsal:validate` again. The
validator rejects an EOA address and accepts only a deployed smart contract on
Sepolia.

## 5. Propose the two-step ownership transfer

The proposal script sends a transaction, so review both addresses again. Set
the confirmation value to the exact checksummed multisig address:

```text
RIXTM_CONFIRM_OWNERSHIP_TRANSFER=TRANSFER_TO_<checksummed_multisig_address>
```

Then run:

```powershell
npm run rehearsal:propose-owner
```

The script checks the network, candidate bytecode and metadata, multisig
bytecode, current owner, pending owner, and address-bound confirmation before it
calls `transferOwnership`. Record the transaction hash and immediately clear
`RIXTM_CONFIRM_OWNERSHIP_TRANSFER` from `.env`.

Run `npm run rehearsal:validate`. It must report that ownership is awaiting
multisig acceptance.

## 6. Accept ownership through the multisig

In the reviewed multisig interface, create a transaction calling
`acceptOwnership()` on the new candidate. Two independent signers must review
the candidate address and approve the transaction. Execute it and record the
transaction hash.

Run `npm run rehearsal:validate` again. It must report that the configured
multisig is the owner and that `pendingOwner()` is the zero address.

## 7. Rehearse privileged operations

Using the multisig and two approvals for every owner action:

1. Call `pause()` and verify `paused()` is `true`.
2. Confirm a normal token transfer cannot execute while paused.
3. Call `unpause()` and verify ordinary transfers work again.
4. Burn exactly 1 RIXTM from a designated rehearsal holder.
5. Propose a mint of exactly 1 RIXTM back to the designated rehearsal recipient.
6. Verify total supply returns to the cap and cannot exceed it.

Do not perform a larger burn or mint during the rehearsal.

## Evidence record

Complete every field before marking the rehearsal finished:

- Tested Git commit: `TBD`
- Rehearsal date and reviewers: `TBD`
- Deployer public address: `TBD`
- Signer A public address: `0x9e8D1e60786F737FB5a88E51A639018451725042`
- Signer B public address: `0xA8d024c92f19C247aBAafA1f604DE0536c139Af0`
- Signer C public address: `0x5272768D0396f9ED101cE8E6ff14CD008B08E79C`
- Multisig address and creation transaction: `TBD`
- Harmless 2-of-3 test transaction: `TBD`
- Candidate address and deployment transaction: `TBD`
- Etherscan verification link: `TBD`
- `transferOwnership` transaction: `TBD`
- `acceptOwnership` transaction: `TBD`
- Pause and blocked-transfer evidence: `TBD`
- Unpause and successful-transfer evidence: `TBD`
- Controlled burn and replacement-mint transactions: `TBD`
- Final owner, pending owner, paused state, and total supply: `TBD`
- Deviations, failures, and remediation: `TBD`

## Completion rule

The rehearsal is complete only when every evidence field is filled, two people
have reviewed the results, all discrepancies are resolved, and the checklist is
updated. A successful rehearsal is not an independent audit and does not make
the contract Mainnet-ready.
