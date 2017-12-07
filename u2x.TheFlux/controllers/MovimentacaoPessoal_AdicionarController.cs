using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("MovimentacaoPessoal_Adicionar")]
    public class MovimentacaoPessoal_AdicionarController : ApiController
    {
        // Post
        public bool Post([FromBody]Movimentacao value)
        {
            if (value.descricao == null) { value.descricao = ""; }
            new Movimentacao().Add(value.idTipoMovimentacao, value.idTipoPagamento, value.idUsuario, value.isEntrada, value.descricao, value.valor, value.data);
            return true;
        }

    }
}