using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Variacao_RemoveController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_investimento_RF_variacao value)
        {
            try
            {
                new RendaFixa().RemoveRegistro(value.id);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Variacao_RemoveController", e, "POST", "");
                throw e;
            }
        }
    }
}
