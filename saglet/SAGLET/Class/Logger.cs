using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace SAGLET.Class
{
    public static class Logger
    {
        private static readonly object _lock = new object();
        private static readonly string path = @"C:\Data\log.txt";

        public static void Log(string timestamp, string user, string message, string tag, string alert)
        {
            string log = string.Format("{0} | Tag: {3}, Alert: {4} | {1}: {2}.{5}", timestamp, user, message, tag, alert, Environment.NewLine);
            lock (_lock)
            {
                File.AppendAllText(path, log);
            }
        }
    }
}