using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("TipoPagamento_Obtem")]
    public class TipoPagamento_ObtemController : ApiController
    {
        // POST api/<controller>
        [HttpPost]
        public List<TipoPagamento> Post([FromBody]TipoPagamento value)
        {
            try
            {
                return new TipoPagamento().Get((int)value.id_instituicao);
            }
            catch (Exception e)
            {
                ErroHandler.Log("TipoPagamento_Obtem", e, "POST", "");
                throw e;
            }
        }
    }
}