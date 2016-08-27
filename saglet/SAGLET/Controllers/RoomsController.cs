using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SAGLET.Models;
using SAGLET.Hubs;
using SAGLET.Class;
using Hangfire;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Data.SqlClient;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Web.Script.Serialization;

namespace SAGLET.Controllers
{
    public class RoomsController : Controller
    {
        private SagletModel db = new SagletModel();
        private static RoomDetailsHub hubDetails = new RoomDetailsHub();
        private static RoomIndexHub hubIndex = new RoomIndexHub();

        //need to update teacher list
        private static IdlenessAnalyzer idle = new IdlenessAnalyzer(new List<string>());
        private readonly Object dbLock = new Object();
        private Dictionary<int, int> solutionIndex = new Dictionary<int, int>();
        private CpAlarm criticalPointAlert = new CpAlarm(10, 8, 6);

        public void ResetState()
        {
            lock (dbLock)
            {
                db = new SagletModel();
            }
            hubDetails = new RoomDetailsHub();
            hubIndex = new RoomIndexHub();
        }

        ////GET: USER LOGIN
        //public ActionResult userLoginStatus()
        //{
        //    string user = AppHelper.GetVmtUser();
        //    bool login = String.IsNullOrEmpty(user);
        //    //if ( user)
        //    //    ViewBag.Mod = true;
        //    //else
        //    //    ViewBag.Mod = false
        //    //        ;
        //    return View(login);
        //}


        // API CONTROLLER //

        // GET: Rooms
        public JsonResult GetRoomsList()
        {
            string user = AppHelper.GetVmtUser();
            ViewBag.Mod = user.ToLower();
            Moderator mod = db.Moderators.Find(user);
            if (mod != null)
                return Json(mod.RoomsAllowed, JsonRequestBehavior.AllowGet);

            //return empty room list          
            return Json(new List<Room>(), JsonRequestBehavior.AllowGet);
        }



        // GET: Rooms
        public ActionResult Index()
        {
            string user = AppHelper.GetVmtUser();
            ViewBag.Mod = user.ToLower();
            Moderator mod = db.Moderators.Find(user);
            if (mod != null) return View(mod.RoomsAllowed);
            //return empty room list
            return View(new List<Room>());
        }

        // GET: Rooms/SyncNewRooms
        public void SyncNewRooms()
        {


            //try
            //{
            string user = AppHelper.GetVmtUser();
            // make HTML request
            var client = new ExtendedWebClient();
            string roomsData = client.DownloadString("http://vmtdev.mathforum.org/rooms/");

            // sync rooms
            List<Room> newRooms = SyncUserRooms(user.ToLower(), roomsData);
            //newRooms = SyncUserRooms(user.ToLower(), roomsData);

            foreach (Room room in newRooms)
            {
                VmtDevAPI.RegisterLiveChat(room.ID);
                VmtDevAPI.RegisterLiveActions(room.ID);
            }

            //}
            // catch (Exception e)
            //{
            // throw e;
            //}
            //return newRooms.ToString();
            //return Json(newRooms, JsonRequestBehavior.AllowGet);
            // return View("Index");
        }

        private List<Room> SyncUserRooms(string user, string roomsData)
        {
            List<Room> newRooms = new List<Room>();
            try
            {
                var results = JsonConvert.DeserializeObject<dynamic>(roomsData);
                Moderator moderator = db.Moderators.Find(user);
                if (moderator == null) moderator = new Moderator(user, AppHelper.GetAspUserID());

                foreach (var item in results.rooms)
                {
                    string currUser = Convert.ToString(item.creator).ToLower();
                    if (user != currUser) continue;
                    int currRoomId = Convert.ToInt32(item.id);
                    if (db.Rooms.Find(currRoomId) != null) continue;

                    Room room = new Room();
                    room.ID = item.id;
                    room.RoomGroup = new Group(room.ID);
                    foreach (var itemTab in item.tabs) { room.RoomGroup.Tabs.Add(new Tab(Convert.ToInt32(itemTab.Value))); }


                    room.LastUpdate = Convert.ToDateTime("1/1/1970");
                    room.Moderator = moderator;
                    room.ModeratorsAllowed.Add(moderator);
                    room.Sync = true;
                    newRooms.Add(room);
                    db.Rooms.Add(room);
                }
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
            return newRooms;
        }

        // GET: Rooms/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Room room = db.Rooms.Find(id);
            if (room == null)
            {
                return HttpNotFound();
            }

            // get critical points
            List<int> rooms = db.Moderators.Find(AppHelper.GetVmtUser()).RoomsAllowed.Select(u => u.ID).ToList();
            Dictionary<int, List<CriticalMsgPoints>> cpm = new Dictionary<int, List<CriticalMsgPoints>>();
            Dictionary<int, List<CriticalActionPoints>> cpa = new Dictionary<int, List<CriticalActionPoints>>();

            foreach (int item in rooms)
            {
                cpm[item] = db.CriticalMsgPoints.Where(c => c.GroupID == item)
                                                .OrderByDescending(c => c.Msg.TimeStamp)
                                                .ToList();
                cpa[item] = db.CriticalActionPoints.Where(c => c.Action.Tab.GroupID == item)
                                                .OrderByDescending(c => c.Action.TimeStamp)
                                                .ToList();
            }

            ViewBag.cpm = cpm;
            ViewBag.cpa = cpa;

            return View(room);
        }

        public ActionResult Demo()
        {
            // get critical points
            return View();
        }

        // GET: Rooms/Create
        public ActionResult Create()
        {
            ViewBag.ID = new SelectList(db.Groups, "RoomID", "RoomID");
            return View();
        }

        // TODO disable??
        // POST: Rooms/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,Sync,LastUpdate")] Room room, string tabs)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    room.RoomGroup = new Group(room.ID);
                    room.LastUpdate = Convert.ToDateTime("1/1/1970");
                    db.Rooms.Add(room);     //important -> don't move down in code
                    db.SaveChanges();
                    //BackgroundJob.Enqueue(() => UpdateRoom(room.ID));                                        
                    //RecurringJob.AddOrUpdate("UpdateRoom(" + room.ID + ")",() => UpdateRoom(room.ID), "*/" + room.SyncInterval + " * * * *");  temp disabled
                }
                catch (Exception e)
                {
                    throw e;
                }
                return RedirectToAction("Index");
            }

            return View(room);
        }

        [AutomaticRetry(Attempts = 1)]
        public void UpdateRoomHistory(int roomid)
        {
            List<VMsg> msgs = null;
            List<VAction> actions = new List<VAction>();
            using (var dbContextTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    Room room = db.Rooms.Find(roomid);
                    // handle chat
                    msgs = GetChatHistory(roomid, 0);

                    // handle tabs actions
                    foreach (Tab tab in room.RoomGroup.Tabs)
                    {
                        List<VAction> tabActions = GetActionHistory(tab.ID, 0);
                        actions.AddRange(tabActions);
                    }

                    SaveChatMsgToDB(roomid, msgs);
                    SaveActionToDB(roomid, actions);
                    dbContextTransaction.Commit();
                }
                catch (Exception e)
                {
                    // TODO do something with the error instead just prinitng to debug?
                    Debug.WriteLine(String.Format("UpdateRoomHistory({0}) failed -> rolling back update and might retry accordning to try index on hangfire", roomid));
                    dbContextTransaction.Rollback();
                    throw e;
                }
            }
        }

        private List<VMsg> GetChatHistory(int roomID, int startIndex)
        {
            List<VMsg> msgs = new List<VMsg>();
            string json = VmtDevAPI.GetChatHistory(roomID, startIndex);

            if (json == null) throw new TimeoutException(String.Format("roomID: {0} | TimeOut Exception | waiting time for messeges from client API acceeded the timeout!", roomID));

            var results = JsonConvert.DeserializeObject<dynamic>(json);
            foreach (var item in results.chats)
            {
                VMsg msg = VMsg.ConvertHistoryMessageJson(roomID, item);
                if (msg != null) msgs.Add(msg);
            }
            return msgs;
        }

        private List<VAction> GetActionHistory(int tabID, int startIndex)
        {
            List<VAction> actions = new List<VAction>();
            string json = VmtDevAPI.GetActionHistory(tabID, startIndex);

            if (json == null) throw new TimeoutException(String.Format("TabID: {0} | TimeOut Exception | waiting time for actions from client API acceeded the timeout!", tabID));

            var results = JsonConvert.DeserializeObject<dynamic>(json);
            foreach (var item in results)
            {
                VAction action = VAction.ConvertHistoryActionJson(tabID, item);
                if (action != null) actions.Add(action);
            }
            return actions;
        }

        private void SaveActionToDB(int roomid, List<VAction> actions)
        {
            HashSet<string> existsUsers = new HashSet<string>(db.Users.Select(x => x.Username).ToList(), StringComparer.OrdinalIgnoreCase);
            List<User> newUsers = actions.Select(a => a.UserID).Distinct().Where(u => !existsUsers.Contains(u)).Select(u => new User(u)).ToList();

            Room room = db.Rooms.Find(roomid);
            room.RoomGroup.AddToUsersString(actions.Select(a => a.UserID).Distinct());
            db.Actions.AddRange(actions);
            db.Users.AddRange(newUsers);
            room.LastUpdate = DateTime.Now;
            db.SaveChanges();
        }

        private void SaveChatMsgToDB(int roomid, List<VMsg> msgs)
        {
            lock (dbLock)
            {
                HashSet<string> existsUsers = new HashSet<string>(db.Users.Select(x => x.Username.ToLower()).ToList(), StringComparer.OrdinalIgnoreCase);
                List<User> newUsers = msgs.Select(m => m.UserID).Distinct().Where(u => !existsUsers.Contains(u.ToLower())).Select(u => new User(u)).ToList();
                try
                {
                    Room room = db.Rooms.Find(roomid);
                    room.RoomGroup.AddToUsersString(GetUsersFromServerMessages(msgs));      //add according to 'server' msgs
                    room.RoomGroup.AddToUsersString(msgs.Select(m => m.UserID).Distinct()); //add according to user msgs
                    db.Msgs.AddRange(msgs);
                    db.Users.AddRange(newUsers);
                    room.LastUpdate = DateTime.Now;
                    db.SaveChanges();
                }
                catch (DbUpdateException ex)
                {
                    bool shouldThrow = true;
                    SqlException inner = ex.InnerException as SqlException;
                    if (inner != null)
                    {
                        SqlException doubleInner = inner.InnerException as SqlException;
                        if (doubleInner != null && (doubleInner.Number == 2601 || doubleInner.Number == 2627))
                        {
                            Debug.WriteLine(String.Format("SaveChatMsgToDB failed -> {0}", doubleInner.Message));
                            shouldThrow = false;
                        }
                    }
                    if (shouldThrow) throw ex;
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        private IEnumerable<string> GetUsersFromServerMessages(IEnumerable<VMsg> msgs)
        {
            List<VMsg> serverMsgs = msgs.Where(m => m.UserID == "server").ToList();
            HashSet<string> users = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (VMsg msg in serverMsgs)
            {
                KeyValuePair<string, bool> user = GetUserNameFromConnectDisconnectMsg(msg.Text);
                if (user.Key != null) users.Add(user.Key);
            }
            return users;
        }

        private KeyValuePair<string, bool> GetUserNameFromConnectDisconnectMsg(string msg)
        {
            int index = msg.IndexOf("joined the session");
            if (index != -1)
            {
                string user = msg.Substring(0, index).Trim();
                return new KeyValuePair<string, bool>(user, true);
            }
            index = msg.IndexOf("left the session");
            if (index != -1)
            {
                string user = msg.Substring(0, index).Trim();
                return new KeyValuePair<string, bool>(user, false);
            }
            return new KeyValuePair<string, bool>(null, false); ;
        }

        private void SaveChatMsgToDB(int roomID, VMsg msg)
        {
            SaveChatMsgToDB(roomID, new List<VMsg>() { msg });
        }

        private void SaveActionToDB(int roomID, VAction act)
        {
            SaveActionToDB(roomID, new List<VAction>() { act });
        }

        // GET: Rooms/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Room room = db.Rooms.Find(id);
            if (room == null)
            {
                return HttpNotFound();
            }
            String user = AppHelper.GetVmtUser();
            if (user == room.Moderator.Username.ToLower())
            {
                List<string> allowedMods = room.ModeratorsAllowed.Select(m => m.Username).ToList();
                List<string> allMods = db.Moderators.Select(m => m.Username).ToList();
                allMods.Remove(user);
                ViewBag.mods = new MultiSelectList(allMods, allowedMods);
            }
            // TODO redirect to Index with error -> user not allowed
            return View(room);
        }

        // POST: Rooms/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,Sync,LastUpdate")] Room room, string[] ModsAllowedID)
        {
            if (ModelState.IsValid)
            {
                Room roomBefore = db.Rooms.Find(room.ID);
                // handle mods
                roomBefore.ModeratorsAllowed.Clear();
                if (ModsAllowedID == null) ModsAllowedID = new string[0];
                List<Moderator> newModeratorsAllowed = db.Moderators.Where(m => ModsAllowedID.Contains(m.Username)).ToList();
                roomBefore.ModeratorsAllowed.Add(roomBefore.Moderator);
                foreach (Moderator m in newModeratorsAllowed) roomBefore.ModeratorsAllowed.Add(m);
                // handle sync
                if (room.Sync && !roomBefore.Sync)
                {
                    VmtDevAPI.RegisterLiveChat(room.ID);
                    VmtDevAPI.RegisterLiveActions(room.ID);
                }
                if (!room.Sync && roomBefore.Sync) VmtDevAPI.CloseSocket(room.ID);
                roomBefore.Sync = room.Sync;
                db.Entry(roomBefore).State = EntityState.Modified;    // TODO check disable?
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ID = new SelectList(db.Groups, "RoomID", "UsernamesAsString", room.ID);
            return View(room);
        }

        // GET: Rooms/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Room room = db.Rooms.Find(id);
            if (room == null)
            {
                return HttpNotFound();
            }
            return View(room);
        }

        // POST: Rooms/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Room room = db.Rooms.Find(id);
            db.Rooms.Remove(room);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }


        //Assaf
        /* Sockets msgs */
        public void HandleLiveMessage(int roomID, string json)
        {
            var results = JsonConvert.DeserializeObject<dynamic>(json);
            VMsg msg = VMsg.ConvertLiveMessageJson(roomID, results);
            if (msg != null)
            {
                string solution = GetSolution(msg.Text, roomID);
                HandleIdleMessage(msg);
                msg.CriticalPoints = CriticalPointAnalyzer.Analyze(msg,solution);
                msg.CriticalPoints.Add(criticalPointAlert.NewCp((List<CriticalMsgPoints>)msg.CriticalPoints));
                SaveChatMsgToDB(roomID, msg);

                if (msg.UserID != "server")
                    hubDetails.UpdateRoomMsgLiveControl(roomID.ToString(), msg);

            }
        }

        public void HandleLiveAction(string actID, string xmlstr, string log, string eventName)
        {
            // TODO handle log and eventName
            var url = JsonConvert.DeserializeObject<dynamic>(xmlstr);
            if (url.xml == null) return;
            var logRes = JsonConvert.DeserializeObject<dynamic>(log);

            VAction action = VAction.ConvertLiveActionJson(actID, url.xml.ToString(), logRes, eventName);
            if (action != null)
            {
                action.CriticalPoints = CriticalPointAnalyzer.Analyze(action);
                int roomID = db.Tabs.Find(action.TabID).GroupID;
                HandleIdleAction(roomID, action.UserID);
                SaveActionToDB(roomID, action);
                hubDetails.UpdateRoomActionLiveControl(roomID.ToString(), action);
                //hubIndex.UpdateRoomIndex(roomID.ToString());
            }
        }

        public void RestartSolutionIndex(List<int> roomIDs)
        {
            this.solutionIndex.Clear();
            foreach (int roomID in roomIDs)
                this.solutionIndex.Add(roomID, 0);
        }

        private string GetSolution(string msg,int roomID)
        {
            if (this.solutionIndex.ContainsKey(roomID))
            {
                string nq = "next";
                if (LevenshteinDistance.Compute(nq,msg) <= nq.Length / 2.0)
                    this.solutionIndex[roomID]++;

                List<string> solList = VmtDevAPI.getSolutions(roomID);
                if (this.solutionIndex[roomID] < solList.Count() - 1)
                    return VmtDevAPI.getSolutions(roomID)[this.solutionIndex[roomID]];
                else
                    return VmtDevAPI.getSolutions(roomID)[solList.Count() - 1];
            }
            else
                return "";

        }

        public void IdlenessOpenRoom(int idleWindow, List<int> roomIDs)
        {
            foreach (int roomID in roomIDs)
            {
                idle.openRoom(idleWindow, roomID);
                List<string> users = VmtDevAPI.GetUsersConnected(roomID);
                foreach (string userID in users)
                {
                    idle.user_joined(roomID, userID);
                }
            }
        }

        public void getRoomIdles(List<int> roomIDs)
        {
            foreach (int roomID in roomIDs)
            {
                Dictionary<int, List<String>> idles = new Dictionary<int, List<string>>();
                List<String> idleUsers = idle.whoIsIdle(roomID);
   
                idles.Add(roomID, idleUsers);

                string json2 = JsonConvert.SerializeObject(idles);
                hubDetails.UpdateIdleness(roomID.ToString(), json2);    
            }   
        }

        private void HandleIdleMessage(VMsg msg)
        {
            int roomID = msg.GroupID;
            string message = msg.Text;
            string userID = msg.UserID;
            if (message.Contains("joined"))
            {
                string user = message.Split(' ')[0];
                idle.user_joined(roomID, user);
            }
            else if (message.Contains("left"))
            {
                string user = message.Split(' ')[0];
                idle.user_left(roomID, user);
            }
            else
            {
                idle.user_activity(roomID, userID);
            }
        }

        private void HandleIdleAction(int roomID, string userID)
        {
            idle.user_activity(roomID, userID);
        }

    }
}
