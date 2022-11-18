import { classNames } from "../helpers";
import { useContractReader, useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import React, {useState, useEffect} from "react";

export default function NFT({readContracts, id, onlyOwner, userSigner}) {
   let uri = useContractReader(readContracts,"ERC721","tokenURI",[id]);
   let owner = useContractReader(readContracts,"ERC721","ownerOf",[id]);
   let currentAddress = useUserAddress(userSigner);


   console.log("uri: " + uri);
   console.log("owner: " + owner)
   console.log("current address: " + currentAddress)

   if (onlyOwner && (owner != currentAddress))
     return null;
    
    const baseIpfsURL = 'https://cloudflare-ipfs.com/ipfs/'; 
    let imgSrc = ''
    let imgTitle = ''
    if (uri != undefined) {
    
    let ipfsJson = fetch(baseIpfsURL + uri.slice(7)).then((response) => {
        response.json().then((data) => {
            //alert(data.image)
            imgSrc = baseIpfsURL + data.image.slice(7);
            imgTitle = data.name;
            const el = document.getElementById(uri.slice(7));
            const el2 = document.getElementById('title-' + uri.slice(7))
            if(el != undefined && el2 != undefined) {

            el.src = imgSrc
            el.setAttribute('alt', imgTitle);
            el.setAttribute('title', imgTitle);
            el2.innerText = imgTitle.slice(0,45);
            console.log(el);
            }
        
        })
    }).catch((error) => {
        console.log('Error:' + error)
    });
   } else {
    console.log("Undefined")
   }
 
    return (
        <div className="mb-2 py-2 bg-white text-black border border-double transition duration-500 hover:scale-125">
            
            <img id={(uri != undefined) ? uri.slice(7) : ''}></img>
            
            <div id={'title-' + ((uri != undefined) ? uri.slice(7) : '')} className="text-center font-bold mt-2">
            </div>
           
        </div>
    )
}