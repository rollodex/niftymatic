# NiftyMatic

## Introduction
NiftyMatic is an external adapter and front end interface to Stable Diffusion that allows you to transform a text description of what you want to see into images that are minted instantly as an NFT on the polygon blockchain! It uses IPFS to store the results of stable diffusion renders and a Chainlink Node and external adapter to trigger the stable diffusion runs and store the results to the blockchain when done. It highlights the usefulness of asynchronous external adapters in offloading computationally-intensive tasks and reporting the results of the computations back to the blockchain. 
  

## Benefits
   * Nodes can earn LINK tokens to run stable diffusion
   * Create NFTs instantly
   * Archival backup to IPFS

## Architecture
   * Docker
        * Chainlink node
        * Postgres SQL
        * IPFS
   * Blockchain
        * Request Manager
        * Oracle
        * ERC-721 Contract
   * Frontend
        * React
        * tailwind-css
        * ethers
        * eth-hooks
   * Machine 
        * stable-diffusion-webui (credit to Automatic1111)
   * Running 
     * Start docker node: docker compose up
     * Start stable diffusion: webui-user.bat
     * Start external adapter: npm start
     * Start front-end: yarn start