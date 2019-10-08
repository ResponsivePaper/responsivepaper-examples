const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({
    //port: 443,
    subdomain: 'rptest',
    loacl_host: 'test.responsivepaper.com',
    local_https: true,
    allow_invalid_cert: true
  });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  console.log(tunnel.url);

  tunnel.on('close', () => {
    console.log("tunnel closed")
  });
})();