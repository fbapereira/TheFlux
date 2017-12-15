using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class Estrela : tf_estrelas
    {
        private u2xMainEntities1 db = new u2xMainEntities1();

        public void Add(Int32 id_usuario, String telefone, String email)
        {
            tf_estrelas estrela = new tf_estrelas()
            {
                telefone = telefone,
                email = email,
                id_usuario = id_usuario
            };

            db.tf_estrelas.Add(estrela);
            db.SaveChanges();
        }

        public Int32 Contar(Int32 id_usuario)
        {
            List<tf_estrelas> estrelas = db.tf_estrelas.Where(estrela => (estrela.id_usuario == id_usuario)).ToList<tf_estrelas>();
            return estrelas.Count;
        }
    }
}