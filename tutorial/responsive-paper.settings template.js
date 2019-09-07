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
  // If you run the command above you would set tunnelHostUrl https://mylocaltesting.localtunnel.me

  tunnelHostUrl: "",

  //enter your apiKey from the responsive paper dashboard
  //https://responsivepaper.com/user/dashboard

  apiKey: "",

  applyResponsivePaperCss: false,
  includeConsole: false,
  autoPreview: false,
  waitForReadyToRender: false,
  waitForReadyToRenderTimeout: 1000,


  //only override hostName if you are an enterprise user running a local pdf conversion server
  serverUrl: "https://responsivepaper.com"

}
rpDesigner.init(opt)