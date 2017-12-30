using System;

namespace u2x.TheFlux.dao
{
    public static class ErroHandler
    {

        private static u2xMainEntities1 db = new u2xMainEntities1();

        public static void Log(String classe, Exception error, String metodo, String usuario)
        {
            try
            {
                String errorMessage = "";

                if (error.Message != null)
                {
                    errorMessage = error.Message;
                    if (error.InnerException != null)
                    {
                        errorMessage += error.InnerException.Message;

                    }
                }

                tf_error oError = new tf_error()
                {
                    classe = classe,
                    error = errorMessage,
                    hora = DateTime.Now,
                    metodo = metodo,
                    usuario = usuario
                };

                db.tf_error.Add(oError);
                db.SaveChanges();
            }
            catch (Exception)
            {
            }
        }


        public static void LogFake(String classe, String error, String metodo, String usuario)
        {
            try
            {
             

                tf_error oError = new tf_error()
                {
                    classe = classe,
                    error = error,
                    hora = DateTime.Now,
                    metodo = metodo,
                    usuario = "Logger"
                };

                db.tf_error.Add(oError);
                db.SaveChanges();
            }
            catch (Exception)
            {
            }
        }
    }
}