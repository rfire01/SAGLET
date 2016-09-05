using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SAGLET.Models;

namespace SAGLET.Class
{
    public class RoomUser
    {
        private string id;
        private DateTime lastMessageTime;
        private DateTime lastActionTime;
        private int nmdCount;

        public RoomUser(string id)
        {
            this.id = id;
            this.nmdCount = 0;
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag,Boolean nmdStarted)
        {
            lastMessageTime = DateTime.Now;
            if(!nmdStarted)
                return CriticalPointTypes.None;

            if (tag == CriticalPointTypes.NMD)
                nmdCount++;
            else
                nmdCount = 0;

            if (nmdCount >= 6)
                return CriticalPointTypes.NMD;
            else
                return CriticalPointTypes.None;
        }

        public CriticalPointTypes HandleAction()
        {
            lastActionTime = DateTime.Now;
            return CriticalPointTypes.None;
        }

        public DateTime getLastMessageTime()
        {
            return lastMessageTime;
        }

        public DateTime getLastActionTime()
        {
            return lastActionTime;
        }

        public DateTime getLastActivityTime()
        {
            if (lastActionTime > lastMessageTime)
                return lastActionTime;
            else
                return lastMessageTime;
        }

    }
}