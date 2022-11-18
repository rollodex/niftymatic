import { Dialog } from '@headlessui/react';
import { useContractReader, useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";

const ModalDialog = ({ isOpen, setIsOpen,id, readContracts }) => {
    console.log("id: " + id)
    let uri = useContractReader(readContracts,"ERC721","tokenURI",[id]);
    let owner = useContractReader(readContracts,"ERC721","ownerOf",[id]);

    const baseIpfsURL = 'https://cloudflare-ipfs.com/ipfs/'; 
    let imgSrc = ''
    let imgTitle = ''

    const el = document.getElementById('selected-img');
    const el2 = document.getElementById('full-prompt')
    const el3 = document.getElementById('owner-address')
    /*
    if(el != undefined && el2 != undefined) {
       el.src = ''
       el2.innerText = ''
       el3.innerText = ''
    }
    */

    if (uri != undefined) {
    
    let ipfsJson = fetch(baseIpfsURL + uri.slice(7)).then((response) => {
        response.json().then((data) => {
            //alert(data.image)
            imgSrc = baseIpfsURL + data.image.slice(7);
            imgTitle = data.name;
           

            if(el != undefined && el2 != undefined) {

            el.src = imgSrc
            el2.innerText = imgTitle
            el3.innerText = owner

            //console.log(el);
            }
        
        })
    }).catch((error) => {
        console.log('Error:' + error)
    });
   } else {
    console.log("Undefined")
   }
   

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}
            className="fixed z-10 inset-0 overflow-y-auto overflow-x-none "
        >
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div class="relative flex flex-col container rounded-2xl bg-white divide-y">
                    <div class="content-center text-center mx-2 font-bold text-lg">Details</div>
                    <div class="flex flex-row divide-x">

                        <div class="flex mx-4 mt-4 mb-4"><img id="selected-img" width="384" height="384"></img></div>
                        <div class="flex flex-col py-4 px-4">
                            <div class="flex-grow" id="full-prompt"></div>
                            <div><span>Owner: </span> <span id="owner-address"></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalDialog;