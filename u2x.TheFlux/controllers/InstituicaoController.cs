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
            try
            {
                Instituicao _Instituicao = new Instituicao().GetByUser(id);
                return _Instituicao;
            }
            catch (Exception e)
            {
                ErroHandler.Log("InstituicaoController", e, "GET", "");
                throw e;
            }
        }
    }
}