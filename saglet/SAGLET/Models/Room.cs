using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class Room
    {
        [DisplayName("VMT Room ID"), DatabaseGenerated(DatabaseGeneratedOption.None), Required]
        public int ID { get; set; }
        public bool Sync { get; set; }
        [DisplayName("Last Update")]
        public DateTime LastUpdate { get; set; }
        [DisplayName("VMT Room Name")]
        public string Name { get; set; }
        public virtual Group RoomGroup { get; set; }
        public virtual Moderator Moderator { get; set; }
        [InverseProperty("RoomsAllowed")]
        public virtual ICollection<Moderator> ModeratorsAllowed { get; set; }
        public Room()
        {
            this.ModeratorsAllowed = new HashSet<Moderator>();
        }
    }
}