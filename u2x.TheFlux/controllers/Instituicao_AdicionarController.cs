using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("Instituicao_AdicionarController")]
    public class Instituicao_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            string nome = value.nome.ToString();
            try
            {

                tf_instituicao inst = new Instituicao().Add(value.nome.ToString(), value.documento.ToString(), value.telefone.ToString(), value.email.ToString());

                new Usuario().Add(value.login.ToString(), value.senha.ToString(), true, inst.id);


                new TipoMovimentacao().Add("Alimentação", inst.id);
                new TipoMovimentacao().Add("Educação", inst.id);
                new TipoMovimentacao().Add("Estéticos", inst.id);
                new TipoMovimentacao().Add("Habitação", inst.id);
                new TipoMovimentacao().Add("Impostos", inst.id);
                new TipoMovimentacao().Add("Lazer", inst.id);
                new TipoMovimentacao().Add("Saúde", inst.id);
                new TipoMovimentacao().Add("Transporte", inst.id);
                new TipoMovimentacao().Add("Vestuário", inst.id);
                new TipoMovimentacao().Add("Outros", inst.id);

                TipoPagamento _TipoPagamento = new TipoPagamento();
                _TipoPagamento.id_instituicao = inst.id;
                _TipoPagamento.is_ativo = true;

                _TipoPagamento.nome = "Cartão de Crédito";
                new TipoPagamento().Add(_TipoPagamento);

                _TipoPagamento.nome = "Cartão de Débito";
                new TipoPagamento().Add(_TipoPagamento);

                _TipoPagamento.nome = "Dinheiro";
                new TipoPagamento().Add(_TipoPagamento);

                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Adicionar_EstrelaController", e, "POST", "");

                u2xMainEntities1 db = new u2xMainEntities1();
                List<tf_instituicao> lstInstituicao = db.tf_instituicao.Where(inst => (inst.nome == nome)).ToList<tf_instituicao>();
                if (lstInstituicao != null && lstInstituicao.Count > 0)
                {
                    db.tf_instituicao.Remove(lstInstituicao[0]);
                    db.SaveChanges();
                }
                throw (e);
            }
        }

    }
}