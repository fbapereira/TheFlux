using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("Login")]
    public class LoginController : ApiController
    {
        [HttpPost]
        public Usuario Login([FromBody]Usuario value)
        {
            Usuario oUsuario = new Usuario();
            return oUsuario.Get(value.login, value.senha);
        }

    }
}