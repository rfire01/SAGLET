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

        public RoomAnalyzer(int roomID)
        {
            this.roomID = roomID;
            this.usersInfo = new Dictionary<string, RoomUser>();
            this.nmdAlert = new NmdAlert();
            this.idleAlert = new IdleAlert();
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag, string user)
        {
            int a;
            if (user.CompareTo("server") == 0)
                a = 1;
            //in case missed a user joined room
            AddUserToRoom(user);
            //
            idleAlert.HandleMessage(user);
            CriticalPointTypes nmdRes = nmdAlert.HandleMessage(tag);
            CriticalPointTypes userRes = usersInfo[user].HandleMessage(tag, nmdAlert.NmdStarted());

            return CriticalPointTypes.None;

            if (nmdRes == CriticalPointTypes.NMD || (userRes == CriticalPointTypes.NMD && !nmdAlert.NmdInAlertWaitTime()))
                return CriticalPointTypes.NMD;
            else
                return CriticalPointTypes.None;
        }

        public CriticalPointTypes HandleAction(string user)
        {
            int a;
            if (user.CompareTo("server") == 0)
                a = 1;
            //in case missed a user joined room
            AddUserToRoom(user);
            //
            CriticalPointTypes userRes = usersInfo[user].HandleAction();
            return CriticalPointTypes.None;
        }

        public CriticalPointTypes CheckForIdle()
        {
            return idleAlert.CheckIdle(usersInfo);
        }

        public void AddUserToRoom(string userID)
        {
            if (!usersInfo.ContainsKey(userID))
            {
                usersInfo.Add(userID, new RoomUser(userID));
            }
        }

        public void RemoveUserFromRoom(string userID)
        {
            if (usersInfo.ContainsKey(userID) == true)
            {
                usersInfo.Remove(userID);
            }
        }

        private int calculateTimeDiffInSeconds(DateTime oldTime, DateTime newTime)
        {
            TimeSpan diff = newTime.Subtract(oldTime);
            return (diff.Seconds + diff.Minutes * 60 + diff.Hours * 3600 + diff.Days * 3600 * 24);
        }

    }
}