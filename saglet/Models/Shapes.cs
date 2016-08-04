using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SAGLET.Models
{
    public abstract class Shape
    {
        [Key, Column(Order = 1)]
        public string Lbl { get; set; }
        [Key, Column(Order = 0)]
        public int TabID { get; set; }
        [ForeignKey("TabID")]
        public virtual Tab Tab { get; set; }
        [DefaultValue(false)]
        public bool wasRemoved { get; set; }
        public virtual ICollection<VAction> Actions { get; set; }
        public Shape() { }
        public Shape(string Lbl)
        {
            this.Lbl = Lbl;
        }
        public override string ToString()
        {
            return Lbl;
        }
    }

    [Table("Points")]
    public class Point : Shape
    {
        public double X { get; set; }
        public double Y { get; set; }

        public Point() : base() { }
        public Point(string Lbl, double X, double Y)
            : base(Lbl)
        {
            this.X = X;
            this.Y = Y;
        }
        public override string ToString()
        {
            return String.Format("Point {0} [{1},{2}]", base.ToString(), X, Y);
        }
    }

    [Table("Lines")]
    public abstract class Line : Shape
    {
        public virtual Point p1 { get; set; }
        public Line(){}
        public Line(String lbl, Point p)
            : base(lbl)
        {
            p1 = p;
        }
        public override string ToString()
        {
            return base.ToString();
        }
    }

    [Table("LinesUnbouded")]
    public class LineUnbouded : Line
    {
        public virtual Point p2 { get; set; }

        public LineUnbouded() { }
        public LineUnbouded(String lbl, Point p1, Point p2)
            : base(lbl, p1)
        {
            p1 = 
            this.p2 = p2;
        }
        public override string ToString()
        {
            return String.Format("Unbounded Line {0} [{1},{2}]", base.ToString(), this.p1.ToString(), this.p2.ToString());
        }
    }

    //public class Segment : Line
    //{
    //    Point p2;
    //    public Segment(Point p1, Point p2)
    //        : base(p1)
    //    {
    //        this.p2 = p2;
    //    }
    //}

    //public class Ray : Line
    //{
    //    Point p2;
    //    public Ray(Point p1, Point p2)
    //        : base(p1)
    //    {
    //        this.p2 = p2;
    //    }
    //}

    //public class ParllelLine : Line
    //{
    //    Line line;

    //    public ParllelLine(Point p1, Line line)
    //        : base(p1)
    //    {
    //        this.line = line;
    //    }
    //}

    //public class PerpendicularLine : Line
    //{
    //    Line line;

    //    public PerpendicularLine(Point p1, Line line)
    //        : base(p1)
    //    {
    //        this.line = line;
    //    }
    //}
}