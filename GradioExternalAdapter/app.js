const FindFiles =  require('file-regex');
const createRequest = require('./index').createRequest
const fs = require('fs')
const axios = require('axios')
//const ipfs = await import('ipfs-http-client')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8888
const { NFTStorage, File, Blob } = require('nft.storage')


async function loadIpfs () {
  const { create } = await import('ipfs-http-client')

  const node = await create({
    // ... config here
  })

  return node
}

async function findOutputFileAndUploadToIPFS() {

}

app.use(bodyParser.json())

app.post('/', async (req, res) => {
  console.log('POST Data: ', req.body)
  res.status(200).json({"pending": true}) //Quit early for async processing
  res.end()

  await createRequest(req.body, async (status, result) => {
    console.log('Result: ', result)


    var result_data = JSON.parse(result.data.data[1])

    //Search for the finished file using the seed and prompt:
    var file_name_regex = '[\\d]\\-*'+result_data.seed+'-'+result_data.prompt.slice(0,20)+'*[.*]*'
    console.log("regex: " + file_name_regex)
    const found = await FindFiles('../stable-diffusion-webui/outputs/txt2img-images/', file_name_regex);
    console.log('Found: ' + found[0].file)
    let fileName = found[0].dir + '\\' + found[0].file
    console.log("File name: " + fileName)
    const buffer = fs.readFileSync(fileName)

    //Add to local IPFS Node:
    const ipfs_node = await loadIpfs();
    const added = await ipfs_node.add(buffer)
    console.log('Added: ' + added.cid.toString())
    let nft_metadata = JSON.stringify({name: result_data.prompt,image: 'ipfs://' + added.cid.toString(),description:"Made with NiftyMatic"});
    let added_metadata = await ipfs_node.add(nft_metadata)

    //Add to NFT.storage:
    const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZFNzBGRkE1Mjg0OTYzOWVBNEEwODJmRDBmMThBNDU5MGExRmUzZEQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODExMjk4NDE2NywibmFtZSI6Im5pZnR5bWF0aWMifQ.g5xhBvhnUssI52ypnaJb_sn3zsH5AVSEq7gDDRbyQlE'
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_TOKEN })
    const file = new File([buffer], found[0].file, { type: 'image/png' })

    const nftValue = await nftstorage.store({image: file,name: result_data.prompt,description:"Made with NiftyMatic"})
    console.log("nftValue: " + JSON.stringify(nftValue))

    //return the NFT.storage CIDs to chainlink 
    const res2 = await axios.patch(req.body.responseURL, {value: {jobRunID:result.jobRunID, data: {hash: nftValue.url}}})
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
