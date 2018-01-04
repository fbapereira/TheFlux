using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Variacao_ObtemController : ApiController
    {
        [HttpPost]
        public List<tf_investimento_RF_variacao> Post([FromBody]tf_investimento_RF_variacao value)
        {
            try
            {
                return new RendaFixa().ObtemRegistro((int)value.id);

            }
            catch (Exception e)
            {
                ErroHandler.Log("Variacao_ObtemController", e, "POST", "");
                throw e;
            }
        }
    }
}
