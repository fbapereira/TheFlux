using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.core
{
    public class HunterContasFuturas
    {
        public void SearchAsync()
        {
            ContasFuturas oCont = new ContasFuturas();
            List<vw_email_conta_a_pagar> lstPagar = oCont.ObtemContasPagar();
            List<vw_email_conta_a_receber> lstReceber = oCont.ObtemContasReceber();

            lstPagar.ForEach((x) =>
            {
                new Mailer().ContaAPagar(x.email, x.conta, "R" + ((decimal)x.valor_base).ToString("C"));
                oCont.MandaEmail(x.id);

            });

            lstReceber.ForEach((x) =>
            {
                new Mailer().ContaAPagar(x.email, x.conta, "R" + ((decimal)x.valor_base).ToString("C"));
                oCont.MandaEmail(x.id);

            });

        }


    }
}