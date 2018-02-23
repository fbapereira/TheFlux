using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Mensalidade_RemoveController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_mensalidade value)
        {
            try
            {
                new Mensalidade().Remove((int)value.id);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mensalidade_RemoveController", e, "POST", "");
                throw e;
            }
        }
    }
}
