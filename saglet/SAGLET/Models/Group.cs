using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class Group
    {
        // TODO check remove id and on constructor RoomID = id
        private int id;

        //Members
        [Key, ForeignKey("GroupRoom")]
        public int RoomID { get; set; }
        public string UsernamesAsString { get; set; }
        public virtual ICollection<VMsg> Msgs { get; set; }
        public virtual ICollection<Tab> Tabs { get; set; }
        [JsonIgnore]
        public virtual Room GroupRoom { get; set; }
        
        public void AddToUsersString(IEnumerable<string> col)
        {
            HashSet<string> users = new HashSet<string>(GetUsersFromString(), StringComparer.OrdinalIgnoreCase);
            users.UnionWith(col);
            users.Remove("server");
            this.UsernamesAsString = String.Join(",", users);
        }

        public ICollection<string> GetUsersFromString()
        {
            return UsernamesAsString.Split(new char[] {','}, StringSplitOptions.RemoveEmptyEntries );
        }

        //Constructors
        public Group()
        {
            UsernamesAsString = "";
            this.Msgs = new HashSet<VMsg>();
            this.Tabs = new HashSet<Tab>();
        }

        public Group(int id)
            : this()
        {
            this.id = id;
        }

    }
}