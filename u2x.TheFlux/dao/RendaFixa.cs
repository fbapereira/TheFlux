using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class RendaFixa
    {

        private u2xMainEntities1 db = new u2xMainEntities1();

        public void Cria(tf_investimento_RF otf_investimento_RF)
        {
            db.tf_investimento_RF.Add(otf_investimento_RF);
            db.SaveChanges();
        }

        public void Altera(tf_investimento_RF otf_investimento_RF)
        {
            tf_investimento_RF temp = (tf_investimento_RF)db.tf_investimento_RF.Where(inv => inv.id == otf_investimento_RF.id).FirstOrDefault();
            temp.is_ativo = otf_investimento_RF.is_ativo;
            temp.nome = otf_investimento_RF.nome;
            db.SaveChanges();
        }

        public List<tf_investimento_RF> Obtem(Int32 id_instituicao)
        {

            return db.tf_investimento_RF.Where(inv => inv.id_instituicao == id_instituicao && inv.is_ativo).ToList<tf_investimento_RF>();

        }

        public void Exclui(Int32 id_tf_investimento_RF)
        {
            tf_investimento_RF temp = (tf_investimento_RF)db.tf_investimento_RF.Where(inv => inv.id == id_tf_investimento_RF).FirstOrDefault();
            temp.is_ativo = false;
            db.SaveChanges();
        }

        public void Aporta(tf_investimento_RF_aporte otf_investimento_RF_aporte)
        {
            db.tf_investimento_RF_aporte.Add(otf_investimento_RF_aporte);
            db.SaveChanges();
        }

        public List<tf_investimento_RF_aporte> ObtemAporte(Int32 id_investimento_RF)
        {

            return db.tf_investimento_RF_aporte.Where(inv => inv.id_investimento_RF == id_investimento_RF).ToList<tf_investimento_RF_aporte>();

        }

        public void RemoveAporte(Int32 id_investimento_RF)
        {
            db.tf_investimento_RF_aporte.RemoveRange(db.tf_investimento_RF_aporte.Where(inv => inv.id == id_investimento_RF));
            db.SaveChanges();

        }

        public void Registra(tf_investimento_RF_variacao otf_investimento_RF_variacao)
        {
            db.tf_investimento_RF_variacao.Add(otf_investimento_RF_variacao);
            db.SaveChanges();
        }

        public List<tf_investimento_RF_variacao> ObtemRegistro(Int32 id_investimento_RF)
        {

            return db.tf_investimento_RF_variacao.Where(inv => inv.id_investimento_RF == id_investimento_RF).ToList<tf_investimento_RF_variacao>();

        }

        public void RemoveRegistro(Int32 id_investimento_RF)
        {
            db.tf_investimento_RF_variacao.RemoveRange(db.tf_investimento_RF_variacao.Where(inv => inv.id == id_investimento_RF));
            db.SaveChanges();


        }

    }
}