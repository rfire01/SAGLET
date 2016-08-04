using Newtonsoft.Json;
using SAGLET.Class;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public class VMsg
    {
        /* Members */

        [Key, Column(Order = 0)]
        public int ID { get; set; }
        [Key, Column(Order = 1), ForeignKey("Group"), JsonIgnore]
        public int GroupID { get; set; }
        [ForeignKey("User")]
        public string UserID { get; set; }
        [DisplayName("VMT TimeStamp")]
        public DateTime TimeStamp { get; set; }
        public int Sentiment { get; set; }
        public string Text { get; set; }
        [ForeignKey("ID, GroupID"), JsonIgnore]
        public virtual ICollection<CriticalMsgPoints> CriticalPoints { get; set; }

        [JsonIgnore]
        public virtual Group Group { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }

        /* Methods */
        public VMsg() { }
        public VMsg(int roomID, string msgID, string msg, string timeStamp, string username)
        {
            this.GroupID = roomID;
            this.ID = Convert.ToInt32(msgID);
            this.Text = msg;
            //this.Sentiment = SentimentAnalyzer.GetSentiment(msg);            
            this.TimeStamp = Convert.ToDateTime(timeStamp);
            this.UserID = username;
        }

        public static VMsg ConvertHistoryMessageJson(int roomID, dynamic item)
        {
            if (item.eventData != null
               && item.eventName != null
               && item.eventData.id != null
               && item.eventData.msg != null
               && item.eventData.uname != null
               && item.eventData.timeStamp != null
               && !String.IsNullOrEmpty(item.eventData.msg.Value.ToString().Trim()))
            {
                string msgID = item.eventData.id.ToString().Trim();
                string msg = item.eventData.msg.Value.ToString().Trim();
                string timeStamp = item.eventData.timeStamp.Value.ToString().Trim();
                string username = item.eventData.uname.Value.ToString().Trim();
                
                return new VMsg(roomID, msgID, msg, timeStamp, username); 
            }
            return null;
        }

        public static VMsg ConvertLiveMessageJson(int roomID, dynamic item)
        {
            if (item.id != null
               && item.msg != null
               && item.timeStamp != null
               && item.uname != null
               && !String.IsNullOrEmpty(item.msg.Value.ToString().Trim()))
            {
                string msgID = item.id.ToString().Trim();
                string msg = item.msg.Value.ToString().Trim();
                string timeStamp = item.timeStamp.Value.ToString().Trim();
                string username = item.uname.Value.ToString().Trim();

                return new VMsg(roomID, msgID, msg, timeStamp, username);
            }
            return null;
        }

    }
}