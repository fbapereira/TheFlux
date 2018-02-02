using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class ParcelaFutura_ComprovanteController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            try
            {
                new Mailer().Comprovante(value.email.ToString(), value.nome.ToString(), "R" + Convert.ToDecimal(value.valor_real).ToString("C"), value.dt.ToString());
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
