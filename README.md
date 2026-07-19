# RIXTM

## Official links

- Website: https://rixtm-website.vercel.app
- GitHub: https://github.com/mpantiru51-del/RIXTM

## Sepolia deployment

- Network: Ethereum Sepolia testnet
- Contract: `0x274C858E052A7566F645d9C1918ACe26d5CC821d`
- Verified source: https://sepolia.etherscan.io/address/0x274C858E052A7566F645d9C1918ACe26d5CC821d#code
- Maximum supply: 100,000,000 RIXTM
- Supply policy: flexible below the fixed cap; the owner may replace burned
  supply but can never exceed 100,000,000 RIXTM
- Tokenomics: [docs/TOKENOMICS.md](docs/TOKENOMICS.md)
- Governance: [docs/GOVERNANCE.md](docs/GOVERNANCE.md)

## Mainnet candidate

- Source: [contracts/RIXTMMainnet.sol](contracts/RIXTMMainnet.sol)
- Ownership: OpenZeppelin `Ownable2Step`
- Planned custody: reviewed 2-of-3 multisig
- Status: local candidate only; not deployed, independently audited, or ready
  for Mainnet
- Multisig preparation: [docs/MULTISIG_SETUP.md](docs/MULTISIG_SETUP.md)

## Security notice

RIXTM is currently a testnet deployment and has no real monetary value. Etherscan
source verification proves that the published source matches the deployed
bytecode; it is not a third-party security audit. The owner can pause and
unpause transfers. Minting cannot raise the total supply above 100,000,000
RIXTM, but burning tokens reduces the supply and creates minting headroom up to
that maximum.

## Vision
RIXTM is a modern blockchain ecosystem.

## Token
Name: RIXTM
Symbol: RIXTM

## Mission
Build a secure cryptocurrency and ecosystem used worldwide.
