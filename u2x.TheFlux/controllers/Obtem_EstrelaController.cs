using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Obtem_EstrelaController : ApiController
    {

        private u2xMainEntities1 db = new u2xMainEntities1();

        [HttpPost]
        public Int32 Post([FromBody]dynamic value)
        {
            try
            {
                Int32 idUsuario = Convert.ToInt32(value.id);
                List<tf_estrelas> estrelas = db.tf_estrelas.Where(estrela => (estrela.id_usuario == idUsuario)).ToList<tf_estrelas>();
                return estrelas.Count;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Obtem_EstrelaController", e, "POST", "");
                return 0;
            }
        }
    }
}
