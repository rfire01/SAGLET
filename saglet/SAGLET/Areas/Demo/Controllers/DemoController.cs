using SAGLET.Areas.Demo.Class;
using SAGLET.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SAGLET.Areas.Demo.Controllers
{
    public class DemoController : Controller
    {
        // GET: Demo/Demo
        public ActionResult Index()
        {
            Dictionary<int, string> videos = null;
            ViewBag.Commands = LoadScript("script.csv", out videos);
            ViewBag.Vidoes = videos;
            return View();
        }

        private List<Command> LoadScript(string scriptName, out Dictionary<int, string> videos)
        {
            var client = new ExtendedWebClient();
            string scriptStr = client.DownloadString("https://dl.dropboxusercontent.com/u/71589444/SAGLET/" + scriptName);
            //string path = Server.MapPath("~/Areas/Demo/Videos/Scripts/" + scriptName);
            List<Command> commands = new List<Command>();
            //string[] commandsStr = System.IO.File.ReadAllLines(path);
            string[] commandsStr = scriptStr.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);
            for (int i = 1; i < commandsStr.Length; i++)
            {
                if (String.IsNullOrWhiteSpace(commandsStr[i])) continue;
                Command cmd = Command.ParseCommand(commandsStr[i]);
                commands.Add(cmd);
            }

            videos = ExtractVideoNamesFromScript(commandsStr[0]);

            return commands;
        }

        private Dictionary<int, string> ExtractVideoNamesFromScript(string line)
        {
            Dictionary<int, string> vidoes = new Dictionary<int, string>();
            string[] lineData = line.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < lineData.Length; i++)
            {
                string keyvalStr = lineData[i];
                int start = keyvalStr.IndexOf('<') + 1;
                int middle = keyvalStr.IndexOf('|');
                int end = keyvalStr.IndexOf('>');
                string videoID = keyvalStr.Substring(start, middle - start);
                string filename = keyvalStr.Substring(middle + 1, end - (middle + 1));

                vidoes.Add(Convert.ToInt32(videoID), filename);
            }

            return vidoes;
        }
    }
}