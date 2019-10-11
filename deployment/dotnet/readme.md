## ASP.NET Core web server example

This shows how to consume the Responsive Paper service from a simple web server written in .NET Core. To test, clone the repository and update the apikey in appsettings.json and the invoice.cshtml with your apikey from the [dashboard](https://www.responsivepaper.com/user/dashboard).  You'll also need to set up a local tunnel using [ngrok](https://ngrok.com/download).

Start an ngrok tunnel using the following command (replace the port number as needed)
```
ngrok http -host-header=rewrite https://localhost:44322

```

Then update the "TunnelHost" in the appsettings.json and the invoice.cshtml.

