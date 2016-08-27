using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAGLET.Controllers
{
    public class IdlenessAnalyzer
    {
        private Dictionary<int, roomIdleness> rooms;
        private List<string> teachers;
        private System.Timers.Timer Timer;

        public IdlenessAnalyzer(List<string> teachers)
        {
            this.teachers = teachers;
            this.rooms = new Dictionary<int, roomIdleness>();

            /* start timer to tick once per hour
             * if 24 hours passed without any activity, close room
            */
            this.Timer = new System.Timers.Timer();
            Timer.Elapsed += new System.Timers.ElapsedEventHandler(checkNoActivity);
            Timer.Interval = 1000 * 60 * 60; // 1000 ms * 60 seconds * 60 minutes : timer interval of 1 hour
            Timer.Start();
        }

        public void openRoom(int idlenessWindow, int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
            {
                this.rooms[roomID].closeRoom();
                this.rooms.Remove(roomID);
                this.rooms.Add(roomID, new roomIdleness(roomID, idlenessWindow));
            }
            else
            {
                this.rooms.Add(roomID, new roomIdleness(roomID,idlenessWindow));
            }
        }

        public void user_joined(int roomID, string user)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                if(!this.teachers.Contains(user))
                    this.rooms[roomID].addUser(user);
        }

        public void user_left(int roomID, string user)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                if (!this.teachers.Contains(user))
                    this.rooms[roomID].removeUser(user);
        }

        public void user_activity(int roomID, string user)
        {
            if (this.rooms.ContainsKey(roomID) == true)
                if (!this.teachers.Contains(user))
                    this.rooms[roomID].newActivity(user);
        }

        public List<string> whoIsIdle(int roomID)
        {
            if (this.rooms.ContainsKey(roomID) == true)
            {
                return this.rooms[roomID].idleUsers();
            }
            else
            {
                return new List<string>();
            }
        }

        private void checkNoActivity(object source, System.Timers.ElapsedEventArgs e)
        {
            foreach (KeyValuePair<int, roomIdleness> pair in this.rooms)
            {
                if (pair.Value.isClosed())
                    this.rooms.Remove(pair.Key);
            }
        }

    }
}
