using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;
namespace u2x.TheFlux.controllers
{
    [RoutePrefix("Movimentacao_Deletar")]
    public class Movimentacao_DeletarController : ApiController
    {
        public Boolean Post([FromBody]Usuario value)
        {
            return new Movimentacao().Delete(value.id);
        }
    }
}