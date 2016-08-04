namespace SAGLET.Areas.Migrations.SagletDemo
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialDatabaseCreation2 : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.FeedBacks");
            AlterColumn("dbo.FeedBacks", "username", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("dbo.FeedBacks", "cpText", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("dbo.FeedBacks", new[] { "username", "cpText" });
            DropColumn("dbo.FeedBacks", "ID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FeedBacks", "ID", c => c.Int(nullable: false, identity: true));
            DropPrimaryKey("dbo.FeedBacks");
            AlterColumn("dbo.FeedBacks", "cpText", c => c.String());
            AlterColumn("dbo.FeedBacks", "username", c => c.String());
            AddPrimaryKey("dbo.FeedBacks", "ID");
        }
    }
}
