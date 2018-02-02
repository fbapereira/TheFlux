using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ParcelaFutura_PagarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_parcela_futura value)
        {
            try
            {
                new ContasFuturas().MudaStatus(value.id, true);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("ParcelaFutura_CriarController", e, "POST", "");
                throw e;
            }
        }
    }
}
