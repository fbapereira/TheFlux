using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Mensalidade_PagarController : ApiController
    {
        public List<Mensalidade> Post([FromBody]tf_mensalidade value)
        {
            try
            {
                List<Mensalidade> lstCov = new List<Mensalidade>();
                tf_mensalidade oMensalidade = new Mensalidade().Pagar((int)value.id);
                String conta = "Mensalidade de " + oMensalidade.mes + "/" + oMensalidade.ano;

                tf_aluno oAluno = new Aluno().ObtemUnico((int)oMensalidade.id_aluno);
                new Mailer().Comprovante(oAluno.email, conta, "R" + Convert.ToDecimal(oMensalidade.valor).ToString("C"), DateTime.Now.ToString("dd/MM/yyyy"));

                return lstCov;
            }

            catch (Exception e)
            {
                ErroHandler.Log("Mensalidade_PagarController", e, "POST", "");
                throw e;
            }
        }
    }
}
