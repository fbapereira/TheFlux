using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    [RoutePrefix("Instituicao_AdicionarController")]
    public class Instituicao_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            string nome = value.nome.ToString();
            try
            {

                tf_instituicao inst = new Instituicao().Add(value.nome.ToString(), value.documento.ToString(), value.telefone.ToString(), value.email.ToString());

                new Usuario().Add(value.login.ToString(), value.senha.ToString(), true, inst.id);


                return true;
            }
            catch (Exception e)
            {
                u2xMainEntities1 db = new u2xMainEntities1();
                List<tf_instituicao> lstInstituicao = db.tf_instituicao.Where(inst => (inst.nome == nome)).ToList<tf_instituicao>();
                if (lstInstituicao != null && lstInstituicao.Count > 0)
                {
                    db.tf_instituicao.Remove(lstInstituicao[0]);
                    db.SaveChanges();
                }
                throw (e);
            }
        }

    }
}