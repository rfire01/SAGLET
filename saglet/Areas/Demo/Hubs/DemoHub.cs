using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SAGLET.Areas.Demo.Models;
using SAGLET.Areas.Demo.Class;
using System.Web.Mvc;

namespace SAGLET.Areas.Demo.Hubs
{
    [AllowAnonymous]
    public class DemoHub : Hub
    {
        public void SaveFeedBack(string username, int roomID, string cpText, int stars)
        {
            FeedBack fb = null;
            using (DemoModal db = new DemoModal())
            {
                fb = db.FeedBacks.Find(username, cpText, roomID);
                if (fb == null)
                {
                    fb = new FeedBack();
                    fb.username = username;
                    fb.roomID = roomID;
                    fb.cpText = cpText;
                    db.FeedBacks.Add(fb);  
                                       
                }
                fb.timeStamp = DateTime.Now;
                fb.stars = stars;
                db.SaveChanges();
            }
            Clients.Caller.feedBackSaved(fb);
        }
    }
}