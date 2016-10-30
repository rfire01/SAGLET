using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Quobject.SocketIoClientDotNet.Client;
using System.Web;
using System.Threading;
using Quobject.EngineIoClientDotNet.Modules;
using SAGLET.Controllers;
using System.Text.RegularExpressions;
using System.Diagnostics;

namespace SAGLET.Class
{
    public class VmtDevAPI
    {
        public static String VMT_URL = "http://vmtdev.mathforum.org:80";
        private static RoomsController ctrl = RoomsController.Instance;
        private static Dictionary<int, Socket> chatSockets = new Dictionary<int, Socket>();
        private static Dictionary<int, Socket> actionSockets = new Dictionary<int, Socket>();

        public static string GetChatHistory(int id, int startIndex)
        {
            ManualResetEvent ManualResetEvent = new ManualResetEvent(false);

            Debug.WriteLine(String.Format("GetChatHistory({0}) | (msgs) Starting!", id));
            string results = "";
            var socket = IO.Socket(VMT_URL);

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("chatReady", "room" + id.ToString(), startIndex, 0);
                Debug.WriteLine(String.Format("GetChatHistory({0}) | (msgs) User Connected!", id));

            });
            socket.On("chatList", (data) =>
            {
                Debug.WriteLine(String.Format("GetChatHistory({0}) | (msgs) Data received!", id));
                results = data.ToString();
                ManualResetEvent.Set();
            });

            bool signalled = ManualResetEvent.WaitOne(5000, true);       //wait up to 5 secs
            if (signalled) Debug.WriteLine(String.Format("GetChatHistory({0}) | (msgs) Released Successfully!", id));
            else
            {
                Debug.WriteLine(String.Format("GetChatHistory({0}) | (msgs) TIMED OUT!", id));
                results = null;
            }

            socket.Close();
            return results;
        }

        public static string GetActionHistory(int tabID, int startIndex)
        {
            ManualResetEvent ManualResetEvent = new ManualResetEvent(false);

            Debug.WriteLine(String.Format("GetActionHistory({0}) | (actions) Starting!", tabID));
            string results = "";
            var socket = IO.Socket(VMT_URL);

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("tabReady", tabID.ToString(), startIndex);
                Debug.WriteLine(String.Format("GetActionHistory({0}) | (actions) User Connected!", tabID));
            });

            var listener = new TwoArgumentsListener((tabId, actionList) =>
            {
                Debug.WriteLine(String.Format("GetActionHistory({0}) | (actions) Data received!", tabID));
                results = actionList.ToString();
                ManualResetEvent.Set();
            });

            socket.On("actionList", listener);

            bool signalled = ManualResetEvent.WaitOne(5000, true);       //wait up to 5 secs
            if (signalled) Debug.WriteLine(String.Format("GetActionHistory({0}) | (actions) Released Successfully!", tabID));
            else
            {
                Debug.WriteLine(String.Format("GetActionHistory({0}) | (actions) TIMED OUT!", tabID));
                results = null;
            }

            socket.Close();
            return results;
        }

        // not used for now
        public static void RegisterUserJoinLeave(int id)
        {
            var socket = IO.Socket(VMT_URL);

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("observeRoom", "room" + id.ToString());

            });
            socket.On(Socket.EVENT_DISCONNECT, () =>
            {
                socket.Emit("user disconnected");
            });
        }

        public static void RegisterLiveChat(int id)
        {
            if (chatSockets.ContainsKey(id))
                return;


            var socket = IO.Socket(VMT_URL);
            chatSockets[id] = socket;

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("observeRoom", "room" + id.ToString());
                Debug.WriteLine(String.Format("RegisterLiveChat({0}) | User Connected!", id));

            });
            socket.On(Socket.EVENT_DISCONNECT, () =>
            {
                socket.Emit("user disconnected");
                Debug.WriteLine(String.Format("RegisterLiveChat({0}) | User Disconnected!", id));
            });

            socket.On("showChat", (data) =>
            {
                Debug.WriteLine(String.Format("RegisterLiveChat({0}) | New Msg!", id));
                string results = data.ToString();
                ctrl.ResetState();
                ctrl.HandleLiveMessage(id, results);
            });
        }

        public static void RegisterLiveActions(int roomID)
        {
            if (actionSockets.ContainsKey(roomID))
                return;
            var socket = IO.Socket(VMT_URL);
            actionSockets[roomID] = socket;

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("observeRoom", "room" + roomID.ToString());
                Debug.WriteLine(String.Format("RegisterLiveActions({0}) | User Connected!", roomID));

            });
            socket.On(Socket.EVENT_DISCONNECT, () =>
            {
                socket.Emit("user disconnected");
                Debug.WriteLine(String.Format("RegisterLiveActions({0}) | User Disconnected!", roomID));
            });


            var listener = new FourArgumentsListener((eventName, actID, url, log) =>
            {
                Debug.WriteLine(String.Format("RegisterLiveActions({0}) | New Action!", roomID));
                ctrl.ResetState();
                ctrl.HandleLiveAction(actID.ToString(), url.ToString(), log.ToString(), eventName.ToString(),roomID);
            });

            socket.On("ccAction", listener);
        }

        //returns a list of users that are currently connected to roomID
        public static List<string> GetUsersConnected(int roomID)
        {
            ManualResetEvent ManualResetEvent = new ManualResetEvent(false);
            List<string> results = new List<string>();

            var socket = IO.Socket(VMT_URL);

            socket.On(Socket.EVENT_CONNECT, () =>
            {
                socket.Emit("getRoomUsers", "room" + roomID);
            });

            socket.On("usersInRoom", (data) =>
            {
                results = AnalyzeUsersString(data.ToString());
                ManualResetEvent.Set();
            });

            ManualResetEvent.WaitOne();
            socket.Close();

            return results;
        }

        private static List<string> AnalyzeUsersString(string json)
        {
            List<string> users = new List<string>();
            if (json.Length <= 2) return users;

            string[] quoteSplit = json.Split('"');
            foreach(string possibleUser in quoteSplit)
            {
                if (Regex.Matches(possibleUser, @"(?<!\\)\w+").OfType<Match>().Select(u => u.Value).ToList().Count > 0)
                    users.Add(possibleUser);
            }
            return users;
        }

        public static void CloseSocket(int id)
        {
            Debug.WriteLine(String.Format("CloseSocket({0}) | Closing connection!", id));
            if (chatSockets[id] != null) chatSockets[id].Close();
            if (actionSockets[id] != null) actionSockets[id].Close();
        }

        public static void OpenAnalyzeRooms(List<int> rooms)
        {
            int idleWindow = Int32.Parse(System.Configuration.ConfigurationManager.AppSettings["idlenessWindow"]);
            ctrl.IdlenessOpenRoom(idleWindow, rooms);
            ctrl.RestartSolutionIndex(rooms);
        }

        //check with timer for idle alerts
        public static void HandleIdleness(List<int> rooms)
        {
            ctrl.getRoomIdles(rooms);
        }

        //need to be updated later, to get solutions according to excel files
        public static List<string> getSolutions(int roomID)
        {
            List<string> sol = new List<string>();
            sol.Add("דלתון");
            sol.Add("מעוין");
            return sol;
        }
    }
}