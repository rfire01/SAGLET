using SAGLET.Models;
using System;
using System.Net;
using System.Net.Sockets;
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

            string cpReply = GetCriticalPoint(msg.GroupID, msg.Text);
            string[] splitReply = cpReply.Split(',');

            if (splitReply[0].CompareTo("DS") == 0)
                if(splitReply[1].CompareTo("0") == 0)
                    cp.Type = CriticalPointTypes.WDS;
                else if(splitReply[1].CompareTo("1") == 0)
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

        private static string GetCriticalPoint(int roomID, string message)
        {
            // Get the lock
            qlock.Enter();

            byte[] bytes = new byte[32];
            try
            {
                Socket client = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                client.Connect(IPAddress.Parse("127.0.0.1"), 5999);

                client.Send(Encoding.UTF8.GetBytes(roomID.ToString() + ";" + message));
                int bytesRec = client.Receive(bytes);
                string cpResponse = Encoding.UTF8.GetString(bytes, 0, bytesRec);

                client.Shutdown(SocketShutdown.Both);
                client.Close();

                return cpResponse;
            }
            catch (ArgumentNullException ane)
            {
                Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
            }
            catch (SocketException se)
            {
                Console.WriteLine("SocketException : {0}", se.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine("Unexpected exception : {0}", e.ToString());
            }
            finally
            {
                qlock.Exit();
            }

            return "NaN,0";
        }
    }
}