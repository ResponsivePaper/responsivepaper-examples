//
//IMPORTANT: do not check this file with your apiKey into source control
//
//
var opt = {

  //see getting started instructions on setting up localtunnel.me hostname
  // https://github.com/localtunnel/localtunnel
  // npm install -g localtunnel
  // Use the subdomain option to re use the same subdomain between restarts
  // lt --port 8080 --subdomain mylocaltesting
  // If you run the command above you would set tunnelHostName to https://mylocaltesting.localtunnel.me

  tunnelHostName: "",

  //enter your apiKey from the responsive paper dashboard
  //https://responsivepaper.com/user/dashboard

  apiKey: "",

  includeConsole: true,
  waitForReadyToRender: false,
  applyResponsivePaperCss: true,
  autoPreview: true,

  //only override hostName if you are an enterprise user running a local pdf conversion server
  hostName: "https://responsivepaper.com"

}
rpDesigner.init(opt)