using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("TipoMovimentacao")]
    public class TipoMovimentacaoController : ApiController
    {
        [HttpPost]
        public Boolean post([FromBody]TipoMovimentacao value)
        {
            try
            {
                new TipoMovimentacao().Add(value.descricao, value.id_instituicao);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("RemoveMovimentacaoPessoal", e, "POST", "");
                throw e;
            }
        }

        [HttpGet]
        public List<TipoMovimentacao> get(Int32 id)
        {
            try
            {
                return new TipoMovimentacao().Get(id);
            }
            catch (Exception e)
            {
                ErroHandler.Log("RemoveMovimentacaoPessoal", e, "get", "");
                throw e;
            }
        }

        [HttpGet]
        [Route("AlteraStatus/{arg1}/{arg2}")]
        public Boolean Get(Int32 arg1, Int32 arg2)
        {
            try
            {
                Int32 idTipo = arg1;
                Int32 isActive = arg2;
                if (isActive == 1)
                    new TipoMovimentacao().Active(idTipo);
                else
                    new TipoMovimentacao().Deactive(idTipo);

                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("RemoveMovimentacaoPessoal", e, "AlteraStatus", "");
                throw e;
            }
        }
    }
}