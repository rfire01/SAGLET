using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class AlertAnalyzer
    {
        private Dictionary<int, RoomAnalyzer> rooms;

        public AlertAnalyzer()
        {
            this.rooms = new Dictionary<int, RoomAnalyzer>();
        }

        public void openRoom(int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
            {
                this.rooms.Remove(roomID);
                this.rooms.Add(roomID, new RoomAnalyzer(roomID));
            }
            else
            {
                this.rooms.Add(roomID, new RoomAnalyzer(roomID));
            }
        }

        public void user_joined(int roomID, string user)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                this.rooms[roomID].AddUserToRoom(user);
        }

        public void user_left(int roomID, string user)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                this.rooms[roomID].RemoveUserFromRoom(user);
        }

        public CriticalMsgPoints user_msg(int roomID, string user, List<CriticalMsgPoints> cps)
        {
            CriticalPointTypes alert = CriticalPointTypes.None;
            if (this.rooms.ContainsKey(roomID) == true)
            {

                alert = this.rooms[roomID].HandleMessage(cps[0].Type, user);
            }

            CriticalMsgPoints res = new CriticalMsgPoints();
            res.Type = alert;
            return res;
        }

        public CriticalActionPoints user_action(int roomID, string user)
        {
            CriticalPointTypes alert = CriticalPointTypes.None;
            if (this.rooms.ContainsKey(roomID) == true)
            {
                alert = this.rooms[roomID].HandleAction(user);
            }

            CriticalActionPoints res = new CriticalActionPoints();
            res.Type = alert;
            return res;
        }

        public KeyValuePair<CriticalPointTypes, List<string>> IsIdle(int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
            {
                return this.rooms[roomID].CheckForIdle();
            }
            else
            {
                return new KeyValuePair<CriticalPointTypes, List<string>>(CriticalPointTypes.None,new List<string>());
            }
        }

        public Boolean RoomStarted(int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                return this.rooms[roomID].RoomStarted();
            else
                return false;
        }

    }
}