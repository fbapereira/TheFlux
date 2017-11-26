using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("MovimentacaoPessoal")]
    public class MovimentacaoPessoalController : ApiController
    {


        // Get
        public List<Movimentacao> Get(int id)
        {
            return new Movimentacao().GetByUser(id);
        }

        // Post
        public void Post([FromBody]Movimentacao value)
        {
            new Movimentacao().Add(value.id_tipo_movimentacao, value.idUsuario, value.isEntrada, value.descricao, value.valor);
        }

    }
}