using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class PagSeguro_CheckoutSuccessController : ApiController
    {
        [HttpPost]
        public Boolean Post([FromBody]PagSeguroPagamento code)
        {
            try
            {
                return new PagSeguro().CheckoutSuccess(code.code, code.codeResponse);
            }
            catch (Exception e)
            {
                ErroHandler.Log("PagSeguro_CheckoutSuccessController", e, "POST", "");
                throw e;
            }
        }

    }
}
