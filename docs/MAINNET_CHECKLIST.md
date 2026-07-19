# RIXTM Mainnet Readiness Checklist

Mainnet deployment is blocked until every required item below is completed and
reviewed. The existing Sepolia contract is a test deployment and should not be
promoted as a Mainnet-ready audited asset.

## Current testnet evidence

- [x] Contract deployed on Ethereum Sepolia.
- [x] Source verified on Sepolia Etherscan.
- [x] Solidity 0.8.28 production build with optimizer enabled for 200 runs.
- [x] Thirteen contract tests passing: six for the Sepolia contract, six for
      the separate Mainnet candidate, and one deterministic invariant test
      covering 240 randomized operations.
- [x] Public website connected to live Sepolia data.
- [x] Website production dependency audit reports zero vulnerabilities.

## Token model decisions

- [x] Use a flexible supply below the fixed cap: burned RIXTM may be minted
      again, but total supply can never exceed 100,000,000 RIXTM.
- [x] Retain emergency pause protection on Mainnet under multisig control.
- [x] Disable ownership renunciation in the Mainnet candidate.
- [ ] Publish the final token allocation, treasury, vesting, and circulation
      rules.
- [ ] Confirm the legal and regulatory position for every intended launch
      jurisdiction.

## Ownership and custody

- [ ] Create a dedicated multisig; never use the deployer's everyday wallet.
- [ ] Select independent signers, a quorum, backup procedures, and a signer
      replacement process.
- [x] Use OpenZeppelin `Ownable2Step` in the Mainnet candidate.
- [ ] Test ownership transfer and acceptance on a fresh Sepolia deployment.
- [ ] Document who can propose, approve, and execute pause or mint operations.

## Contract assurance

- [x] Create a separate, undeployed Mainnet-candidate contract.
- [x] Add tests for two-step ownership transfer and flexible capped supply.
- [x] Finalize and test the ownership-renunciation policy.
- [x] Add invariant tests for the supply cap and balance conservation.
- [ ] Complete an independent third-party smart-contract audit.
- [ ] Resolve or formally accept every audit finding.
- [ ] Rehearse deployment, verification, and ownership transfer on Sepolia.

## Mainnet launch

- [ ] Freeze and tag the audited commit used for deployment.
- [ ] Independently reproduce the compiler output and deployment bytecode.
- [ ] Deploy from a dedicated hardware-secured wallet.
- [ ] Verify the source code and constructor arguments on Mainnet Etherscan.
- [ ] Transfer ownership to the reviewed multisig and verify acceptance.
- [ ] Perform small-value operational tests before wider distribution.
- [ ] Publish the official Mainnet address through the website and GitHub.
