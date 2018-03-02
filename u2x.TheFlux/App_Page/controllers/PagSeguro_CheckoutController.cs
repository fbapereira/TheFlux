using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.App_Page.controllers
{
    public class PagSeguro_CheckoutController : ApiController
    {

        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            try
            {
                new PagSeguro().Checkout();
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("PagSeguro_CheckoutController", e, "POST", "");
                throw e;
            }
        }
    }
}
