using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class Tab
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID { get; set; }
        [ForeignKey("Group")]
        public int GroupID { get; set; }
        public virtual Group Group { get; set; }
        public virtual ICollection<VAction> Actions { get; set; }
        public virtual ICollection<Shape> Shapes { get; set; }

        public Tab()
        {
            this.Actions = new HashSet<VAction>();
            this.Shapes = new HashSet<Shape>();
        }
        public Tab(int id)
            : this()
        {
            ID = id;
        }
    }
}