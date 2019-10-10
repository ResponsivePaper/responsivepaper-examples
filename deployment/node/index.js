const http = require('http')
const axios = require('axios')

var options = {
  method: "POST",
  url: "https://www.responsivepaper.com/api/html2pdf/v2",

  data: {
    value: "https://examples.responsivepaper.com/invoice",
    apikey: "__ENTER_YOUR_APIKEY_HERE___",
    waitForReadyToRender: true,
    disableCache: false,
    includeConsole: true,
    format: "Legal",
    landscape: true,
    printMedia: false,
    timeout: 5000
  },
  responseType: 'stream'
};

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

http.createServer(async function (req, res) {
  if (req.url !== "/") {
    res.writeHead(404)
    res.end()
    return
  }
  try {
    const result = await axios(options)
    result.data.pipe(res)
  } catch (error) {
    const body = await streamToString(error.response.data)
    //TODO parse json
    res.write(body)
    res.end()
  }
}).listen(8082)