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
        private int AlertWaitTime;
        private DateTime lastAlertTime;

        public TecAlert()
        {
            tecCount = 0;
            this.tecInRowAmount = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["tecInRowAmount"]);
            this.AlertWaitTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["tecAlertWaitTime"]);
            this.lastAlertTime = new DateTime();
        }

        public Boolean TecInAlertWaitTime()
        {
            DateTime currentTime = DateTime.Now;
            int secondsPass = calculateTimeDiffInSeconds(lastAlertTime, currentTime);
            return ((secondsPass < AlertWaitTime) && lastAlertTime != DateTime.MinValue);
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag)
        {
            if (tag == CriticalPointTypes.TEC)
                tecCount++;
            else
                tecCount = 0;

            DateTime currentTime = DateTime.Now;
            int secondsPass = calculateTimeDiffInSeconds(lastAlertTime, currentTime);
            if (tecCount >= tecInRowAmount && (lastAlertTime == DateTime.MinValue || secondsPass >= AlertWaitTime))
            {
                lastAlertTime = currentTime;
                return CriticalPointTypes.TEC;
            }
            else
                return CriticalPointTypes.None;
        }

        private int calculateTimeDiffInSeconds(DateTime oldTime, DateTime newTime)
        {
            TimeSpan diff = newTime.Subtract(oldTime);
            return (diff.Seconds + diff.Minutes * 60 + diff.Hours * 3600 + diff.Days * 3600 * 24);
        }

        public void user_alert()
        {
            if (!TecInAlertWaitTime())
                lastAlertTime = DateTime.Now;
        }
    }
}