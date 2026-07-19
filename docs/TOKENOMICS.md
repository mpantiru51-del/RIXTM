# RIXTM Supply Policy

## Fixed maximum, flexible circulating supply

RIXTM has a permanent maximum supply of 100,000,000 tokens. The full maximum
was minted at deployment.

Token holders can burn their own RIXTM. A burn immediately reduces total
supply. The owner may later mint replacement tokens only within the amount of
headroom created below the maximum. At no time can total supply exceed
100,000,000 RIXTM.

Example:

1. Total supply starts at 100,000,000 RIXTM.
2. A holder burns 1,000 RIXTM, reducing total supply to 99,999,000 RIXTM.
3. The owner may mint at most 1,000 RIXTM before the cap is reached again.

This is a flexible-supply policy within a fixed, non-inflationary cap. A burn
does not guarantee that an equal amount can never be minted again.

## Governance requirement

Minting is an owner-only operation. Before Mainnet, ownership must be assigned
to a reviewed multisig policy with documented signers, quorum, and approval
rules. Every mint should be publicly explained and independently verifiable
on-chain.

The current RIXTM deployment is on Ethereum Sepolia testnet and has no real
monetary value.

