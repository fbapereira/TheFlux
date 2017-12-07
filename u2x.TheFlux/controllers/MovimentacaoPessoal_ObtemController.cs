using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;
namespace u2x.TheFlux.controllers
{
    [RoutePrefix("MovimentacaoPessoal_Obtem")]
    public class MovimentacaoPessoal_ObtemController : ApiController
    {
        public List<Movimentacao> Post([FromBody]Usuario value)
        {
            return new Movimentacao().GetByUser(value.id);
        }
    }
}