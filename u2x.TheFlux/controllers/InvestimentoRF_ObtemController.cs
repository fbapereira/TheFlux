using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class InvestimentoRF_ObtemController : ApiController
    {
        [HttpPost]
        public List<tf_investimento_RF> Post([FromBody]tf_investimento_RF value)
        {
            try
            {
                return new RendaFixa().Obtem(value.id_instituicao);

            }
            catch (Exception e)
            {
                ErroHandler.Log("InvestimentoRF_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
