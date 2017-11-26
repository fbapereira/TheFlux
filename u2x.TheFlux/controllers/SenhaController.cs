﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("Senha")]
    public class SenhaController : ApiController
    {
        // POST api/<controller>
        public void Post([FromBody]Usuario value)
        {
            new Usuario().Update(value.id, value.senha, value.isAdmin, value.id_instituicao);
        }
    }
}