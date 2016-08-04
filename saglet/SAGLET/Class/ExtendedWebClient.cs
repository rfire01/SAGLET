using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace SAGLET.Class
{
    public class ExtendedWebClient : WebClient
    {
        private int timeout { get; set; }

        public ExtendedWebClient()
        {
            timeout = 10000;     //In Milli seconds
        }
        protected override WebRequest GetWebRequest(Uri address)
        {
            var objWebRequest = base.GetWebRequest(address);
            objWebRequest.Timeout = this.timeout;
            return objWebRequest;
        }
    }
}