using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ContaFutura_CriarController : ApiController
    {
        [HttpPost]
        public Int32 Post([FromBody]dynamic value)
        {
            try
            {
                return new ContasFuturas().Criar(value.nome.ToString(),
                    Convert.ToInt32(value.id_tipo_movimentacao),
                    Convert.ToInt32(value.id_tipo_pagamento),
                    Convert.ToDecimal(value.valor_base),
                    Convert.ToInt32(value.id_usuario),
                    Convert.ToBoolean(value.is_entrada.ToString() == "1"));

            }
            catch (Exception e)
            {
                ErroHandler.Log("ContaFutura_CriarController", e, "POST", "");
                throw e;
            }
        }
    }
}
