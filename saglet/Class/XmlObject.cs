using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using SAGLET.Models;
using Newtonsoft.Json;

namespace SAGLET.Class
{
    public class XmlObject
    {
        private List<string> supportedShapes = new List<string> (){ "Point", "Line" };
        XmlDocument xml;
        private SagletModel db = new SagletModel();
        private static Dictionary<int, Dictionary<string, Shape>> dict_tabShapes = new Dictionary<int, Dictionary<string, Shape>>();
        private string toolName;
        public int tabID;

        public XmlObject(string url, dynamic log)
        {
            string decodedUrl = "<root>" + Uri.UnescapeDataString(url) + "</root>";

            xml = new XmlDocument();
            xml.LoadXml(decodedUrl);           

            toolName = log.toolName.ToString().Trim();
            tabID = Convert.ToInt32(log.tab.ToString().Trim());
        }

        internal bool isValid()
        {
            bool hasChildes = xml.HasChildNodes;
            bool isSupported = supportedShapes.Contains(this.toolName);
            return hasChildes && isSupported;
        }

        internal Shape GetShape(string eventName)
        {
            Shape shape = null;
            XmlNode commandNode = null;
            XmlNode elementNode = xml.DocumentElement.GetElementsByTagName("element")[0];
            XmlNodeList nodeList = xml.DocumentElement.GetElementsByTagName("command");

            if (nodeList.Count > 0) commandNode = nodeList[0];

            string type = elementNode.Attributes["type"].Value;
            string lbl = elementNode.Attributes["label"].Value;

            switch (type)
            {
                case "point":
                    XmlElement coordsNode = elementNode["coords"];
                    double x = Convert.ToDouble(coordsNode.Attributes["x"].Value);
                    double y = Convert.ToDouble(coordsNode.Attributes["y"].Value);
                    shape = new Point(lbl, x, y);
                    break;
                case "line":
                    XmlElement inputNode = commandNode["input"];
                    string lbl_p1 = inputNode.Attributes["a0"].Value;
                    string lbl_p2 = inputNode.Attributes["a1"].Value;
                  
                    Point p1 = (Point)GetShape(tabID, lbl_p1);
                    Point p2 = (Point)GetShape(tabID, lbl_p2);
                    shape = new LineUnbouded(lbl, p1, p2);
                    break;
            }

            if (shape != null)  shape.TabID = tabID;

            return shape;
        }

        public void SaveShapesLocally(int tabID, Shape shape)
        {
            if (!dict_tabShapes.ContainsKey(tabID)) dict_tabShapes.Add(tabID, new Dictionary<string, Shape>());
            dict_tabShapes[tabID][shape.Lbl] = shape;
        }

        public Shape GetShape(int tabID, string lbl)
        {
            if (dict_tabShapes.ContainsKey(tabID))
            {
                if (dict_tabShapes[tabID].ContainsKey(lbl)) return dict_tabShapes[tabID][lbl];
            }

            return db.Shapes.Find(tabID, lbl);
        }
    }
}