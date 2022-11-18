//SPDX-License-Identifier: MIT
//This contract is an ERC-721 which is only mintable by RequestMangager
//It gets called when RequestManager recieves an IPFS URL from the Chainlink oracle
//Deployed to: 0xdA2666355199E16374B49801311e8a7932a007c5 (Polygon Mumbai)
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StableNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    uint256 public tokenIds;
    address public requestManager;

    constructor() ERC721("NiftyMatic","NFM") {}

     function mint(address requester,string calldata uri) public {
       require(msg.sender == requestManager);

       _mint(requester, tokenIds);
       _setTokenURI(tokenIds, uri);

       tokenIds = tokenIds.add(1);
       emit Minted(tokenIds - 1, uri);
     }

     function setRequestManager(address manager) public onlyOwner {
         requestManager = manager;
     }

     event Minted(uint256 _id, string _uri);
}