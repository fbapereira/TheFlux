using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class InvestimentoRF_DeletaController : ApiController
    {
        [HttpPost]
        public void Post([FromBody]tf_investimento_RF value)
        {
            try
            {
                new RendaFixa().Exclui(value.id);

            }
            catch (Exception e)
            {
                ErroHandler.Log("InvestimentoRF_DeletaController", e, "POST", "");
                throw e;
            }
        }
    }
}
