using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class Mensalidade : tf_mensalidade
    {
        private u2xMainEntities1 db = new u2xMainEntities1();

        public tf_mensalidade Criar(Int32 id_aluno, Int32 ano, Int32 mes, decimal valor)
        {

            tf_mensalidade aluno = new tf_mensalidade()
            {
                ano = ano,
                id_aluno = id_aluno,
                mes = mes,
                valor = valor
            };

            db.tf_mensalidade.Add(aluno);
            db.SaveChanges();
            return aluno;
        }

        public List<tf_mensalidade> Obtem(Int32 id_aluno)
        {
            return (from item in db.tf_mensalidade
                    where item.id_aluno == id_aluno
                    select item)
         .OrderBy(c => c.ano).ThenBy(n => n.mes)
 .ToList();

        }

        public Mensalidade ToMensalidade(tf_mensalidade obj)
        {
            return new Mensalidade()
            {
                id = obj.id,
                mes = obj.mes,
                ano = obj.ano,
                valor = obj.valor,
                dt_pagamento = obj.dt_pagamento,
            };
        }
    }
}