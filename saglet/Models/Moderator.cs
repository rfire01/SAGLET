using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class Moderator
    {
        [Key]
        public string Username { get; set; }
        public string AspUserID { get; set; }
        
        //settings
        public bool demo { get; set; }
        public bool sentiment { get; set; }
        public bool cpa { get; set; }
        public bool saveCpFeedbackTo { get; set; }
        public bool reviewed { get; set; }
        public bool listRoomID { get; set; }
        public bool listTrigger { get; set; }
        public bool listTime { get; set; }
        public bool displayActionGraph { get; set; }
        public int usersPerLine { get; set; }


        public virtual ICollection<Room> RoomsAllowed { get; set; }
        public Moderator()
        {
            this.RoomsAllowed = new HashSet<Room>();
        }
        public Moderator(string username, string apsUserID)
            : this()
        {
            Username = username;
            AspUserID = apsUserID;
        }
    }
}