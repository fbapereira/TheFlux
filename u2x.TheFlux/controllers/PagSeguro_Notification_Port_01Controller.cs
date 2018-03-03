using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class PagSeguro_Notification_Port_01Controller : ApiController
    {
        [HttpPost]
        public Boolean Post([FromUri]object instituicao)
        {
            try
            {
                var code = HttpContext.Current.Request.Params["notificationCode"];
                var type = HttpContext.Current.Request.Params["notificationType"];

                if (String.Equals("transaction", type))
                {
                    new PagSeguroNotification().Criar(code, "PORT_1");
                    new PagSeguro().ProcessNotification(code, "PORT_1");
                    new PagSeguroNotification().Finalizar(code);

                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                ErroHandler.Log("PagSeguro_Notification_Port_01Controller", e, "POST", "");
                throw e;
            }
        }
    }
}
