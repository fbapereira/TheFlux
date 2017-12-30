using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("TipoPagamento_Alterar")]
    public class TipoPagamento_AlterarController : ApiController
    {
        // POST api/<controller>
        [HttpPost]
        public bool Post([FromBody]TipoPagamento value)
        {
            try
            {
                return new TipoPagamento().Alterar(value);
            }
            catch (Exception e)
            {
                ErroHandler.Log("TipoPagamento_Alterar", e, "POST", "");
                throw e;
            }
        }
    }
}