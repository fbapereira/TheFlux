using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Aluno_EditarController : ApiController
    {
        [HttpPost]
        public Aluno Post([FromBody]tf_aluno value)
        {
            try
            {
                Aluno oAluno = new Aluno();
                return oAluno.ToAluno(oAluno.Editar(value));
            }
            catch (Exception e)
            {
                ErroHandler.Log("Aluno_EditarController", e, "POST", "");
                throw e;
            }
        }
    }
}
