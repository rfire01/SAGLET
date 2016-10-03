﻿using System;
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
        private int tecCount;

        public RoomUser(string id)
        {
            this.id = id;
            this.nmdCount = 0;
            this.tecCount = 0;
        }

        public CriticalPointTypes HandleMessage(CriticalPointTypes tag,Boolean nmdStarted)
        {
            lastMessageTime = DateTime.Now;
            //if(!nmdStarted)
            //    return CriticalPointTypes.None;

            if (tag == CriticalPointTypes.NMD && nmdStarted)
                nmdCount++;
            else if (tag == CriticalPointTypes.TEC)
            {
                nmdCount = 0;
                tecCount++;
            }
            else
            {
                nmdCount = 0;
                tecCount = 0;
            }

            if (nmdCount >= 6)
                return CriticalPointTypes.NMD;
            else if (tecCount == 3)
                return CriticalPointTypes.TEC;
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