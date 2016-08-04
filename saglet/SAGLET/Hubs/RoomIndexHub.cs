using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.Ajax.Utilities;
using SAGLET.Models;
using SAGLET.Class;

namespace SAGLET.Hubs
{
    [Authorize]
    public class RoomIndexHub : Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<RoomIndexHub>();
        public void GetUserName()
        {
            String user = AppHelper.GetVmtUser();

            context.Clients.Client(Context.ConnectionId).GetUserName(user);
        }

        public void GetRooms()
        {
            using (SagletModel db = new SagletModel())
            {

                //List<Room> syncedRoomList = new List<Room>();
                //List<Room> nonSycedRoomList = new List<Room>();

                String user = AppHelper.GetVmtUser();
                //context.Clients.Client(Context.ConnectionId).GetUserName(user);

                List<Room> roomsList = new List<Room>();
                
                List<int> roomsIds = db.Moderators.Find(user).RoomsAllowed.Select(r => r.ID).ToList();
                foreach (int roomId in roomsIds) {
                    Room room = db.Rooms.Find(Convert.ToInt32(roomId));
                    Room thisRoom = new Room {
                        LastUpdate = room.LastUpdate,
                        ID = room.ID,
                        Sync = room.Sync
                    };
                    roomsList.Add(thisRoom);



                    //if (thisRoom.Sync)
                    //    syncedRoomList.Add(thisRoom);
                    //else
                    //    nonSycedRoomList.Add(thisRoom);


                }

                

                context.Clients.Client(Context.ConnectionId).getRooms(roomsList);
            }
        }
  

        public void UpdateRoomsWatchStatus(string rooms)
        {
            using (SagletModel db = new SagletModel())
            {
                foreach (int room in rooms) {

                }
            

            }
        }

        public void JoinGroup(string roomsFromClient)
        {
            using (SagletModel db = new SagletModel())
            {
                //List<int> rooms = db.Moderators.Find(AppHelper.GetVmtUser()).RoomsAllowed.Where(r => r.Sync).Select(r => r.ID).ToList();
                List<int> rooms = roomsFromClient.Split(',').Select(int.Parse).ToList();
                foreach (int roomID in rooms)
                {
                    Groups.Add(Context.ConnectionId, roomID.ToString());
                }
                context.Clients.Client(Context.ConnectionId).registeredComplete("Registered succesfully to rooms: " + String.Join(",", rooms));
            }
        }

        public void UpdateRoomIndex(string roomID)
        {
            using (SagletModel db = new SagletModel())
            {
                Room room = db.Rooms.Find(Convert.ToInt32(roomID));
                string date = room.LastUpdate.ToString();
                int mods = room.ModeratorsAllowed.Count;
                int msgs = room.RoomGroup.Msgs.Count(m => m.UserID != "server");
                int actions = room.RoomGroup.Tabs.Sum(x => x.Actions.Count);
                int users = room.RoomGroup.GetUsersFromString().Count;

                context.Clients.Group(roomID).updateRoomIndex(room);
            }
        }

        //public void RoomSyncStatus(string roomID, bool isSynced)
        //{
        //    string status = isSynced ? "Successfully Synced!" : "FAILED TO SYNC!";
        //    context.Clients.Client(Context.ConnectionId).roomSyncStatus(String.Format("RoomSyncStatus(roomID) - {0}", status));
        //}
    }
    //struct roomObj
    //{
    //    List<String>
    //}
}