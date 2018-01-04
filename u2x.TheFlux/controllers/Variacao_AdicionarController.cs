using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Variacao_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_investimento_RF_variacao value)
        {
            try
            {
                new RendaFixa().Registra(value);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Variacao_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
