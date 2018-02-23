using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Mensalidade_ObtemController : ApiController
    {
        public List<Mensalidade> Post([FromBody]tf_aluno value)
        {
            try
            {
                List<Mensalidade> lstCov = new List<Mensalidade>();
                List<tf_mensalidade> lst = new Mensalidade().Obtem((int)value.id);
                lst.ForEach((x) =>
                {
                    lstCov.Add(new Mensalidade().ToMensalidade(x));
                });
                return lstCov;
            }

            catch (Exception e)
            {
                ErroHandler.Log("Mensalidade_ObtemController", e, "POST", "");
                throw e;
            }
        }
    }
}
