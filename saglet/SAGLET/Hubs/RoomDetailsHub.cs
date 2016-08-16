using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using SAGLET.Models;
using Hangfire;
using System.Threading.Tasks;
using SAGLET.Class;


namespace SAGLET.Hubs
{
    [Authorize]
    public class RoomDetailsHub : Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<RoomDetailsHub>();
        static string toolbarStr = "-ToolBar";


        internal void UpdateComplete(string roomID)
        {
            context.Clients.Client(Context.ConnectionId).updateCompleted("Room " + roomID + " Update completed");
        }

        internal void UpdateError(string roomID, string msg)
        {
            context.Clients.Client(Context.ConnectionId).updateFailed(msg);
        }

        internal void UpdateFailed(string roomID)
        {
            UpdateError(roomID, String.Format("Room {0} Update failed", roomID));
        }

        /// Assaf
        public void JoinGroup(string roomsFromClient)
        {
            using (SagletModel db = new SagletModel())
            {
                //List<int> rooms = db.Moderators.Find(AppHelper.GetVmtUser()).RoomsAllowed.Where(r => r.Sync).Select(r => r.ID).ToList();
                List<String> rooms = roomsFromClient.Split(',').ToList();
                foreach (string roomID in rooms)
                {
                    //int x = Int32.Parse(roomID);
                    //VmtDevAPI.RegisterLiveChat(x);
                    Groups.Add(Context.ConnectionId, roomID.ToString());
                }
                context.Clients.Client(Context.ConnectionId).registeredComplete("Registered succesfully to rooms: " + roomsFromClient);
            }
        }

        private List<int> RegisterToToolBarGroups()
        {
            string user = AppHelper.GetVmtUser();
            List<int> roomsIDs = null;
            using (SagletModel db = new SagletModel())
            {
                roomsIDs = db.Moderators.Find(user).RoomsAllowed.Select(x => x.ID).ToList();
                foreach (int roomID in roomsIDs)
                {
                    context.Groups.Add(Context.ConnectionId, roomID + toolbarStr);
                }
            }
            return roomsIDs;
        }

       
        internal void UpdateRoomMsgLiveControl(string roomID, VMsg msg)
        {   
            context.Clients.Group(roomID).updateRoomMsgLive(roomID, msg.CriticalPoints);
            //context.Clients.Client(Context.ConnectionId).updateNewMsg(msg);

        }

        internal void UpdateRoomUser(string roomID, string userID, bool isOnline)
        {
            int i_roomID = Convert.ToInt32(roomID);
            UserData data = ExtractUserData(i_roomID, userID, isOnline);
            context.Clients.Group(roomID).UpdateRoomUserGraph(roomID, data);                    //graph users
            context.Clients.Group(roomID + toolbarStr).UpdateRoomUserToolBar(roomID, data);     //toolbar users
            context.Clients.Group(roomID + toolbarStr).UpdateUsersGraphToolBar(roomID, data);   //toolbar users graph
        }

        internal void UpdateRoomMsgLive(string roomID, VMsg msg)
        {
            if (msg != null)
            {
                ActionMsg jsonMsg = new ActionMsg(msg.ID, msg.UserID, msg.TimeStamp, msg.Text, msg.Sentiment);
                context.Clients.Group(roomID).updateRoomMsgLive(roomID, jsonMsg);
            }
        }

        internal void UpdateRoomActionLiveControl(string roomID, VAction act)
        {
            UpdateRoomActionLive(roomID, act);
            UpdateRoomUser(roomID, act.UserID, true);

            if (act.CriticalPoints == null) return;
            foreach (CriticalActionPoints cp in act.CriticalPoints)
            {
                UpdateNewCP(roomID, cp);
            }
        }

        internal void UpdateRoomActionLive(string roomID, VAction act)
        {
            if (act != null)
            {
                ActionMsg jsonAction = new ActionMsg(act.ID, act.UserID, act.TimeStamp, act.ToStringWithoutUser(), -1);
                context.Clients.Group(roomID).updateRoomActionLive(roomID, act.TabID, jsonAction);
            }
        }

        internal void UpdateRoomAtmosphere(string roomID, bool publishGlobaly)
        {
            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(Convert.ToInt32(roomID));
                if (room == null)
                {
                    UpdateError(roomID, String.Format("room {0} not found on server", roomID));
                    return;
                }
                int avg = 50;
                if (room.RoomGroup.Msgs.Count > 0) avg = (int)room.RoomGroup.Msgs.Average(m => m.Sentiment);
                if (publishGlobaly) context.Clients.Group(roomID).updateAtmosphere(roomID, avg);    //publish globally
                else context.Clients.Client(Context.ConnectionId).updateAtmosphere(roomID, avg);    //public locally          
            }
        }

        internal void UpdateRoomSTR(string roomID, bool publishGlobaly)
        {
            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(Convert.ToInt32(roomID));
                if (room == null)
                {
                    UpdateError(roomID, String.Format("room {0} not found on server", roomID));
                    return;
                }
                List<string> roomMods = room.ModeratorsAllowed.Select(m => m.Username).ToList();
                double usersMsgCount = room.RoomGroup.Msgs.Count(m => !roomMods.Contains(m.UserID));
                double modsMsgCount = room.RoomGroup.Msgs.Count(m => roomMods.Contains(m.UserID));
                double str = usersMsgCount / Math.Max(modsMsgCount, 1);
                str = Math.Min(str, 3); //3 is max value

                if (publishGlobaly) context.Clients.Group(roomID).updateStr(roomID, str);    //publish globally
                else context.Clients.Client(Context.ConnectionId).updateStr(roomID, str);    //public locally         

            }
        }

        internal void UpdateRoomWordle(string roomID, bool publishGlobaly)
        {
            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(Convert.ToInt32(roomID));
                ICollection<VMsg> msgs = room.RoomGroup.Msgs;
                if (msgs.Count > 0)
                {
                    List<string> sentences = msgs.Where(m => m.UserID != "server").Select(m => m.Text).ToList();
                    string joined = String.Join(",", sentences);
                    string[] words = Regex.Split(joined, @"\W+");
                    Dictionary<string, int> dictionary = words.GroupBy(str => str)
                        .OrderByDescending(group => group.Count())
                        .ToDictionary(group => group.Key, group => group.Count());

                    if (publishGlobaly) context.Clients.Group(roomID).updateWordle(roomID, dictionary);    //publish globally
                    else context.Clients.Client(Context.ConnectionId).updateWordle(roomID, dictionary);     //public locally  
                }
            }
        }

        internal void UpdateNewCP(string roomID, CriticalMsgPoints cp)
        {
            CPData cpd = new CPData(cp.MsgID, cp.GroupID, cp.GroupID, cp.Type.ToString(), "msg", "chat-bubble-two", cp.Msg.TimeStamp, cp.Msg.UserID, cp.Msg.Text, cp.Type, cp.Priority);
            context.Clients.Group(roomID).updateNewCPGraph(roomID, cpd);
            context.Clients.Group(roomID + toolbarStr).updateNewCPToolBar(roomID, cpd);
        }

        private void UpdateNewCP(string roomID, CriticalActionPoints cp)
        {
            CPData cpd = new CPData(cp.ActionID, cp.TabID, cp.Action.Tab.GroupID, cp.Type.ToString(), "act", "flash", cp.Action.TimeStamp, cp.Action.UserID, cp.Action.ToStringWithoutUser(), cp.Type, cp.Priority);
            context.Clients.Group(roomID).updateNewCPGraph(roomID, cpd);
            context.Clients.Group(roomID + toolbarStr).updateNewCPToolBar(roomID, cpd);
        }

        internal void UpdateRemovedCP(string roomID, CriticalMsgPoints cp)
        {
            CPData cpd = new CPData(cp.MsgID, cp.GroupID, cp.GroupID, cp.Type.ToString(), "msg", "chat-bubble-two", new DateTime(), "", "", cp.Type, cp.Priority);
            context.Clients.Group(roomID).updateRemovedCPGraph(roomID, cpd);
            context.Clients.Group(roomID + toolbarStr).updateRemovedCPToolBar(roomID, cpd);
        }
        public void UpdateLike(int idOne, int idTwo, string type, CriticalPointTypes idLabel, string like)
        {
            int roomID = -1;
            using (SagletModel db = new SagletModel())
            {
                try
                {
                    switch (type)
                    {
                        case "msg":
                            {
                                roomID = idTwo;
                                CriticalMsgPoints cmp = db.CriticalMsgPoints.Find(idOne, idTwo, idLabel);
                                cmp.Like = (like == "like") ? true : false;
                                break;
                            }
                        case "act":
                            {
                                CriticalActionPoints cap = db.CriticalActionPoints.Find(idOne, idTwo, idLabel);
                                cap.Like = (like == "like") ? true : false;
                                roomID = cap.Action.Tab.GroupID;
                                break;
                            }
                    }
                    // save
                    db.SaveChanges();
                    // update clients
                    UpdateLike(roomID.ToString(), type, idOne, idTwo, idLabel.ToString(), like);
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        private void UpdateLike(string roomID, string type, int idOne, int idTwo, string idLabel, string likeStr)
        {
            context.Clients.Group(roomID).updateLike(roomID, type, idOne, idTwo, idLabel, likeStr);
            context.Clients.Group(roomID + toolbarStr).updateLike(roomID, type, idOne, idTwo, idLabel, likeStr);
        }

        internal void UpdateUsersGraphOnLoad(string roomID)
        {
            int i_roomID = Convert.ToInt32(roomID);
            List<UserData> usersData = ExtractUsersInRoom(i_roomID);
            context.Clients.Client(Context.ConnectionId).UpdateUsersGraphOnLoad(roomID, usersData);
        }

        private void UpdateUsersToolBarOnload(int subRoomID)
        {
            List<UserData> usersData = ExtractUsersInRoom(subRoomID);
            context.Clients.Client(Context.ConnectionId).UpdateUsersToolBarOnLoad(subRoomID, usersData);
        }

        //public void RequestUsersGraphToolBarUpdate(int roomID)
        //{
        //    List<UserData> usersData = ExtractUsersInRoom(roomID);
        //    context.Clients.Client(Context.ConnectionId).UpdateUsersGraphToolBarReq(roomID, usersData);
        //}

        internal void UpdateUserList(int roomID, object json)
        {
            // updates all data VMT page and Graph
            context.Clients.Group(roomID + toolbarStr).updateUserList(roomID, json);
        }

        private List<UserData> ExtractUsersInRoom(int roomID)
        {
            List<UserData> usersData = new List<UserData>();

            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(roomID);
                HashSet<string> usersIDs = new HashSet<string>(room.RoomGroup.GetUsersFromString(), StringComparer.OrdinalIgnoreCase);
                HashSet<string> usersOnline = new HashSet<string>(VmtDevAPI.GetUsersConnected(roomID), StringComparer.OrdinalIgnoreCase);

                foreach (string userID in usersIDs)
                {
                    bool isOnline = usersOnline.Contains(userID, StringComparer.OrdinalIgnoreCase);
                    UserData data = ExtractUserData(roomID, userID, isOnline);
                    usersData.Add(data);
                }
            }
            return usersData;
        }

        private UserData ExtractUserData(int roomID, string userID, bool isOnline)
        {
            UserData data;
            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(roomID);
                User user = db.Users.Find(userID);
                bool isMod = room.ModeratorsAllowed.Any(m => m.Username == userID);
                int msgs = 0, acts = 0, sentiment = 50;
                if (user != null)
                {
                    msgs = user.Msgs.Count(m => m.GroupID == roomID);
                    acts = user.Actions.Count(a => a.Tab.GroupID == roomID);
                    sentiment = 50;
                    if (msgs > 0) Convert.ToInt32(user.Msgs.Average(m => m.Sentiment));  // TODO fix here for user msgs in the room only
                }

                data = new UserData(userID, isMod, isOnline, msgs, acts, sentiment);
            }
            return data;
        }

        /* CP injections */

        public void LoadCpmModal(string roomID, string msgID)
        {
            int i_roomID = Convert.ToInt32(roomID);
            int i_msgID = Convert.ToInt32(msgID);
            VMsg msg = null;
            string[] enums = Enum.GetNames(new CriticalPointTypes().GetType());
            using (SagletModel db = new SagletModel())
            {
                msg = db.Msgs.Find(i_msgID, i_roomID);
                context.Clients.Client(Context.ConnectionId).updateCpmData(roomID, msg, msg.CriticalPoints, enums);
            }
        }

        public void InjectCPM(string action, string roomID, string msgID, CriticalPointTypes type, string priority)
        {
            int i_roomID = Convert.ToInt32(roomID);
            int i_msgID = Convert.ToInt32(msgID);

            using (SagletModel db = new SagletModel())
            {
                CriticalMsgPoints cpm = null;

                try
                {
                    switch (action)
                    {
                        case "add":
                            VMsg msg = db.Msgs.Find(i_msgID, i_roomID);
                            cpm = new CriticalMsgPoints();
                            cpm.Type = type;
                            cpm.Priority = priority;
                            msg.CriticalPoints.Add(cpm);
                            // save
                            db.SaveChanges();
                            // update clients
                            UpdateNewCP(roomID, cpm);
                            break;
                        case "remove":  // TODO - not supported yet -> need to inform modal and inform all clients on toolbar(remove from table and update numbers and colors)
                            cpm = db.CriticalMsgPoints.Find(i_msgID, i_roomID, type);
                            db.CriticalMsgPoints.Remove(cpm);
                            // save
                            db.SaveChanges();
                            // update clients
                            UpdateRemovedCP(roomID, cpm);
                            break;
                    }

                    UpdateCPModal(roomID, msgID, action, type, priority);
                    UpdateCPOutSiteModal(roomID, msgID);
                }
                catch (Exception e)
                {
                    throw e;
                }

            }
        }

        private void UpdateCPModal(string roomID, string msgID, string action, CriticalPointTypes type, string priority)
        {
            context.Clients.Client(Context.ConnectionId).updateCPModal(roomID, msgID, action, type.ToString(), priority);
        }

        private void UpdateCPOutSiteModal(string roomID, string msgID)
        {
            int i_roomID = Convert.ToInt32(roomID);
            int i_msgID = Convert.ToInt32(msgID);
            Dictionary<CriticalPointTypes, string> cpData = new Dictionary<CriticalPointTypes, string>();

            using (SagletModel db = new SagletModel())
            {
                VMsg msg = db.Msgs.Find(i_msgID, i_roomID);
                foreach (CriticalMsgPoints cpm in msg.CriticalPoints)
                {
                    cpData.Add(cpm.Type, cpm.Priority);
                }
                //msg = db.Msgs.Include("CriticalPoints")
                //    .Where(m => m.ID == i_msgID && m.GroupID == i_roomID)
                //    .FirstOrDefault();
                //msg = db.Msgs.Where(m => m.ID == i_msgID && m.GroupID == i_roomID).Include;
                //IQueryable<VMsg> query = db.Msgs.Include(msg.CriticalPoints)
            }
            context.Clients.Group(roomID).UpdateCPOutSiteModal(roomID, msgID, cpData);
        }

        class CPData
        {
            public int id { get; set; }
            public int roomID { get; set; }
            public int dup_roomID { get; set; }     // do not remove -> saved for action to have a roomID
            public string cpLabel { get; set; }
            public string trigger { get; set; }
            public string triggerIcon { get; set; }
            public string timestamp { get; set; }
            public string user { get; set; }
            public string text { get; set; }
            public string type { get; set; }
            public string priority { get; set; }

            public CPData(int id, int roomID, int dup_roomID, string cpLabel, string trigger, string triggerIcon, DateTime timestamp, string user, string text, CriticalPointTypes type, string priority)
            {
                this.id = id;
                this.roomID = roomID;
                this.dup_roomID = dup_roomID;
                this.cpLabel = cpLabel;
                this.trigger = trigger;
                this.triggerIcon = triggerIcon;
                this.timestamp = timestamp.ToShortTimeString();
                this.user = user;
                this.text = text;
                this.type = type.ToString();
                this.priority = priority;
            }
        }

        class ActionMsg
        {
            public string id { get; set; }
            public string user { get; set; }
            public string timestamp { get; set; }
            public string text { get; set; }
            public int sentiment { get; set; }
            public ActionMsg(string id, string user, string timestamp, string text, int sentiment)
            {
                this.id = id;
                this.user = user;
                this.timestamp = timestamp;
                this.text = text;
                this.sentiment = sentiment;
            }

            public ActionMsg(int id, string user, DateTime timestamp, string text, int sentiment)
            {
                this.id = id.ToString();
                this.user = user;
                this.timestamp = timestamp.ToShortDateString();
                this.text = text;
                this.sentiment = sentiment;
            }
        }

        public class UserData
        {
            public string user { get; set; }
            public bool isMod { get; set; }
            public bool isOnline { get; set; }
            public int msgs { get; set; }
            public int actions { get; set; }
            public int sentiment { get; set; }

            public UserData(string user, bool isMod, bool isOnline, int msgs, int actions, int sentiment)
            {
                this.user = user;
                this.isMod = isMod;
                this.isOnline = isOnline;
                this.msgs = msgs;
                this.actions = actions;
                this.sentiment = sentiment;
            }
        }

        public void UpdateIdleness(Dictionary<int,List<string>> idles)
        {
            //TODO
        }

    }
}