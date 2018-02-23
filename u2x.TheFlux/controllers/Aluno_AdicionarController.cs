using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Aluno_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]tf_aluno value)
        {
            try
            {
                new Aluno().Criar(value.nome, value.cpf, value.email, Convert.ToInt32(value.id_instituicao));
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Aluno_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
