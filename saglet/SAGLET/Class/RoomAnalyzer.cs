using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class RoomAnalyzer
    {
        private int roomID;
        private Dictionary<string, RoomUser> usersInfo;
        private NmdAlert nmdAlert;
        private IdleAlert idleAlert;
        private TecAlert tecAlert;
        private Boolean roomStarted;
        private DateTime lastUpdate;
        private DateTime lastEmpty;

        public RoomAnalyzer(int roomID)
        {
            this.roomID = roomID;
            this.usersInfo = new Dictionary<string, RoomUser>();
            this.nmdAlert = new NmdAlert();
            this.idleAlert = new IdleAlert();
            this.tecAlert = new TecAlert();
            this.roomStarted = false;
            this.lastUpdate = DateTime.MinValue;
            this.lastEmpty = DateTime.MinValue;
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag, string user)
        {
            lastUpdate = DateTime.Now;
            if (!roomStarted)
                roomStarted = true;
            
            AddUserToRoom(user); //in case missed a user joined room

            //check if any alert need to be sent
            idleAlert.HandleMessage(user);
            CriticalPointTypes nmdRes = nmdAlert.HandleMessage(tag);
            CriticalPointTypes userRes = usersInfo[user].HandleMessage(tag, nmdAlert.NmdStarted());
            CriticalPointTypes tecRes = tecAlert.HandleMessage(tag);

            if (nmdRes == CriticalPointTypes.NMD || (userRes == CriticalPointTypes.NMD && !nmdAlert.NmdInAlertWaitTime()))
            {
                if (userRes == CriticalPointTypes.NMD)
                {
                    usersInfo[user].resetNmdAfterAlert();
                    nmdAlert.user_alert();
                }
                return CriticalPointTypes.NMD;
            }
            else if (tecRes == CriticalPointTypes.TEC || (userRes == CriticalPointTypes.TEC && !tecAlert.TecInAlertWaitTime()))
            {
                if (userRes == CriticalPointTypes.TEC)
                {
                    usersInfo[user].resetTecAfterAlert();
                    tecAlert.user_alert();
                }
                return CriticalPointTypes.TEC;
            }
            return CriticalPointTypes.None;
        }

        public CriticalPointTypes HandleAction(string user)
        {
            lastUpdate = DateTime.Now;
            AddUserToRoom(user); //in case missed a user joined room
            CriticalPointTypes userRes = usersInfo[user].HandleAction();
            return CriticalPointTypes.None;
        }
        
        //check if room is idle
        public KeyValuePair<CriticalPointTypes, List<string>> CheckForIdle()
        {
            return idleAlert.CheckIdle(usersInfo);
        }

        public void AddUserToRoom(string userID)
        {
            if (!usersInfo.ContainsKey(userID))
            {
                usersInfo.Add(userID, new RoomUser(userID));
                if (usersInfo.Count == 1)
                    lastEmpty = DateTime.MinValue;
            }
        }

        public void RemoveUserFromRoom(string userID)
        {
            if (usersInfo.ContainsKey(userID) == true)
            {
                usersInfo.Remove(userID);
                if (usersInfo.Count == 0)
                    lastEmpty = DateTime.Now;
            }
        }

        private int calculateTimeDiffInSeconds(DateTime oldTime, DateTime newTime)
        {
            TimeSpan diff = newTime.Subtract(oldTime);
            return (diff.Seconds + diff.Minutes * 60 + diff.Hours * 3600 + diff.Days * 3600 * 24);
        }

        public Boolean RoomStarted()
        {
            return roomStarted;
        }

        // return if its been more than 30 minutes since last user left the room
        public Boolean RoomUnused()
        {
            if (lastEmpty != DateTime.MinValue && calculateTimeDiffInSeconds(lastEmpty, DateTime.Now) >= 30 * 60)
                return true;
            return false;
        }

    }
}