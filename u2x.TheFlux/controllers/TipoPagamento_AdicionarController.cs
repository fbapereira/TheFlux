using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("TipoPagamento_Adicionar")]
    public class TipoPagamento_AdicionarController : ApiController
    {
        public bool Post([FromBody]TipoPagamento value)
        {
            new TipoPagamento().Add(value);
            return true;
        }
    }
}