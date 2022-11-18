import { classNames } from "../helpers";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, {useState, useEffect} from "react";
import NFT from '../components/NFT.jsx'
import ModalDialog from '../components/ModalInfo.jsx'
import { useEventListener } from "eth-hooks/events/useEventListener";


export default function Feed({readContracts,userSigner,localProvider}) {
       //let ids = readContracts.MINT.tokenIds()
       let blockNumber = 29169366; 

       let nftCount = useContractReader(readContracts,"ERC721","tokenIds",[]);
       let [getModal, showModal] = useState(false);
       let [getClickedId, setClickedId] = useState(0);

       const events = useEventListener(readContracts,"ERC721","Minted",localProvider,blockNumber)
       var asArray = [];

       useEffect(() => {
        console.log('Events found: ', events.length);
        asArray.push(events)
    
      }, [events]);


       console.log("Ids: " + nftCount)
       if (nftCount != undefined) {
        asArray = Array(nftCount.toNumber());
       
       }
       asArray.fill(0)
       console.log("Length: " + asArray.length)
    return (
        <div className="flex flex-col justify-center place-center items-center dark:text-white">
         
        <h2 className="dark:text-white">Feed</h2>
        <div>
        {asArray.map((id, idx) => {
          return <div onClick={() => {setClickedId((asArray.length-1)-idx);showModal(true)}}><NFT readContracts={readContracts} id={(asArray.length-1)-idx} onlyOwner={false} userSigner={userSigner}/></div>
        })}
        </div>
        <ModalDialog isOpen={getModal} setIsOpen={showModal} readContracts={readContracts} id={getClickedId}></ModalDialog>

        </div>
    );
}