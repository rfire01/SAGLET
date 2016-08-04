using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SAGLET.Areas.Demo.Class
{
    public class Command
    {
        public int roomID;
        public int time;
        public string classType;       

        public Command(int roomID, int time, string classType)
        {
            this.time = time;
            this.classType = classType;
            this.roomID = roomID;
        }

        public static Command ParseCommand(string line)
        {
            Command cmd = null;
            string[] data = line.Split(',');
            switch (data[0])
            {
                case "C":
                    {
                        cmd = new CPCommand(data);
                        break;
                    }
                case "U":
                    {
                        List<KeyValuePair<string, int>> msgCount = new List<KeyValuePair<string, int>>();
                        string[] lineData = line.Split(new string[] {","}, StringSplitOptions.RemoveEmptyEntries);
                        for (int i = 3; i < lineData.Length; i++)
                        {
                            string keyvalStr = lineData[i];
                            int start = keyvalStr.IndexOf('<') + 1;
                            int middle = keyvalStr.IndexOf('|');
                            int end = keyvalStr.IndexOf('>');
                            string userID = keyvalStr.Substring(start, middle - start);
                            string count = keyvalStr.Substring(middle + 1, end - (middle + 1));
                            
                            KeyValuePair<string, int> pair = new KeyValuePair<string, int>(userID, Convert.ToInt32(count));
                            msgCount.Add(pair);
                        }
                        cmd = new UsersUpdateCommand(lineData[1], lineData[2], msgCount);
                        break;
                    }
            }

            return cmd;
        }
    }

    public class CPCommand : Command
    {
        public string userID;
        public string type;
        public int priority;
        public string text;

        public CPCommand(int roomID, int time, string userID, string type, int priority, string text) : base(roomID, time, "CP")
        {
            this.userID = userID;
            this.type = type;
            this.priority = priority;
            this.text = text;
        }

        public CPCommand(string roomID, string time, string userID, string type, string priority, string text) 
            : this(Convert.ToInt32(roomID), Convert.ToInt32(time), userID, type, Convert.ToInt32(priority), text){}

        public CPCommand(string[] data) : this(data[1], data[2], data[3], data[4], data[5], data[6]) {}
    }

    public class UsersUpdateCommand : Command
    {
        public List<KeyValuePair<string, int>> msgCount;

        public UsersUpdateCommand(int roomID, int time, List<KeyValuePair<string, int>> msgCount)
            : base(roomID, time, "UsersUpdate")
        {
            this.msgCount = msgCount;
        }

        public UsersUpdateCommand(int roomID, string time, List<KeyValuePair<string, int>> msgCount) 
            : this(roomID, Convert.ToInt32(time), msgCount) {}

        public UsersUpdateCommand(string roomID, string time, List<KeyValuePair<string, int>> msgCount)
            : this(Convert.ToInt32(roomID), Convert.ToInt32(time), msgCount) { }

    }
}