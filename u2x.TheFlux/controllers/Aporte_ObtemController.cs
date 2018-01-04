using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Aporte_ObtemController : ApiController
    {
        [HttpPost]
        public List<tf_investimento_RF_aporte> Post([FromBody]tf_investimento_RF value)
        {
            try
            {
                return new RendaFixa().ObtemAporte((int)value.id);

            }
            catch (Exception e)
            {
                ErroHandler.Log("Aporte_ObtemController", e, "POST", "");
                throw e;
            }
        }
    }
}
