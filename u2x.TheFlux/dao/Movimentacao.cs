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
        public Int32 idUsuario;
        public Boolean isEntrada;
        public new String descricao;
        public new double valor;
        public new DateTime data;

        private u2xMainEntities db = new u2xMainEntities();

        public void Add(Int32 idTipoMovimentacao, Int32 idUsuario, Boolean isEntrada, String descricao, double valor)
        {
            tf_movimentacao movimentacao = new tf_movimentacao()
            {
                data = DateTime.Now,
                descricao = descricao,
                id_tipo_movimentacao = idTipoMovimentacao,
                id_usuario = idUsuario,
                is_entrada = isEntrada,
                valor = valor,
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
               (x.data.Month == mes || mes == 0)
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
                  (mov.data.Month == mes || mes == 0))

            select (mov)).ToList<tf_movimentacao>();

            if (lst.Count == 0) { return null; }
            List<Movimentacao> lstMovimentacao = new List<Movimentacao>();

            lst.ForEach((x) =>
            {
                lstMovimentacao.Add(ToMovimentacao(x));
            });
            return lstMovimentacao;
        }


        public void Delete(Int32 id)
        {
            db.tf_movimentacao.RemoveRange(db.tf_movimentacao.Where((x) =>
                            x.id == id
            ));
            db.SaveChanges();
        }

        private Movimentacao ToMovimentacao(tf_movimentacao obj)
        {
            return new Movimentacao()
            {
                id = obj.id,
                data = obj.data,
                descricao = obj.descricao,
                idTipoMovimentacao = obj.id_tipo_movimentacao,
                idUsuario = obj.id_usuario,
                isEntrada = obj.is_entrada,
                valor = obj.valor,
            };
        }
    }
}