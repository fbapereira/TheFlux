using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Mensalidade_AdicionarController : ApiController
    {

        [HttpPost]
        public bool Post([FromBody]tf_mensalidade value)
        {
            try
            {
                new Mensalidade().Criar((int)value.id_aluno, (int)value.ano, (int)value.mes, (decimal)value.valor);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mensalidade_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
