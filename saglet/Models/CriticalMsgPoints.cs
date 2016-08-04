using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class CriticalMsgPoints
    {
        [Key, Column(Order = 0), ForeignKey("Msg")]
        public int MsgID { get; set; }
        [Key, Column(Order = 1), ForeignKey("Msg")]
        public int GroupID { get; set; }
        [Key, Column(Order = 2)]
        public CriticalPointTypes Type { get; set; }
        public string Priority { get; set; }
        public bool? Like { get; set; }
        public bool? Status { get; set; }   //null = unseen | false = seen | true = marked
        public virtual VMsg Msg { get; set; }
    }
}