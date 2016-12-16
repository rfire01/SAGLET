using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SAGLET.Models;
using SAGLET.Class;

namespace SAGLET.Controllers
{
    public class ModeratorsController : Controller
    {
        private SagletModel db = new SagletModel();

        public ActionResult RegisterMod(string username)
        {
            db.Moderators.Add(new Moderator(username, AppHelper.GetAspUserID()));
            if (db.Users.Find(username) == null)
                db.Users.Add(new User(username));
            db.SaveChanges();

            return RedirectToAction("app", "Home");
        }

        // GET: Moderators
        public ActionResult Index()
        {
            return View(db.Moderators.ToList());
        }

        // GET: Moderators/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Moderator moderator = db.Moderators.Find(id);
            if (moderator == null)
            {
                return HttpNotFound();
            }
            return View(moderator);
        }

        // GET: Moderators/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Moderators/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Username")] Moderator moderator)
        {
            if (ModelState.IsValid)
            {
                db.Moderators.Add(moderator);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(moderator);
        }

        // GET: Moderators/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Moderator moderator = db.Moderators.Find(id);
            if (moderator == null)
            {
                return HttpNotFound();
            }
            return View(moderator);
        }

        // POST: Moderators/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Username")] Moderator moderator)
        {
            if (ModelState.IsValid)
            {
                db.Entry(moderator).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(moderator);
        }

        // GET: Moderators/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Moderator moderator = db.Moderators.Find(id);
            if (moderator == null)
            {
                return HttpNotFound();
            }
            return View(moderator);
        }

        // POST: Moderators/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Moderator moderator = db.Moderators.Find(id);
            db.Moderators.Remove(moderator);
            db.SaveChanges();
            return RedirectToAction("Index");
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
