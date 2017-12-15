using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Adicionar_EstrelaController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            new Estrela().Add(Convert.ToInt32(value.id_usuario.ToString()), value.telefone.ToString(), value.email.ToString());
            return true;
        }
    }
}
