using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class ContasFuturas : tf_movimentacao_futura
    {

        private u2xMainEntities1 db = new u2xMainEntities1();

        public Int32 Criar(string nome, Int32 id_tipo_movimentacao, Int32 id_forma_pagamento, Decimal valor_base, Int32 id_usuario, bool is_entrada)
        {
            tf_movimentacao_futura mov = new tf_movimentacao_futura()
            {
                nome = nome,
                id_tipo_movimentacao = id_tipo_movimentacao,
                id_tipo_pagamento = id_forma_pagamento,
                valor_base = valor_base,
                id_usuario = id_usuario,
                is_entrada = is_entrada

            };

            db.tf_movimentacao_futura.Add(mov);
            db.SaveChanges();
            return mov.id;
        }

        public void CriarParcela(DateTime dt_include, String email, Int32 id_movimentacao_futura, Decimal valor_real)
        {
            tf_parcela_futura par = new tf_parcela_futura()
            {
                dt_include = dt_include,
                email = email,
                is_pago = false,
                id_movimentacao_futura = id_movimentacao_futura,
                valor_real = valor_real,

            };

            db.tf_parcela_futura.Add(par);
            db.SaveChanges();
        }

        public List<tf_movimentacao_futura> Obtem(Int32 id_usuario)
        {
            return db.tf_movimentacao_futura.Where(mov => (mov.id_usuario == id_usuario)).ToList<tf_movimentacao_futura>();
        }

        public List<tf_parcela_futura> ObtemParcela(Int32 id)
        {
            return db.tf_parcela_futura.Where(mov => (mov.id_movimentacao_futura == id)).ToList<tf_parcela_futura>();
        }

        public void MudaStatus(Int32 id, bool isPago)
        {
            List<tf_parcela_futura> lst = db.tf_parcela_futura.Where(x => (x.id == id)).ToList<tf_parcela_futura>();

            if (lst.Count == 0) { return; }

            lst[0].is_pago = isPago;

            db.SaveChanges();
        }

        public ContasFuturas ToContas(tf_movimentacao_futura obj)
        {
            return new ContasFuturas()
            {
                id = obj.id,
                nome = obj.nome,
                id_tipo_movimentacao = obj.id_tipo_movimentacao,
                id_tipo_pagamento = obj.id_tipo_pagamento,
                valor_base = obj.valor_base,
                id_usuario = obj.id_usuario,
                is_entrada = obj.is_entrada

            };
        }
        public Parcela ToParcelas(tf_parcela_futura obj)
        {
            return new Parcela()
            {
                id = obj.id,
                email = obj.email,
                dt_include = obj.dt_include,
                is_pago = obj.is_pago,
                valor_real = obj.valor_real,

            };
        }

        public List<vw_email_conta_a_pagar> ObtemContasPagar()
        {
            return db.vw_email_conta_a_pagar.ToList<vw_email_conta_a_pagar>();
        }

        public List<vw_email_conta_a_receber> ObtemContasReceber()
        {
            return db.vw_email_conta_a_receber.ToList<vw_email_conta_a_receber>();
        }

        public void MandaEmail(Int32 id)
        {
            List<tf_parcela_futura> lst = db.tf_parcela_futura.Where(x => (x.id == id)).ToList<tf_parcela_futura>();

            if (lst.Count == 0) { return; }

            lst[0].is_email_sent = true;

            db.SaveChanges();
        }
    }

    public class Parcela : tf_parcela_futura
    {
    }
}