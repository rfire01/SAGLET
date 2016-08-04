namespace SAGLET.Areas.Migrations.SagletDemo
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialDatabaseCreation : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FeedBacks",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        timeStamp = c.DateTime(nullable: false),
                        username = c.String(),
                        cpText = c.String(),
                        stars = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FeedBacks");
        }
    }
}
