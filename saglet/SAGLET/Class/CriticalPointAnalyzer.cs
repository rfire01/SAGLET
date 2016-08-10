using SAGLET.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.IO.Pipes;
using System.Text;

namespace SAGLET.Class
{
    public class CriticalPointAnalyzer
    {
        static string[] priority = { "1", "2" };
        static int i = 0;

        internal static List<CriticalMsgPoints> Analyze(VMsg msg)
        {
            List<CriticalMsgPoints> cps = new List<CriticalMsgPoints>();

            CriticalMsgPoints cp = new CriticalMsgPoints();
            cp.GroupID = msg.GroupID;
            cp.MsgID = msg.ID;
            cp.Priority = priority[i++ % priority.Length];

            // enable for running a demo script
            //switch (msg.Text)
            //{
            //    case "נראלי שזה מעוין כי האלכסונים שוים זה לזה ומאונכים זה לזה":
            //    {
            //        cp.Type = CriticalPointTypes.CR;
            //        cp.Priority = "1";
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "שימו לב האלכסונים מאונכים ושווים":
            //    {
            //        cp.Type = CriticalPointTypes.CM;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "ללא כול תכונה נוספת":
            //    {
            //        cp.Type = CriticalPointTypes.CM;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "אז זה לא דלתון!!":
            //    {
            //        cp.Type = CriticalPointTypes.C;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "למה":
            //    {
            //        cp.Type = CriticalPointTypes.Q;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "כי אין לו שני זוגות של צלעות שוות כל הזמן!":
            //    {
            //        cp.Type = CriticalPointTypes.Cre;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "זה סתם מרובע עם התכונות...":
            //    {
            //        cp.Type = CriticalPointTypes.C;
            //        cps.Add(cp);
            //        break;
            //    }
            //    case "אז אין לו הגדרה כי יש לו את התכונות  והוא לא משהוא":
            //    {
            //        cp.Type = CriticalPointTypes.CR;
            //        cps.Add(cp);
            //        break;
            //    }
            //}


            //TODO replace with eran's code

            //cp.Type = CriticalPointTypes.CR;
            //cps.Add(cp);

            //TestPipe.test("1;"+msg.Text);
            string cpReply = GetCriticalPoint(msg.GroupID, msg.Text);
            string[] splitReply = cpReply.Split(',');

            if (splitReply[0].CompareTo("DS") == 0)
                cp.Type = CriticalPointTypes.DS;
            else if (splitReply[0].CompareTo("TEC") == 0)
                cp.Type = CriticalPointTypes.TEC;
            else if (splitReply[0].CompareTo("NMD") == 0)
                cp.Type = CriticalPointTypes.NMD;
            else
                cp.Type = CriticalPointTypes.None;

            cps.Add(cp);

            return cps;
            //return null;
        }

        internal static ICollection<CriticalActionPoints> Analyze(VAction action)
        {
            //TODO replace with eran's code

            List<CriticalActionPoints> cps = new List<CriticalActionPoints>();

            CriticalActionPoints cp = new CriticalActionPoints();
            cp.TabID = action.TabID;
            cp.Priority = priority[i++ % priority.Length];
            cp.Type = CriticalPointTypes.I;
            cps.Add(cp);

            return null;
            //return cps;
        }

        private static string GetCriticalPoint(int roomID, string message)
        {
            // Open the named pipe.
            var server = new NamedPipeServerStream("cpPipe");

            server.WaitForConnection();

            var br = new BinaryReader(server);
            var bw = new BinaryWriter(server);

            var buf = Encoding.UTF8.GetBytes(roomID.ToString() + ";" + message);     // Get ASCII byte array     
            bw.Write((uint)buf.Length);                // Write string length
            bw.Write(buf);                              // Write string

            System.Threading.Thread.Sleep(100);
            var len = (int)br.ReadUInt32();            // Read string length
            var cpResponse = new string(br.ReadChars(len));    // Read string

            server.Close();
            server.Dispose();

            return cpResponse;
        }

    }
}