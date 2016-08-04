using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;


namespace SAGLET.Areas.Demo.Models
{
    public class DemoModal : DbContext
    {
        public DemoModal() 
            : base("name=ServerSagletDemo"){ }
        public DbSet<FeedBack> FeedBacks { get; set; }
    }
}

