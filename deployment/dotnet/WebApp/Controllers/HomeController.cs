using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private IWebHostEnvironment _hostingEnv;
        private IOptions<ResponsivePaperSettings> _responsivePaperSettings;

        public HomeController(ILogger<HomeController> logger, IOptions<ResponsivePaperSettings> responsivePaperSettings, IWebHostEnvironment hostingEnv)
        {
            _logger = logger;
            _hostingEnv = hostingEnv;
            _responsivePaperSettings = responsivePaperSettings;
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Invoice(string authToken, bool includeConsole, string format, bool landscape, bool attachment)
        {
            //It would be smarter to create and save a one time use token to a session store instead of hard coding _authToken
            var _authToken = "yofk9FI4WvOcA17QTqgIyMIbQMiJpxZdhCV4cVpMhqbTSgvC0NL2XTFl5G45JkN4"; 
            if (_authToken == authToken)
            {
                //incoming request from Responsive Paper Service
                return View(InvoiceModel.Example());
            }

            //request conversion from Responsive Paper Service

            var host = HttpContext.Request.Scheme + "//" + HttpContext.Request.Host.Value;
            if (_hostingEnv.IsDevelopment())
            {
                //use tunnel url instead of localhost
                host = _responsivePaperSettings.Value.TunnelHost.TrimEnd(new[] { '/' }); ;
            }

            var url = host + HttpContext.Request.Path.Value;
            url = url + (HttpContext.Request.QueryString.HasValue ? HttpContext.Request.QueryString + "&" : "?") + "authToken=" + _authToken;
            using var httpClient = new HttpClient();
            var body = new
            {
                Value = url,
                Apikey = _responsivePaperSettings.Value.ApiKey,
                IncludeConsole = includeConsole,
                Format = format,
                Landscape = landscape

            };
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            var jsonBody = JsonConvert.SerializeObject(body, serializerSettings);

            var content = new StringContent(jsonBody, UnicodeEncoding.UTF8, "application/json");
            var response = await httpClient.PostAsync(_responsivePaperSettings.Value.Url, content);
            if (response.IsSuccessStatusCode)
            {
                if (attachment)
                {
                    HttpContext.Response.Headers["Content-Disposition"] = "attachment; filename=\"invoice.pdf\"";
                }

                var stream = await response.Content.ReadAsStreamAsync();
                return new FileStreamResult(stream, "application/pdf");
            }
            else
            {
                return new ContentResult
                {
                    Content = await response.Content.ReadAsStringAsync(),
                    ContentType = "application/problem+json",
                    StatusCode = (int)response.StatusCode
                };
            }
        }

    }
}
