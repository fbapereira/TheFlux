using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class PagSeguroNotification : tf_pagseguro_notification
    {

        private u2xMainEntities1 db = new u2xMainEntities1();
        public Boolean Criar(String code, String address)
        {

            tf_pagseguro_notification obj = new tf_pagseguro_notification()
            {
                code = code,
                isProcessed = false,
                address = address
            };

            db.tf_pagseguro_notification.Add(obj);
            db.SaveChanges();
            return true;
        }

        public Boolean Finalizar(String code)
        {
            List<tf_pagseguro_notification> lst = db.tf_pagseguro_notification.Where(x => (x.code == code)).ToList<tf_pagseguro_notification>();

            if (lst.Count == 0) { return false; }

            lst.ForEach((x) =>
            {
                x.isProcessed = true;
            });

            db.SaveChanges();

            return true;
        }

    }
}