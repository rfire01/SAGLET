using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SAGLET.Areas.Demo.Models;
using SAGLET.Class;
using System.Text;
using System.IO;

namespace SAGLET.Areas.Demo.Controllers
{
    public class FeedBacksController : Controller
    {
        private DemoModal db = new DemoModal();

        // GET: Demo/FeedBacks
        public ActionResult Index()
        {
            return View(db.FeedBacks.ToList());
        }

        // GET: Demo/FeedBacks/5
        public ActionResult Delete(int? roomID, string username, string cpText)
        {
            if (username == null  || cpText == null || roomID == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            FeedBack feedBack = db.FeedBacks.Find(username, cpText, roomID);
            if (feedBack == null)
            {
                return HttpNotFound();
            }
            return View(feedBack);
        }

        // POST: Demo/FeedBacks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int roomID, string username, string cpText)
        {
            FeedBack feedBack = db.FeedBacks.Find(username, cpText, roomID);
            db.FeedBacks.Remove(feedBack);
            db.SaveChanges();
            return RedirectToAction("Index");
        }


        // GET: Demo/FeedBacks/DownloadCsv
        public FileStreamResult DownloadCsv()
        {
            List<FeedBack> feedBacks = db.FeedBacks.ToList();
            string str = AppHelper.GetFeedbackCsvString(feedBacks);

            var byteArray = Encoding.UTF8.GetBytes(str);
            MemoryStream stream = new MemoryStream(byteArray);

            return File(stream, "text/plain", "feedbacks.csv");
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
