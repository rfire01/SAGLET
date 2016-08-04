namespace SAGLET.Areas.Demo.Migrations.DemoModal
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
                        username = c.String(nullable: false, maxLength: 128),
                        cpText = c.String(nullable: false, maxLength: 128),
                        roomID = c.Int(nullable: false),
                        timeStamp = c.DateTime(nullable: false),
                        stars = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.username, t.cpText, t.roomID });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FeedBacks");
        }
    }
}
