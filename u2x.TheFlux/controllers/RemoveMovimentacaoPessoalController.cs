using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("RemoveMovimentacaoPessoal")]
    public class RemoveMovimentacaoPessoalController : ApiController
    {
        // Get
        public void Get(int id)
        {
            new Movimentacao().Delete(id);
        }
    }
}