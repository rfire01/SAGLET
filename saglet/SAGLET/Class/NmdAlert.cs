﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class NmdAlert
    {
        private int nmdTimeWindow;
        private int startRoomWaitTime;
        private DateTime startRoomTime;
        private Boolean roomOpen;
        private int nmdCount;
        private Queue<DateTime> messagesTime;
        private Queue<CriticalPointTypes> messagesType;
        private int AlertWaitTime;
        private DateTime lastAlertTime;

        public NmdAlert()
        {
            this.nmdTimeWindow = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["nmdTimeWindow"]);
            this.startRoomWaitTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["startRoomWaitTime"]);
            this.AlertWaitTime = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["nmdAlertWaitTime"]);
            this.startRoomTime = new DateTime();
            this.messagesTime = new Queue<DateTime>();
            this.messagesType = new Queue<CriticalPointTypes>();
            this.roomOpen = false;
            this.nmdCount = 0;
            this.lastAlertTime = new DateTime();
        }

        public Boolean NmdStarted()
        {
            return roomOpen;
        }
        
        public Boolean NmdInAlertWaitTime()
        {
            DateTime currentTime = DateTime.Now;
            int secondsPass = calculateTimeDiffInSeconds(lastAlertTime, currentTime);
            return ((secondsPass < AlertWaitTime) && lastAlertTime != DateTime.MinValue);
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag)
        {
            if (!roomOpen)
                checkRoomNeedToOpen(); //check if need to try to open room again

            if (roomOpen)
            {
                Boolean alert = false;
                alert = alert || HandleNMDRow(tag);
                alert = alert || HandleNMDWindow(tag);

                DateTime currentTime = DateTime.Now;
                int secondsPass = calculateTimeDiffInSeconds(lastAlertTime, currentTime);
                if (alert && (lastAlertTime == DateTime.MinValue || secondsPass >= AlertWaitTime))
                {
                    lastAlertTime = currentTime;
                    clearAfterAlert();
                    return CriticalPointTypes.NMD;
                }
            }
            return CriticalPointTypes.None;
        }

        private int calculateTimeDiffInSeconds(DateTime oldTime, DateTime newTime)
        {
            TimeSpan diff = newTime.Subtract(oldTime);
            return (diff.Seconds + diff.Minutes * 60 + diff.Hours * 3600 + diff.Days * 3600 * 24);
        }

        //check if it has been "startRoomTime" seconds since first message sent in the room
        private void checkRoomNeedToOpen()
        {
            if (startRoomTime == DateTime.MinValue)
                startRoomTime = DateTime.Now;
            //check if room hasn't started yet
            if (!roomOpen)
            {
                int secondsPassed = calculateTimeDiffInSeconds(startRoomTime, DateTime.Now);
                if (secondsPassed >= startRoomWaitTime)
                    roomOpen = true;
            }
        }

        //send nmd alert if there were 10 nmd messages in a row
        private Boolean HandleNMDRow(CriticalPointTypes tag)
        {
            if (tag == CriticalPointTypes.NMD)
                nmdCount++;
            else
                nmdCount = 0;

            if (nmdCount >= 10)
                return true;
            return false;
        }

        //send nmd alert if 70% of messages sent in last "nmdTimeWindow" seconds are tagged as nmd
        private Boolean HandleNMDWindow(CriticalPointTypes newTag)
        {
            DateTime currentTime = DateTime.Now;
            while (messagesTime.Count>0 && calculateTimeDiffInSeconds(messagesTime.Peek(), currentTime) > nmdTimeWindow)
            {
                messagesTime.Dequeue();
                messagesType.Dequeue();
            }

            messagesTime.Enqueue(currentTime);
            messagesType.Enqueue(newTag);

            int count = 0;
            foreach (CriticalPointTypes tag in messagesType)
            {
                if (tag.CompareTo(CriticalPointTypes.NMD) == 0)
                    count++;
            }

            if (messagesType.Count > 9 && ((100 * count) / messagesType.Count) >= 70)
                return true;
            return false;
        }

        //if specific user caused nmd alert, this function make sure that no other nmd alert will be send for "AlertWaitTime" seconds
        public void user_alert()
        {
            if (!NmdInAlertWaitTime())
            {
                lastAlertTime = DateTime.Now;
                clearAfterAlert();
            }
        }

        public void clearAfterAlert()
        {
            nmdCount = 0;
            messagesType.Clear();
            messagesTime.Clear();
        }

    }
}