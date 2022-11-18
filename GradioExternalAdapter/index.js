const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}



const createRequest = async (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  //const validator = new Validator(callback, input, customParams)
  const jobRunID = input.id //validator.validated.id

  // Connect to stable-diffusion-webui locally (this can also be ran on a remote machine)
  const url = `http://127.0.0.1:7860/api/txt2img`
  
  const prompt = input.data.prompt;

  //Defaults such as image size and number of passes for stable diffusion
  const params = {
    data: [prompt,
  "",
  "None",
  "None",
  30,
  "Euler a",
  false,
  false,
  1,
  1,
  7.0,
  -1.0,
  -1.0,
  0.0,
  0,
  0,
  false,
  384,
  384,
  false,
  0.7,
  0,
  0,
  "None",
  false,
  false,
  null,
  "",
  "Seed",
  "",
  "Nothing",
  "",
  true,
  false,
  false,
  [],
  "",
  ""]
  }

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url: url,
    data:params,
    method:'POST',
    headers: {'Content-Type': 'application/json'}
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data.result = 'finished';
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
