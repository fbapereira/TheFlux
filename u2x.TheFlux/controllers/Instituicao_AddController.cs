using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Instituicao_AddController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {


            tf_instituicao inst = new Instituicao().Add(value.nome.ToString(), value.documento.ToString(), value.telefone.ToString(), value.email.ToString());

            new Usuario().Add(value.login.ToString(), value.senha.ToString(), true, inst.id);

            return true;
        }
    }
}
