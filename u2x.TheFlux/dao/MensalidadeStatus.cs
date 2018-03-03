using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class MensalidadeStatus : vw_mensalidade_pagamento
    {
        private u2xMainEntities1 db = new u2xMainEntities1();
        public List<vw_mensalidade_pagamento> Obtem(Int32 id_aluno)
        {
            return (from item in db.vw_mensalidade_pagamento
                    where item.id_aluno == id_aluno
                    select item)
         .OrderBy(c => c.ano).ThenBy(n => n.mes).ToList();

        }

        public MensalidadeStatus ToMensalidade(vw_mensalidade_pagamento obj)
        {
            return new MensalidadeStatus()
            {
                id = obj.id,
                mes = obj.mes,
                ano = obj.ano,
                valor = obj.valor,
                dt_pagamento = obj.dt_pagamento,
                id_aluno = obj.id_aluno,
                formaPagamento = obj.formaPagamento,
                status = status
            };
        }
    }
}