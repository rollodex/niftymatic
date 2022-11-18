import { classNames } from "../helpers";
import { useBlockNumber, useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Input } from "antd"

import {
  ChipIcon,
  CodeIcon,
  LightningBoltIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ArrowDownIcon
} from '@heroicons/react/outline'

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

import { randomBytes } from "ethers/lib/utils";
import { useEventListener } from "eth-hooks/events/useEventListener";

/**
 * Convert an image 
 * to a base64 url
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
 function convertImgToBase64URL(url, callback, outputFormat){
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
      var canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null; 
  };
  img.src = url;
}

/*
function startDownload() {
  alert("download")
  const el = document.getElementById("main-img");
  const url = el.src;
  convertImgToBase64URL(url,,"image/png")
}
*/
export default function Home({ yourLocalBalance, readContracts,writeContracts,tx,localProvider }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  //const purpose = useContractReader(readContracts, "YourContract", "purpose");

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

  const [getPrompt, setPrompt] = useState("")
  const [isGenerating, setGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [getBlob, setBlob] = useState([])
  const blockNumber = useBlockNumber();
  const events = useEventListener(readContracts,"MINT","RequestFufilled",localProvider,blockNumber)

  let imgURL = ''
  let baseIpfsURL = 'https://cloudflare-ipfs.com/ipfs/'

  useEffect(() => {
    console.log('Events found: ', events);
    events.map((event) => {
      if (event.args[0] == ethers.utils.hexlify(getBlob)) {
          //alert("Done") 
            
          let ipfsJson = fetch(baseIpfsURL + event.args[2].slice(7)).then((response) => {
            response.json().then((data) => {
                //alert(data.image)
                setGenerating(false);
                imgURL = baseIpfsURL + data.image.slice(7);
                setIsDone(true)
                
                const el = document.getElementById("main-img");
                const el2 = document.getElementById("dl-btn");

                el.src = imgURL;
                convertImgToBase64URL(imgURL,(base64Img) => {
                  el2.setAttribute("download",getPrompt + '.png');
                  el2.setAttribute("href",base64Img);
              
                },"image/png");
                
                      
                
            })
        }).catch((error) => {
          console.log('Error:' + error)
          setGenerating(false);
          setIsDone(true);
      });
      }
    })

  }, [events]);

   return (
    <div className="flex flex-col place-center dark:text-white">
      <h2 className="text-lg text-center font-medium text-gray-900 dark:text-white">Enter a description and see what you create! 🚀</h2>
      <div className="flex grow flex-row m-0 space-x-0 py-4">
         <input onChange={e => {setPrompt(e.target.value)}} className="w-full border border-gray-300 rounded-l-full  text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none">
          </input>
         <button className="text-white bg-black rounded-r-full w-24 "  onClick={() => {
          //alert("clicked: " + getPrompt)
          //console.log("Write contracts: " + Object.keys(readContracts))
          var buf = randomBytes(32)
          console.log("buf: " + ethers.utils.hexlify(buf))
          setBlob(buf)
          setGenerating(true)
          setIsDone(false);
          tx (
            writeContracts.MINT.requestHash(buf,getPrompt), (status) => {
              console.log("type of status: " + Object.keys(status));
            if (status.hasOwnProperty('code')) {
                console.log('error message: ' + status.message)
                setGenerating(false);
              }
              
            
         });
         }}>Generate</button>
      </div>
      <div className={ isGenerating ? "flex flex-row justify-center animate-pulse" : "flex flex-row justify-center"}>
        {isDone && <img id="main-img" src={imgURL} />}
        {!isDone && <svg width="384" height="384" viewBox="0 0 384 384"> <rect width="384" height="384" rx="10" ry="10" fill="#CCC" /></svg>}
      </div>
      <div class="flex flex-row justify-center py-4">
        <a id="dl-btn" className="w-4 h-4 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
</svg>


        </a>
      </div>
       
      {/*<div className="mt-4 flex">
        <a href="https://buidlguidl.com/builds" target="_blank" className="text-sm font-medium text-indigo-600 dark:text-indigo-500 hover:text-indigo-500">
          Get inspired from a BuidlGuidl project<span aria-hidden="true"> &rarr;</span>
        </a>
      </div>*/}
    </div>
  )
}
