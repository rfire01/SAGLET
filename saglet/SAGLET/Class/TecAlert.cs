using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class TecAlert
    {
        private int tecCount = 0;
        private int tecInRowAmount;

        public TecAlert()
        {
            tecCount = 0;
            this.tecInRowAmount = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["tecInRowAmount"]);
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag)
        {
            if (tag == CriticalPointTypes.TEC)
                tecCount++;
            else
                tecCount = 0;

            if (tecCount == tecInRowAmount)
                return CriticalPointTypes.TEC;
            else
                return CriticalPointTypes.None;
        }
    }
}