# RIXTM Mainnet Readiness Checklist

Mainnet deployment is blocked until every required item below is completed and
reviewed. The existing Sepolia contract is a test deployment and should not be
promoted as a Mainnet-ready audited asset.

## Current testnet evidence

- [x] Contract deployed on Ethereum Sepolia.
- [x] Source verified on Sepolia Etherscan.
- [x] Solidity 0.8.28 production build with optimizer enabled for 200 runs.
- [x] Six contract tests passing for metadata, transfers, burn, pause, maximum
      supply, and owner-only access.
- [x] Public website connected to live Sepolia data.
- [x] Website production dependency audit reports zero vulnerabilities.

## Token model decisions

- [ ] Decide whether burned RIXTM may be minted again up to the maximum supply.
- [ ] Decide whether pausing transfers remains necessary on Mainnet.
- [ ] Decide whether ownership may ever be renounced.
- [ ] Publish the final token allocation, treasury, vesting, and circulation
      rules.
- [ ] Confirm the legal and regulatory position for every intended launch
      jurisdiction.

## Ownership and custody

- [ ] Create a dedicated multisig; never use the deployer's everyday wallet.
- [ ] Select independent signers, a quorum, backup procedures, and a signer
      replacement process.
- [ ] Use a two-step ownership transfer such as OpenZeppelin `Ownable2Step` in
      the Mainnet candidate.
- [ ] Test ownership transfer and acceptance on a fresh Sepolia deployment.
- [ ] Document who can propose, approve, and execute pause or mint operations.

## Contract assurance

- [ ] Create a new Mainnet-candidate contract after the token-model and
      ownership decisions are final.
- [ ] Add tests for two-step ownership transfer, renunciation policy, and all
      finalized tokenomics.
- [ ] Add invariant or fuzz tests for supply and balance conservation.
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

