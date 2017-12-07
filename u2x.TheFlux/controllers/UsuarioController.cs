using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("Usuario")]
    public class UsuarioController : ApiController
    {
        // POST api/<controller>
        public bool Post([FromBody]Usuario value)
        {
            new Usuario().Add(value.login, value.senha, value.isAdmin, value.id_instituicao);
            return true;
        }

        // POST api/<controller>
        public List<Usuario> Get(int id)
        {
            return new Usuario().GetAll(id);
        }
    }
}