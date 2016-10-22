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
using SAGLET.Controllers;

namespace SAGLET.Hubs
{
    [Authorize]
    public class RoomIndexHub : Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<RoomIndexHub>();
        public void GetUserName()
        {
            String user = AppHelper.GetVmtUser();
            VmtDevAPI.setCurrentVmtUser(user);

            context.Clients.Client(Context.ConnectionId).GetUserName(user);
        }

        //get rooms details for the home room index
        public void GetRooms()
        {
            //UpdateRooms();

            using (SagletModel db = new SagletModel())
            {

                String user = AppHelper.GetVmtUser();

                List<Room> roomsList = new List<Room>();

                List<int> roomsIds = db.Moderators.Find(user).RoomsAllowed.Select(r => r.ID).ToList();
                foreach (int roomId in roomsIds)
                {
                    Room room = db.Rooms.Find(Convert.ToInt32(roomId));
                    Room thisRoom = new Room
                    {
                        LastUpdate = room.LastUpdate,
                        ID = room.ID,
                        Name = room.Name,
                        Sync = room.Sync
                    };
                    roomsList.Add(thisRoom);
                }
                context.Clients.Client(Context.ConnectionId).getRooms(roomsList);
            }
        }

        public void UpdateRooms()
        {
            RoomsController ctrl = new RoomsController();
            ctrl.SyncNewRooms();

            GetRooms();
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

    }

}