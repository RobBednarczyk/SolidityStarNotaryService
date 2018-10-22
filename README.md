# Ethereum solidity client

The aim of this project was to construct a notary service that runs on the
Ethereum Rinkeby Testnet. The smart contract has been written in the Solidity
language and is based on the open-zeppelin implementation of the ERC721 tokens.

## Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

User should also install the Metamask browser plugin

## Configuring your project

- fetch the current repository contents to your local drive

- while inside the "Project5_Zeppelin" folder install the required dependencies listed in the package.json file

```
npm install
```
## Current state of the database

1) Contract:

address: 0x53092204F812363A4DF4DeA30F9a03a2B4ECAc49
TxHash: 0x338bebcae382592900cfca4460beef527fae36f11f38950c5b7a8c2ad26f872f

2) Tokens:

Currently the database contains two tokens

- tokenId: 1; TxHash: 0xc193921ad22d2ad4a68831ae78a1456a14f1d4963e35bdbe63657eef86297a5e

- tokenId: 2: TxHash: 0xdab098539bde98d8478e1d8d4b12cab39e04bcdd95514365287915c284f9d087

2) Other transactions:

- putStarUpForSale(token 1); TxHash: 0x43a859f1566af0c067a00e09a1402b754620c22739faac6c62cc19592eb595dc

- safeTransferFrom(user1, user2, token 2 TxHash:0xc3eea8ede2beecacf4596832633d208d752e263aad2570728795bdf560b8cbdc

## Useful Information

Users are encouraged to connect to the Ethereum Rinkeby testnet opening the index.html
file on a local server. Next they should launch the Metamask plugin
