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
        [Key, Column(Order = 1)]
        public string cpText { get; set; }
        public DateTime timeStamp { get; set; }
        public int stars { get; set; }
    }
}