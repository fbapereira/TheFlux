using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("MovimentacaoInstitucional")]
    public class MovimentacaoInstitucionalController : ApiController
    {
        // Get
        public List<Movimentacao> Get(int id)
        {
            return new Movimentacao().GetByInstituition(id);
        }

    }
}