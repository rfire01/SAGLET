using Hangfire;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using SAGLET.Class;

[assembly: OwinStartupAttribute(typeof(SAGLET.Startup))]
namespace SAGLET
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            // hangfire setup
            GlobalConfiguration.Configuration.UseSqlServerStorage("ServerHangFire");

            app.UseHangfireDashboard("/Jobs", new DashboardOptions
            {
                Authorization = new[] { new MyRestrictiveAuthorizationFilter() }
            });

            app.UseHangfireServer(new BackgroundJobServerOptions
            {
                WorkerCount = 1,
            });

            // SignalR setup
            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            app.MapSignalR(hubConfiguration);
            GlobalHost.HubPipeline.RequireAuthentication();
        }
    }
}
