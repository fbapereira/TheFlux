using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class PagSeguroPagamento : tf_pagseguro_pagamento
    {
        private u2xMainEntities1 db = new u2xMainEntities1();

        public tf_pagseguro_pagamento Criar(String code, String data, Int32 idMensalidade)
        {

            tf_pagseguro_pagamento obj = new tf_pagseguro_pagamento()
            {
                code = code,
                date = data,
                idMensalidade = idMensalidade
            };

            db.tf_pagseguro_pagamento.Add(obj);
            db.SaveChanges();
            return obj;
        }
    }
}