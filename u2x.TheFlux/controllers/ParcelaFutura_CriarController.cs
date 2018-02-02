using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ParcelaFutura_CriarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_parcela_futura value)
        {
            try
            {
                new ContasFuturas().CriarParcela(Convert.ToDateTime(value.dt_include),
                    value.email,
                    Convert.ToInt32(value.id_movimentacao_futura),
                    Convert.ToDecimal(value.valor_real));
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("ParcelaFutura_CriarController", e, "POST", "");
                throw e;
            }
        }
    }
}
