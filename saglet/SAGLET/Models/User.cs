using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class User
    {
        public User()
        {
            this.Msgs = new HashSet<VMsg>();
            this.Actions = new HashSet<VAction>();
        }

        public User(string username)
            : this()
        {
            this.Username = username;
        }

        [Key]
        public string Username { get; set; }
        public virtual ICollection<VMsg> Msgs { get; set; }
        public virtual ICollection<VAction> Actions { get; set; }
    }
}