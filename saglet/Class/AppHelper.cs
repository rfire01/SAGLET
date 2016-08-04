using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SAGLET.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using SAGLET.Areas.Demo.Models;
using System.Text;

namespace SAGLET.Class
{
    public class AppHelper
    {
        public static string GetVmtUser()
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated) return null;

            string aspUserID = GetAspUserID();
            string userName = null;

            using (SagletModel db = new SagletModel()){
                userName = db.Moderators.Where(m => m.AspUserID.Equals(aspUserID)).Select(x => x.Username).FirstOrDefault();
            }

            return userName;
        }

        public static string GetAspUserID()
        {
            return HttpContext.Current.User.Identity.GetUserId();
        }


        internal static string GetFeedbackCsvString(List<FeedBack> feedbacks)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("sep=;");
            sb.AppendLine("Username;Room ID;Critical Point Text;TimeStamp;Stars");
            foreach (FeedBack fb in feedbacks)
            {
                string line = fb.username + ";" + fb.roomID + ";" + fb.cpText + ";" + fb.timeStamp + ";" + fb.stars;
                sb.AppendLine(line);
            }
            return sb.ToString();
        }
    }
}