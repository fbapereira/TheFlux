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
    public class PagSeguro_CheckoutController : ApiController
    {

        [HttpPost]
        public string Post([FromBody]Mensalidade value)
        {
            try
            {
                Mensalidade oMensalidade = new Mensalidade();
                oMensalidade = oMensalidade.ToMensalidade(oMensalidade.ObtemById(value.id)[0]);

                Aluno oAluno = new Aluno();
                oAluno = oAluno.ToAluno(oAluno.ObtemUnico(Convert.ToInt32(oMensalidade.id_aluno)));


                Instituicao oInstituicao = new Instituicao();
                oInstituicao = oInstituicao.GetByUser(Convert.ToInt32(oAluno.id_usuario));


                PagSeguroPagamento oPagSeguroPagamento = new PagSeguro().Checkout(oMensalidade, oAluno, oInstituicao);

                oPagSeguroPagamento.idMensalidade = oMensalidade.id;
                oPagSeguroPagamento.Criar(oPagSeguroPagamento.code, oPagSeguroPagamento.date, Convert.ToInt32(oPagSeguroPagamento.idMensalidade));
                return oPagSeguroPagamento.code;
            }
            catch (Exception e)
            {
                ErroHandler.Log("PagSeguro_CheckoutController", e, "POST", "");
                throw e;
            }
        }
    }
}
