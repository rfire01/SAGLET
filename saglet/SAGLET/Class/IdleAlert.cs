using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class IdleAlert
    {
        private DateTime StartTime;
        private int allIdleTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["allIdleTime"]);
        private int geoCheckTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["geogebraCheckTime"]);
        private int noActionTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["yesChatNoActionTime"]);

        public IdleAlert()
        {
            StartTime = new DateTime();
        }

        public void activity()
        {
            DateTime currentTime = DateTime.Now;
            if (StartTime == DateTime.MinValue)
                StartTime = currentTime;
        }

        public CriticalPointTypes CheckIdle(Dictionary<string, RoomUser> usersInfo)
        {
            if (TotalIdle(usersInfo) || NoGeogebraUsage(usersInfo))
                return CriticalPointTypes.IDLE;
            else
                return CriticalPointTypes.None;
        }

        private int calculateTimeDiffInSeconds(DateTime oldTime, DateTime newTime)
        {
            TimeSpan diff = newTime.Subtract(oldTime);
            return (diff.Seconds + diff.Minutes * 60 + diff.Hours * 3600 + diff.Days * 3600 * 24);
        }

        private Boolean TotalIdle(Dictionary<string, RoomUser> usersInfo)
        {
            Boolean allIdle = true;
            int secondsPassed;
            DateTime currentTime = DateTime.Now;
            foreach (KeyValuePair<string, RoomUser> pair in usersInfo)
            {
                secondsPassed = calculateTimeDiffInSeconds(pair.Value.getLastActivityTime(), currentTime);
                allIdle = allIdle && (secondsPassed >= allIdleTime);
            }
            if(usersInfo.Count==0)
                return false;
            return allIdle;
        }

        private Boolean NoGeogebraUsage(Dictionary<string, RoomUser> usersInfo)
        {
            DateTime currentTime = DateTime.Now;
            int secondsPassed = calculateTimeDiffInSeconds(StartTime, currentTime);
            if(secondsPassed <= geoCheckTime)
            {
                Boolean onlyGeoIdle = true;
                int actionPassed,messagePassed;
                foreach (KeyValuePair<string, RoomUser> pair in usersInfo)
                {
                    messagePassed = calculateTimeDiffInSeconds(pair.Value.getLastMessageTime(), currentTime);
                    actionPassed = calculateTimeDiffInSeconds(pair.Value.getLastActionTime(), currentTime);
                    onlyGeoIdle = onlyGeoIdle && (actionPassed >= noActionTime) && (messagePassed < noActionTime);
                }
                if(usersInfo.Count==0)
                    return false;
                return onlyGeoIdle;
            }
            return false;
        }

    }
}