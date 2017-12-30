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
            try
            {
                new Usuario().Add(value.login, value.senha, value.isAdmin, value.id_instituicao);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Usuario", e, "POST", "");
                throw e;
            }
        }

        // POST api/<controller>
        public List<Usuario> Get(int id)
        {
            try
            {
                return new Usuario().GetAll(id);
            }
            catch (Exception e)
            {
                ErroHandler.Log("Usuario", e, "Get", "");
                throw e;
            }
        }
    }
}