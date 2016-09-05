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

        public RoomAnalyzer(int roomID)
        {
            this.roomID = roomID;
            this.usersInfo = new Dictionary<string, RoomUser>();
            this.nmdAlert = new NmdAlert();
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag, string user)
        {
            CriticalPointTypes nmdRes = nmdAlert.HandleMessage(tag);
            CriticalPointTypes userRes = usersInfo[user].HandleMessage(tag);

            if (nmdRes == CriticalPointTypes.NMD || userRes == CriticalPointTypes.NMD)
                return CriticalPointTypes.NMD;
            else
                return CriticalPointTypes.None;
        }

        public CriticalPointTypes HandleAction(string user)
        {
            CriticalPointTypes userRes = usersInfo[user].HandleAction();
            return CriticalPointTypes.None;
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