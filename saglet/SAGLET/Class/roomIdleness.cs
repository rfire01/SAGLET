using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAGLET.Controllers
{
    class roomIdleness
    {
        private DateTime lastActivity;
        private DateTime roomStartTime;
        private int roomID;
        private int idleWindow; //in seconds
        private Dictionary<string, DateTime> userIdleness;
        private System.Timers.Timer Timer;
        private Boolean closed;

        public roomIdleness(int id, int window)
        {
            this.lastActivity = DateTime.Now;
            this.roomStartTime = DateTime.Now;
            this.roomID = id;
            this.idleWindow = window;
            this.userIdleness = new Dictionary<string, DateTime>();

            this.closed = false;
            /* start timer to tick once per hour
             * if 24 hours passed without any activity, close room
            */
            this.Timer = new System.Timers.Timer();
            Timer.Elapsed += new System.Timers.ElapsedEventHandler(checkNoActivity);
            Timer.Interval = 1000 * 60 * 60; // 1000 ms * 60 seconds * 60 minutes : timer interval of 1 hour
            Timer.Start();
        }

        public void addUser(string user)
        {
            this.userIdleness.Add(user, DateTime.Now);
        }

        public void removeUser(string user)
        {
            if (this.userIdleness.ContainsKey(user) == true)
                this.userIdleness.Remove(user);
        }

        public void newActivity(string user)
        {
            if (this.userIdleness.ContainsKey(user) == true)
            {
                this.userIdleness[user] = DateTime.Now;
                this.lastActivity = DateTime.Now;
            }
        }

        public List<string> idleUsers()
        {
            List<string> res = new List<string>();
            TimeSpan diff;
            foreach (KeyValuePair<string, DateTime> pair in this.userIdleness)
            {
                diff = DateTime.Now.Subtract(this.userIdleness[pair.Key]);
                if(diff.Seconds >= this.idleWindow)
                    res.Add(pair.Key);
            }
            return res;
        }

        public void closeRoom()
        {
            if(!this.closed)
            {
                this.Timer.Stop();
                this.closed = true;
            }
        }

        public Boolean isClosed()
        {
            return this.closed;
        }

        private void checkNoActivity(object source, System.Timers.ElapsedEventArgs e) 
        {
            if(DateTime.Now.Subtract(this.lastActivity).Hours>=24)
            {
                this.closeRoom();
            }
        }
    }
}
