using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Aporte_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_investimento_RF_aporte value)
        {
            try
            {
                new RendaFixa().Aporta(value);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Aporte_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
