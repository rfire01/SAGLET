﻿using SAGLET.Models;
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
        static int i=0;

        internal static List<CriticalMsgPoints> Analyze(VMsg msg)
        {
            List<CriticalMsgPoints> cps = new List<CriticalMsgPoints>();

            CriticalMsgPoints cp = new CriticalMsgPoints();
            cp.GroupID = msg.GroupID;
            cp.MsgID = msg.ID;
            cp.Priority = priority[i++ % priority.Length];
            
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
            // exception, if there is a problem with opening pipe - try again until pipe opened successfully
            while (true)
            {
                try
                {
                    var server = new NamedPipeServerStream("cpPipe");

                    server.WaitForConnection();

                    var br = new BinaryReader(server);
                    var bw = new BinaryWriter(server);

                    var buf = Encoding.UTF8.GetBytes(roomID.ToString() + ";" + message);     // Get ASCII byte array     
                    bw.Write((uint)buf.Length);                // Write string length
                    bw.Write(buf);                              // Write string

                    var len = (int)br.ReadUInt32();            // Read string length
                    var cpResponse = new string(br.ReadChars(len));    // Read string

                    server.Close();
                    server.Dispose();

                    return cpResponse;
                }
                catch (System.IO.IOException)
                { }
            }

        }

    }
}