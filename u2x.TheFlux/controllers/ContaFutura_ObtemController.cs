using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ContaFutura_ObtemController : ApiController
    {
        [HttpPost]
        public List<tf_movimentacao_futura> Post([FromBody]dynamic value)
        {
            try
            {
                List<tf_movimentacao_futura> a = new ContasFuturas().Obtem(Convert.ToInt32(value.id_usuario));
                List<tf_movimentacao_futura> converted = new List<tf_movimentacao_futura>();
                a.ForEach((x) =>
                {
                    converted.Add(new ContasFuturas().ToContas(x));
                });
                return converted;
            }
            catch (Exception e)
            {
                ErroHandler.Log("ContaFutura_CriarController", e, "POST", "");
                throw e;
            }
        }
    }
}
