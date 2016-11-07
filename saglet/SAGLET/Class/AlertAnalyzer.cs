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

        // opens the room and returns true if the room was already existed or false otherwise
        public bool openRoom(int roomID)
        {
            //check if room already exists
            if (this.rooms.ContainsKey(roomID) == true)
            {
                //replace existing room, only if it wasnt used in the last 10 minutes
                if (this.rooms[roomID].RoomUnused())
                {
                    this.rooms.Remove(roomID);
                    this.rooms.Add(roomID, new RoomAnalyzer(roomID));
                    return true;
                }
            }
            else
            {
                this.rooms.Add(roomID, new RoomAnalyzer(roomID));
            }
            return false;
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

        //check what rooms are idle
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

        //check if roomID started (first message from student sent)
        public Boolean RoomStarted(int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                return this.rooms[roomID].RoomStarted();
            else
                return false;
        }

    }
}