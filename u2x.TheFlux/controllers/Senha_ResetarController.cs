using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using u2x.TheFlux.core;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Senha_ResetarController : ApiController
    {
        [HttpPost]
        public Instituicao Post([FromBody]Usuario value)
        {
            try
            {
                Usuario oUsu = new Usuario().Get(value.login);
                if (oUsu == null)
                {
                    throw new Exception("U2X_MessageUsuario não encontrado");
                }

                oUsu.senha = GerarSenha();
                new Usuario().Update(oUsu.id, oUsu.senha, oUsu.isAdmin, oUsu.id_instituicao);
                Instituicao oInst = new Instituicao().GetByUser(oUsu.id);

                new Mailer().RecuperaSenha(oInst.email, oUsu.senha);
                return oInst;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Senha_ResetarController", e, "POST", "");
                throw e;
            }
        }

        private String GerarSenha()
        {
            string validar = "BasicFluxRenatoFelipe";
            try
            {
                StringBuilder strbld = new StringBuilder(100);
                Random random = new Random();
                while (strbld.Length < 20)
                {
                    strbld.Append(validar[random.Next(validar.Length)]);
                }
                return strbld.ToString();

            }
            catch (Exception e)
            {
                ErroHandler.Log("Senha_ResetarController", e, "GerarSenha", "");
                throw e;
            }
        }
    }
}
