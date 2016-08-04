using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Areas.Demo.Models
{
    public class FeedBack
    {
        [Key, Column(Order = 0)]
        public string username { get; set; }
        [Key, Column(Order = 1), Display(Name="Critical Point Text")]
        public string cpText { get; set; }
        [Key, Column(Order = 2), Display(Name = "Room ID")]
        public int roomID { get; set; }
        [Display(Name = "TimeStamp")]
        public DateTime timeStamp { get; set; }
        public int stars { get; set; }
    }
}