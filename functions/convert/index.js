const axios = require('axios')

exports.handler = async function (event, context) {
  const streamToString = function (stream, encoding) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString(encoding)))
    })
  }

  const errorGen = (msg) => {
    return { statusCode: 500, body: msg }
  }
  if (!event.queryStringParameters.url) {
    return errorGen('Missing url')
  }
  //TODO handle other options in queryString
  const options = {
    method: 'POST',
    url: 'https://www.responsivepaper.com/api/html2pdf/v2',
    data: {
      value: event.queryStringParameters.url,
      apikey: process.env.RP_API_KEY,
      waitForReadyToRender: true,
      disableCache: false,
      includeConsole: true,
      format: 'Letter',
      landscape: false,
      printMedia: false,
      timeout: 5000,
    },
    responseType: 'stream',
  }
  try {
    //return errorGen(options.data.apikey)
    //throw new Error('test')
    const result = await axios(options)

    if (result.status != 200) {
      // NOT res.status >= 200 && res.status < 300
      return errorGen('Error converting url.')
    }
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-type': 'application/pdf',
      },
      body: await streamToString(result.data, 'base64'),
    }
  } catch (error) {
    console.error('Error: ', error)
    //const body = await streamToString(error.response.data,"utf8")
    return errorGen(error.message)
  }
}
