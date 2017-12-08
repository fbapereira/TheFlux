using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class Movimentacao : tf_movimentacao
    {
        public new Int32 id;
        public Int32 idTipoMovimentacao;
        public Int32 idTipoPagamento;
        public Int32 idUsuario;
        public Boolean isEntrada;
        public new String descricao;
        public new double valor;
        public new DateTime data;

        private u2xMainEntities1 db = new u2xMainEntities1();

        public void Add(Int32 idTipoMovimentacao, Int32 idTipoPagamento, Int32 idUsuario, Boolean isEntrada, String descricao, double valor, DateTime data)
        {
            tf_movimentacao movimentacao = new tf_movimentacao()
            {
                data = data,
                descricao = descricao,
                id_tipo_movimentacao = idTipoMovimentacao,
                id_tipo_pagamento = idTipoPagamento,
                id_usuario = idUsuario,
                is_entrada = isEntrada,
                valor = valor,
                is_canceled = false
            };
            db.tf_movimentacao.Add(movimentacao);
            db.SaveChanges();
        }

        public List<Movimentacao> GetByUser(Int32 idusuario, Int32 ano = 0, Int32 mes = 0)
        {
            List<tf_movimentacao> lst =
            db.tf_movimentacao.Where(x =>
            (
                x.id_usuario == idusuario &&
               (x.data.Year == ano || ano == 0) &&
               (x.data.Month == mes || mes == 0) &&
               !(bool)x.is_canceled
            )).ToList<tf_movimentacao>();

            if (lst.Count == 0) { return null; }
            List<Movimentacao> lstMovimentacao = new List<Movimentacao>();

            lst.ForEach((x) =>
            {
                lstMovimentacao.Add(ToMovimentacao(x));
            });
            return lstMovimentacao;
        }


        public List<Movimentacao> GetByInstituition(Int32 idInstituicao, Int32 ano = 0, Int32 mes = 0)
        {
            List<tf_movimentacao> lst = (
            from usu in db.tf_usuario

            join inst in db.tf_instituicao
            on usu.id_instituicao equals inst.id

            join mov in db.tf_movimentacao
            on usu.id equals mov.id_usuario

            where (inst.id == idInstituicao &&
                  (mov.data.Year == ano || ano == 0) &&
                  (mov.data.Month == mes || mes == 0) &&
                  !(bool)mov.is_canceled)

            select (mov)).ToList<tf_movimentacao>();

            if (lst.Count == 0) { return null; }
            List<Movimentacao> lstMovimentacao = new List<Movimentacao>();

            lst.ForEach((x) =>
            {
                lstMovimentacao.Add(ToMovimentacao(x));
            });
            return lstMovimentacao;
        }


        public bool Delete(Int32 id)
        {

            tf_movimentacao oMovimentacao = db.tf_movimentacao.Where((x) => x.id == id).SingleOrDefault();

            if (oMovimentacao != null)
            {
                oMovimentacao.is_canceled = true;
            }
            db.SaveChanges();
            return true;
        }

        private Movimentacao ToMovimentacao(tf_movimentacao obj)
        {
            return new Movimentacao()
            {
                id = obj.id,
                data = obj.data,
                descricao = obj.descricao,
                idTipoMovimentacao = obj.id_tipo_movimentacao,
                idTipoPagamento = (Int32)obj.id_tipo_pagamento,
                idUsuario = obj.id_usuario,
                isEntrada = obj.is_entrada,
                valor = obj.valor,
            };
        }
    }
}