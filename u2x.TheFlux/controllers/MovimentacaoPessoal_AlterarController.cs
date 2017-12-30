using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class MovimentacaoPessoal_AlterarController : ApiController
    {

        public bool Post([FromBody]Movimentacao value)
        {
            try
            {
                if (value.descricao == null) { value.descricao = ""; }

                new Movimentacao().Alterar(value.id, value.idTipoMovimentacao, value.idTipoPagamento, value.idUsuario, value.isEntrada, value.descricao, value.valor, value.data);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("MovimentacaoPessoal_Adicionar", e, "POST", "");
                throw e;
            }
        }
    }
}
