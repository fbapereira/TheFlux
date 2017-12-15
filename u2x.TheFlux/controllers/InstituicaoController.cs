using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{

    [RoutePrefix("Instituicao")]
    public class InstituicaoController : ApiController
    {

        // GET api/<controller>/5
        public Instituicao Get(int id)
        {
            return new Instituicao().GetByUser(id);
        }

        // POST api/<controller>
        //public void Post([FromBody]Instituicao value)
        //{
        //    new Instituicao().Add(value.nome);
        //}

    }
}