using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Aluno_ObtemPorUsuarioController : ApiController
    {
        [HttpPost]
        public List<Aluno> Post([FromBody]tf_usuario value)
        {
            try
            {
                List<Aluno> covert = new List<Aluno>();
                List<tf_aluno> uncovert = new Aluno().Obtem(Convert.ToInt32(value.id));

                uncovert.ForEach((x) =>
                {
                    covert.Add(new Aluno().ToAluno(x));
                });

                return covert;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Aluno_ObtemPorUsuarioController", e, "POST", "");
                throw e;
            }
        }
    }
}
