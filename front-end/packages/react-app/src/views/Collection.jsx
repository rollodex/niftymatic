import { classNames } from "../helpers";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, {useState} from "react";
import NFT from '../components/NFT.jsx'
import ModalDialog from '../components/ModalInfo.jsx'




export default function Feed({readContracts, userSigner}) {
       //let ids = readContracts.MINT.tokenIds()
       let nftCount = useContractReader(readContracts,"ERC721","tokenIds",[]);
       let [getModal, showModal] = useState(false);
       let [getClickedId, setClickedId] = useState(0);

       console.log("Ids: " + nftCount)
       var asArray = [];
       if (nftCount != undefined) {
        asArray = Array(nftCount.toNumber());
       
       }
       asArray.fill(0)
       console.log("Length: " + asArray.length)
    return (
        <div className="flex flex-col justify-center place-center items-center dark:text-white">
        <h2 className="dark:text-white">Collection</h2>
        <div className="grid grid-flow-row grid-cols-4 grid-rows-4 gap-4 h-full">
        {asArray.map((id, idx) => {
          return  <div onClick={() => {setClickedId(idx);showModal(true)}}><NFT readContracts={readContracts} id={idx} onlyOwner={true} userSigner={userSigner} /></div>
        })}
        </div>
        <ModalDialog isOpen={getModal} setIsOpen={showModal} readContracts={readContracts} id={getClickedId}></ModalDialog>

        </div>
        
    );
}