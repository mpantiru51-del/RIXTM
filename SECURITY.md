# RIXTM Security Policy

## Current status

RIXTM is currently a testnet-only project. The deployed contract is available
on Ethereum Sepolia at
[`0x274C858E052A7566F645d9C1918ACe26d5CC821d`](https://sepolia.etherscan.io/address/0x274C858E052A7566F645d9C1918ACe26d5CC821d#code).
Its source is verified on Etherscan, but the project has not completed an
independent third-party security audit. Sepolia tokens have no real monetary
value and must not be treated as Mainnet assets.

The repository also contains a separate, undeployed
[`RIXTMMainnet`](contracts/RIXTMMainnet.sol) candidate. It adds two-step
ownership transfer and disables ownership renunciation, but remains unaudited
and must not be represented as a live or Mainnet-ready contract.

## Privileged controls and trust assumptions

The current contract has the following owner-controlled capabilities:

- The owner can pause and unpause token transfers.
- The owner can mint tokens only while total supply remains at or below the
  fixed maximum of 100,000,000 RIXTM.
- Burning reduces total supply and therefore creates minting headroom up to the
  same maximum.
- The owner can transfer ownership in one transaction or permanently renounce
  ownership.

As checked on 2026-07-19, the Sepolia owner is the EOA wallet
`0x9e8D1e60786F737FB5a88E51A639018451725042`, not a smart-contract multisig.
The deployed contract is not upgradeable, so code-level ownership changes
require a new deployment. The separate Mainnet candidate implements the
two-step transfer mechanism; it has not replaced the Sepolia deployment.

The supply policy is intentionally flexible below the fixed cap: the owner may
replace burned supply, but total supply can never exceed 100,000,000 RIXTM.
The emergency pause capability will be retained for Mainnet and must be
controlled by a reviewed multisig under the documented
[governance policy](docs/GOVERNANCE.md). It must not be used to influence price
or ordinary market activity.
Before Mainnet, ownership should use the reviewed 2-of-3 multisig process in
[the setup plan](docs/MULTISIG_SETUP.md). The Mainnet candidate prevents
ownership renunciation so that its pause and capped replacement-mint controls
cannot be disabled permanently by accident. Governance succession must use
the two-step ownership transfer process.

See [the Mainnet readiness checklist](docs/MAINNET_CHECKLIST.md) for the full
set of launch blockers.

## Reporting a vulnerability

Report suspected vulnerabilities privately through
[GitHub Security Advisories](https://github.com/mpantiru51-del/RIXTM/security/advisories/new).
Include the affected component, reproduction steps, expected impact, and any
supporting transaction hashes. Do not publish exploitable details in a public
issue before a fix or mitigation is available.

Never include private keys, seed phrases, API keys, or other secrets in a
report.
