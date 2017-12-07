using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class TipoPagamento : tf_tipo_pagamento
    {
        private u2xMainEntities1 db = new u2xMainEntities1();

        public void Add(TipoPagamento tipoPagamento)
        {
            tf_tipo_pagamento temp = new tf_tipo_pagamento();
            temp.cobranca_juros = (decimal)tipoPagamento.cobranca_juros;
            temp.id_instituicao = tipoPagamento.id_instituicao;
            temp.is_ativo = tipoPagamento.is_ativo;
            temp.nome= tipoPagamento.nome;

            db.tf_tipo_pagamento.Add(temp);
            db.SaveChanges();
        }

        public List<TipoPagamento> Get(Int32 idInstituicao)
        {
            List<tf_tipo_pagamento> temp = db.tf_tipo_pagamento.Where(x => (x.id_instituicao == idInstituicao)).ToList();
            if (temp.Count == 0) { return null; }

            List<TipoPagamento> lst = new List<TipoPagamento>();

            temp.ForEach((x) =>
            {
                lst.Add(ToTipoPagamento(x));
            });
            return lst;
        }

        public bool Alterar(TipoPagamento tipoPagamento)
        {
            List<tf_tipo_pagamento> temp = db.tf_tipo_pagamento.Where(x => (x.id == tipoPagamento.id)).ToList();
            if (temp.Count == 0) { return false; }

            temp[0].id = tipoPagamento.id;
            temp[0].cobranca_juros = tipoPagamento.cobranca_juros;
            temp[0].is_ativo = tipoPagamento.is_ativo;
            temp[0].nome = tipoPagamento.nome;
            db.SaveChanges();
            return true;
        }


        private TipoPagamento ToTipoPagamento(tf_tipo_pagamento obj)
        {
            return new TipoPagamento()
            {
                id = obj.id,
                cobranca_juros = obj.cobranca_juros,
                is_ativo = obj.is_ativo,
                nome = obj.nome,
                id_instituicao = obj.id_instituicao
            };
        }
    }
}