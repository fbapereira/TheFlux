using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Obtem_EstrelaController : ApiController
    {
        [HttpPost]
        public Int32 Post([FromBody]dynamic value)
        {
            return new Estrela().Contar(Convert.ToInt32(value.id));

        }
    }
}
