//SPDX-License-Identifier: MIT
//Deployed to: 0xEa637e296C67d95da55e4516635bDdA40084fEb5 (polygon mumbai)
//This contract communicates with the chainlink node that is connected to 
//the external adapter for stable diffusion. 
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./StableNFT.sol";

contract RequestManager is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;

    address public nftMint;
    address public oracleAddress;
    bytes32 public jobId;

    mapping (bytes32 => address) requestor;

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    }

    function requestHash(string memory prompt) public onlyOwner {
       Chainlink.Request memory req = buildOperatorRequest(
            jobId,
            this.fulfillRequestHash.selector
        );

        req.add("prompt", prompt);
        bytes32 runID = sendOperatorRequestTo(oracleAddress, req, ORACLE_PAYMENT);
        requestor[runID] = msg.sender;
    }

   function fulfillRequestHash(bytes32 _requestId, string memory _hash)
        public
        recordChainlinkFulfillment(_requestId)
    {
        StableNFT mint = StableNFT(nftMint);
        mint.mint(requestor[_requestId], _hash);
    }

    function setNFTMint(address mint) public onlyOwner {
        nftMint = mint;
    }

    function setOracleAddress(address oracle) public onlyOwner {
        oracleAddress = oracle;
    }

    function setJobID(bytes32 job) public onlyOwner {
        jobId = job;
    }

     function contractBalances()
        public
        view
        returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }
    
}
