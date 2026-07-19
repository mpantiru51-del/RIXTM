# RIXTM Governance Policy

## Current status

The existing RIXTM deployment is on Ethereum Sepolia testnet. Its owner is
currently an EOA wallet, not a multisig. This setup is for testing only and is
not the intended Mainnet governance model.

## Mainnet ownership

Before Mainnet, the contract owner must be a reviewed multisig with documented
signers, quorum, signer-replacement procedures, and secure backups. Ownership
transfer should use a two-step acceptance process so that an incorrect address
cannot receive control accidentally.

The current `RIXTMMainnet` candidate implements this two-step process. The
planned multisig quorum is 2-of-3; signer addresses are not yet selected. See
[the multisig setup plan](MULTISIG_SETUP.md).

Ownership renunciation is disabled in the Mainnet candidate. Because emergency
pause and capped replacement minting remain part of the approved token model,
accidentally renouncing ownership would permanently disable those controls.
All governance succession must therefore use `transferOwnership` followed by
`acceptOwnership` from the nominated multisig.

## Emergency pause policy

The pause capability will be retained for Mainnet as an emergency security
control. It may be proposed only for conditions such as:

- an active or credible smart-contract exploit;
- compromise of an owner or multisig signer;
- a network incident that makes normal token operations unsafe;
- a critical integration failure that places holders at immediate risk.

Pause must not be used to influence token price, stop ordinary trading, favor a
specific holder, or reverse valid transactions.

When a pause is required:

1. The multisig records the reason and available evidence.
2. The configured quorum approves the pause transaction.
3. The transaction hash and a public incident notice are published promptly.
4. The issue is investigated and a recovery plan is reviewed.
5. The same multisig quorum approves `unpause` only after normal operation is
   considered safe.
6. A post-incident report documents the cause, response, and preventive work.

## Mint policy

Minting remains owner-only and can only replace supply previously removed below
the permanent maximum of 100,000,000 RIXTM. Every Mainnet mint proposal must
state the amount, recipient, purpose, and resulting total supply before the
multisig approves it.

The final signer identities and operating procedures remain Mainnet launch
blockers in the
[readiness checklist](MAINNET_CHECKLIST.md).
