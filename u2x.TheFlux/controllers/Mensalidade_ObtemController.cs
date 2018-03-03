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
        public List<MensalidadeStatus> Post([FromBody]tf_aluno value)
        {
            try
            {
                List<MensalidadeStatus> lstCov = new List<MensalidadeStatus>();
                List<vw_mensalidade_pagamento> lst = new MensalidadeStatus().Obtem((int)value.id);
                lst.ForEach((x) =>
                {
                    lstCov.Add(new MensalidadeStatus().ToMensalidade(x));
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
