namespace SAGLET.Models
{
    using Newtonsoft.Json;
    using SAGLET.Class;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;
    using System.Linq;

    public class SagletModel : DbContext
    {
        // Your context has been configured to use a 'SagletModel' connection string from your application's 
        // configuration file (App.config or Web.config). By default, this connection string targets the 
        // 'Saglet.Models.SagletModel' database on your LocalDb instance. 
        // 
        // If you wish to target a different database and/or database provider, modify the 'SagletModel' 
        // connection string in the application configuration file.
        public SagletModel()
            : base("name=ServerSagletModel")
        {
        }

        // Add a DbSet for each entity type that you want to include in your model. For more information 
        // on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.

        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Tab> Tabs { get; set; }
        public DbSet<CriticalActionPoints> CriticalActionPoints { get; set; }
        public DbSet<CriticalMsgPoints> CriticalMsgPoints { get; set; }
        public DbSet<VAction> Actions { get; set; }
        public DbSet<VMsg> Msgs { get; set; }
        public DbSet<Moderator> Moderators { get; set; }
        public DbSet<Shape> Shapes { get; set; }
    }
}