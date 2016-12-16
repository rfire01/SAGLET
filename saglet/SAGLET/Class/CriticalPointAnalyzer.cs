using SAGLET.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.IO.Pipes;
using System.Text;
using System.Threading;
using SAGLET.Hubs;

namespace SAGLET.Class
{
    public class CriticalPointAnalyzer
    {
        static QueuedLock qlock = new QueuedLock();
        static string[] priority = { "1", "2" };
        static int i=0;

        //return the tag for a message and the room solution
        internal static List<CriticalMsgPoints> Analyze(VMsg msg, RoomDetailsHub hubDetails)
        {
            List<CriticalMsgPoints> cps = new List<CriticalMsgPoints>();

            CriticalMsgPoints cp = new CriticalMsgPoints();
            cp.GroupID = msg.GroupID;
            cp.MsgID = msg.ID;
            cp.Priority = priority[i++ % priority.Length];

            string cpReply = GetCriticalPoint(msg.GroupID, msg.Text, hubDetails);
            string[] splitReply = cpReply.Split(',');

            if (splitReply[0].CompareTo("DS") == 0)
                if(splitReply[1].CompareTo("0")==0)
                    cp.Type = CriticalPointTypes.WDS;
                else if(splitReply[1].CompareTo("1")==0)
                    cp.Type = CriticalPointTypes.CDS;
                else
                    cp.Type = CriticalPointTypes.DS;
            else if (splitReply[0].CompareTo("TEC") == 0)
                cp.Type = CriticalPointTypes.TEC;
            else if (splitReply[0].CompareTo("NMD") == 0)
                cp.Type = CriticalPointTypes.NMD;
            else
                cp.Type = CriticalPointTypes.None;

            cps.Add(cp);

            return cps;
        }

        //currently actions dont have any tags
        internal static ICollection<CriticalActionPoints> Analyze(VAction action)
        {
            List<CriticalActionPoints> cps = new List<CriticalActionPoints>();

            CriticalActionPoints cp = new CriticalActionPoints();
            cp.TabID = action.TabID;
            cp.Priority = priority[i++ % priority.Length];
            cp.Type = CriticalPointTypes.None;
            cps.Add(cp);

            return cps;
        }

        private static string GetCriticalPoint(int roomID, string message, RoomDetailsHub hubDetails)
        {
            // Open the named pipe.
            // exception, if there is a problem with opening pipe - try again until pipe opened successfully (in case 2 threads try to open the pipe at the same time)
            qlock.Enter();

            while (true)
            {
                try
                {
                    var server = new NamedPipeServerStream("cpPipe");

                    server.WaitForConnection();

                    var br = new BinaryReader(server);
                    var bw = new BinaryWriter(server);

                    var buf = Encoding.UTF8.GetBytes(roomID.ToString() + ";" + message);     // Get ASCII byte array     
                    bw.Write((uint)buf.Length); // Write string length
                    bw.Write(buf); // Write string

                    var len = (int)br.ReadUInt32(); // Read string length
                    var cpResponse = new string(br.ReadChars(len)); // Read string

                    if (server.IsConnected)
                        server.Disconnect();
                    server.Close();
                    server.Dispose();

                    qlock.Exit();

                    return cpResponse;
                }
                catch (IOException) { } //should not happen
            }
        }
    }
}