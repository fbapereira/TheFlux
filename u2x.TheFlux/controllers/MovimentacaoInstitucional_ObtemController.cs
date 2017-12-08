using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("MovimentacaoInstitucional_Obtem")]
    public class MovimentacaoInstitucional_ObtemController : ApiController
    {
        // Get
        public List<Movimentacao> Post([FromBody]Usuario value)
        {
            
            return new Movimentacao().GetByInstituition(value.id_instituicao);
        }

    }
}