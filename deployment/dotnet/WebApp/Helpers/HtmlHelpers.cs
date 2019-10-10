using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace WebApp.Helpers
{
    public static class HtmlHelpers
    {
        public static bool IsDebug()
        {
#if DEBUG
            return true;
#else
      return false;
#endif
        }
    }
}
