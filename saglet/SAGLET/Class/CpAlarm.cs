using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SAGLET.Models;
using System.Configuration;

using System.IO;

namespace SAGLET.Class
{
    public class CpAlarm
    {
        private Queue<CriticalPointTypes> cpWindow;
        private int windowSize;
        private int[] cpCount;
        private string lastAlert;
        private int dsAlert;
        private int nmdAlert;

        public CpAlarm()
        {
            this.cpWindow = new Queue<CriticalPointTypes>();
            this.windowSize = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["cpWindowSize"]);
            this.cpCount = new int[3]{0,0,0}; // {DS,NMD,other}
            this.lastAlert = "None";
            this.dsAlert = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["DSinARow"]);
            this.nmdAlert = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["NMDinARow"]);
        }

        public CriticalMsgPoints NewCp(List<CriticalMsgPoints> cps)
        {
            CriticalMsgPoints res = new CriticalMsgPoints();
            CriticalPointTypes cp = cps[0].Type;
            if(cpCount.Sum()<windowSize)
            {
                cpWindow.Enqueue(cp);
                if (cp == CriticalPointTypes.DS)
                    cpCount[0]++;
                else if (cp == CriticalPointTypes.NMD)
                    cpCount[1]++;
                else
                    cpCount[2]++;
            }
            else
            {
                CriticalPointTypes throwCp = cpWindow.Dequeue();
                if (throwCp == CriticalPointTypes.DS)
                    cpCount[0]--;
                else if (throwCp == CriticalPointTypes.NMD)
                    cpCount[1]--;
                else
                    cpCount[2]--;
                cpWindow.Enqueue(cp);
                if (cp == CriticalPointTypes.DS)
                    cpCount[0]++;
                else if (cp == CriticalPointTypes.NMD)
                    cpCount[1]++;
                else
                    cpCount[2]++;
            }

            if (cpCount[0] >= dsAlert && lastAlert != "DS")
            {
                lastAlert = "DS";
                res.Type = CriticalPointTypes.DS;
            }
            else if (cpCount[1] >= nmdAlert && lastAlert != "NMD")
            {
                lastAlert = "NMD";
                res.Type = CriticalPointTypes.NMD;
            }
            else
            {
                lastAlert = "None";
                res.Type = CriticalPointTypes.None;
            }

            return res;
        }
    }
}