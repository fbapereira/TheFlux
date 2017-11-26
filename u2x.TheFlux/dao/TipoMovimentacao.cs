using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class TipoMovimentacao : tf_tipo_movimentacao
    {
        public new Int32 id;
        public new String descricao;

        private u2xMainEntities db = new u2xMainEntities();

        public void Add(String descricao, Int32 idInstituicao)
        {
            tf_tipo_movimentacao temp = new tf_tipo_movimentacao()
            {
                descricao = descricao,
                is_canceled = false,
                id_instituicao = idInstituicao
            };
            db.tf_tipo_movimentacao.Add(temp);
            db.SaveChanges();
        }

        public List<TipoMovimentacao> Get(Int32 idInstituicao)
        {
            List<tf_tipo_movimentacao> temp = db.tf_tipo_movimentacao.Where(x => (x.id_instituicao == idInstituicao && !(bool)x.is_canceled)).ToList();
            if (temp.Count == 0) { return null; }

            List<TipoMovimentacao> lst = new List<TipoMovimentacao>();

            temp.ForEach((x) =>
            {
                lst.Add(ToTipoMovimentacao(x));
            });
            return lst;
        }

        public void Update(Int32 id, String descricao)
        {

            tf_tipo_movimentacao temp = db.tf_tipo_movimentacao.Where(x => x.id == id).FirstOrDefault();
            temp.descricao = descricao;
            db.SaveChanges();

        }

        public void Active(Int32 id)
        {
            tf_tipo_movimentacao temp = db.tf_tipo_movimentacao.Where(x => x.id == id).FirstOrDefault();
            temp.is_canceled = false;
            db.SaveChanges();
        }

        public void Deactive(Int32 id)
        {

            tf_tipo_movimentacao temp = db.tf_tipo_movimentacao.Where(x => x.id == id).FirstOrDefault();
            temp.is_canceled = true;
            db.SaveChanges();
        }

        private TipoMovimentacao ToTipoMovimentacao(tf_tipo_movimentacao obj)
        {
            return new TipoMovimentacao()
            {
                id = obj.id,
                descricao = obj.descricao
            };
        }
    }
}