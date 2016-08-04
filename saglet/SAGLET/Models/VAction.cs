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
    public class VAction
    {
        /* Members */

        [Key, Column(Order = 0)]
        public int ID { get; set; }

        [Key, Column(Order = 1)]
        public int TabID { get; set; }

        [DisplayName("VMT TimeStamp")]
        public DateTime TimeStamp { get; set; }

        public string Type { get; set; }    //add, update, delete, etc.. 

        public string UserID { get; set; }

        public string ShapeLbl { get; set; }
        [ForeignKey("ID, TabID"), JsonIgnore]
        public virtual ICollection<CriticalActionPoints> CriticalPoints { get; set; }

        [ForeignKey("TabID"), JsonIgnore]
        public virtual Tab Tab { get; set; }

        [ForeignKey("UserID"), JsonIgnore]
        public virtual User User { get; set; }

        [ForeignKey("TabID, ShapeLbl")]
        [InverseProperty("Actions"), JsonIgnore]
        public virtual Shape Shape { get; set; }


        /* Methods */

        public VAction() { }

        public VAction(int tabID, string actID, Shape shape, string timeStamp, string username, string eventName)
        {
            this.TabID = tabID;
            this.ID = Convert.ToInt32(actID);
            this.Shape = shape;
            this.TimeStamp = Convert.ToDateTime(timeStamp);
            this.UserID = username;
            this.Type = eventName;
        }

        public string ToStringWithoutUser()
        {
            return string.Format("{0} {1}", Type, this.Shape.ToString());
        }
        public override string ToString()
        {
            return string.Format("{0} {1} {2}", UserID, Type, this.Shape.ToString());
        }

        public static VAction ConvertHistoryActionJson(int tabID, dynamic item)
        {
            if (item.eventData != null
                && item.eventName != null
                && item.userName != null
                && item.timeStamp != null
                && item.id != null
                && item.eventData.xml != null
                && item.eventLog != null
                && item.eventLog.toolName != null)
            {
                string url = item.eventData.xml;

                XmlObject xml = new XmlObject(url, item.eventLog);


                string eventName = item.eventName.Value.ToString().Trim();

                if (xml.isValid() && eventName == "elmadd")
                {
                    string actID = item.id.ToString().Trim();
                    string timeStamp = item.timeStamp.Value.ToString().Trim();
                    string username = item.userName.Value.ToString().Trim();
                    
                    
                    // TODO add log info (log.toolName and one more)

                    Shape shape = xml.GetShape(eventName);
                    if (shape != null)
                    {
                        xml.SaveShapesLocally(tabID, shape);
                        return new VAction(tabID, actID, shape, timeStamp, username, eventName);
                    }
                    return null;
                }
                return null;
            }
            return null;
        }

        public static VAction ConvertLiveActionJson(string actID, string url, dynamic log, string eventName)
        {
            if (!String.IsNullOrEmpty(actID)
                    && !String.IsNullOrEmpty(url)
                    && !String.IsNullOrEmpty(eventName)
                    && log != null
                    && log.timeStamp != null
                    && log.tab != null
                    && log.userName != null
                    && log.logMsg != null) 
            {
                XmlObject xml = new XmlObject(url, log);
                
                if (xml.isValid()){
                    string timeStamp = log.timeStamp.Value.ToString().Trim();
                    string username = log.userName.Value.ToString().Trim();
                    eventName = eventName.Trim();
                    int tabID = Convert.ToInt32(log.tab);

                    Shape shape = xml.GetShape(eventName);
                    if (shape != null)
                    {
                        xml.SaveShapesLocally(tabID, shape);
                        return new VAction(tabID, actID, shape, timeStamp, username, eventName);
                    }
                    return null;
                }
                return null;
            }
            return null;
        }


    }
}