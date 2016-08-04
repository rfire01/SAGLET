using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using SAGLET.Class;

namespace SAGLET.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult app()
        {
            string user = AppHelper.GetVmtUser();
            bool login = String.IsNullOrEmpty(user);

            if(!login)
            return View();

            return View("Index");
        }




        //API CONTROLLER:

        //GET: USER LOGIN
        public ActionResult UserLoginStatus()
        {
            string user = AppHelper.GetVmtUser();
            bool login = String.IsNullOrEmpty(user);

            return Json(!login, JsonRequestBehavior.AllowGet);
        }
    }
}