using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ParcelaFutura_ObtemController : ApiController
    {
        [HttpPost]
        public List<tf_parcela_futura> Post([FromBody]dynamic value)
        {
            try
            {
                List<tf_parcela_futura> a = new ContasFuturas().ObtemParcela(Convert.ToInt32(value.id_conta));
                List<tf_parcela_futura> converted = new List<tf_parcela_futura>();
                a.ForEach((x) =>
                {
                    converted.Add(new ContasFuturas().ToParcelas(x));
                });
                return converted;
            }
            catch (Exception e)
            {
                ErroHandler.Log("ParcelaFutura_ObtemController", e, "POST", "");
                throw e;
            }
        }
    }
}
