using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using u2x.TheFlux.dao;

namespace u2x.TheFlux
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

            new HttpConfiguration().MapHttpAttributeRoutes();
            RouteTable.Routes.MapHttpRoute(
           name: "DefaultApi",
           routeTemplate: "api/{controller}/{id}/{arg1}/{arg2}/{arg3}",
           defaults: new
           {
               id = System.Web.Http.RouteParameter.Optional,
               arg1 = System.Web.Http.RouteParameter.Optional,
               arg2 = System.Web.Http.RouteParameter.Optional,
               arg3 = System.Web.Http.RouteParameter.Optional,


           });

            RouteTable.Routes.MapHttpRoute(name: "ControllersApi", routeTemplate: "{controller}");

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}