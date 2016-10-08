﻿using System;
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
        private int idleUserInterval = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["idleUserInterval"]);
        private Queue<KeyValuePair<string, DateTime>> idleQueue;

        public IdleAlert()
        {
            StartTime = new DateTime();
            this.idleQueue = new Queue<KeyValuePair<string, DateTime>>();
        }

        public void HandleMessage(string user)
        {
            DateTime currentTime = DateTime.Now;
            if (StartTime == DateTime.MinValue)
                StartTime = currentTime;
            idleQueue.Enqueue(new KeyValuePair<string, DateTime>(user, currentTime));
            CleanMessages();
        }

        public KeyValuePair<CriticalPointTypes, List<string>> CheckIdle(Dictionary<string, RoomUser> usersInfo)
        {
            KeyValuePair<Boolean, List<string>> idleUsers = GetIdleUsersInInterval(usersInfo.Keys.ToList());
            if (StartTime!=DateTime.MinValue && (TotalIdle(usersInfo) || NoGeogebraUsage(usersInfo) || idleUsers.Key))
                return new KeyValuePair<CriticalPointTypes, List<string>>(CriticalPointTypes.IDLE,idleUsers.Value);
            else
                return new KeyValuePair<CriticalPointTypes, List<string>>(CriticalPointTypes.None, idleUsers.Value);
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
                if (pair.Value.getLastActivityTime() != DateTime.MinValue)
                    secondsPassed = calculateTimeDiffInSeconds(pair.Value.getLastActivityTime(), currentTime);
                else
                    secondsPassed = calculateTimeDiffInSeconds(StartTime, currentTime);
                allIdle = allIdle && (secondsPassed >= allIdleTime);
            }
            if(usersInfo.Count==0)
                return false;
            return allIdle;
        }

        private Boolean NoGeogebraUsage(Dictionary<string, RoomUser> usersInfo)
        {
            DateTime currentTime = DateTime.Now;
            int timeFromStart = calculateTimeDiffInSeconds(StartTime, currentTime);
            if (timeFromStart <= geoCheckTime)
            {
                Boolean onlyGeoIdle = true;
                int actionPassed,messagePassed;
                foreach (KeyValuePair<string, RoomUser> pair in usersInfo)
                {
                    messagePassed = calculateTimeDiffInSeconds(pair.Value.getLastMessageTime(), currentTime);
                    actionPassed = calculateTimeDiffInSeconds(pair.Value.getLastActionTime(), currentTime);
                    Boolean noActionYet = (pair.Value.getLastActionTime() == DateTime.MinValue);
                    Boolean noMessageYet = (pair.Value.getLastMessageTime() == DateTime.MinValue);
                    if(!noActionYet)
                    {
                        if(!noMessageYet)
                        {
                            onlyGeoIdle = onlyGeoIdle && (actionPassed >= noActionTime) && (messagePassed < noActionTime);
                        }
                        else
                        {
                            onlyGeoIdle = false;
                        }
                    }
                    else
                    {
                        if (!noMessageYet)
                        {
                            onlyGeoIdle = onlyGeoIdle && (timeFromStart >= noActionTime) && (messagePassed < noActionTime);
                        }
                        else
                        {
                            onlyGeoIdle = false;
                        }
                    }
                }
                if(usersInfo.Count==0)
                    return false;
                return onlyGeoIdle;
            }
            return false;
        }

        private void CleanMessages()
        {
            DateTime currentTime = DateTime.Now;
            while (idleQueue.Count > 0 && calculateTimeDiffInSeconds(idleQueue.Peek().Value, currentTime) > idleUserInterval)
            {
                idleQueue.Dequeue();
            }
        }

        ///currently just give idle or not.
        ///if someone idle returns true
        ///otherwise returns false;
        ///list of idle users is ready, only need to return it.
        public KeyValuePair<Boolean, List<string>> GetIdleUsersInInterval(List<string> users)
        {
            CleanMessages();

            Dictionary<string, int> userActivityCount = new Dictionary<string,int>();
            foreach(string user in users)
            {
                userActivityCount.Add(user, 0);
            }

            int count =0;
            foreach (KeyValuePair<string,DateTime> userTimePair in idleQueue)
            {
                count++ ;
                if(users.Contains(userTimePair.Key))
                    userActivityCount[userTimePair.Key]++;
            }

            List<string> idleUsers = new List<string>();

            foreach(KeyValuePair<string,int> userCount in userActivityCount)
            {
                // if less than 10% in interval
                if (userCount.Value < count / 10)
                    idleUsers.Add(userCount.Key);
            }

            if (idleUsers.Count > 0)
                return new KeyValuePair<Boolean, List<string>>(true, idleUsers);
            return new KeyValuePair<Boolean, List<string>>(false, idleUsers);
        }

    }
}