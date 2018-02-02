using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using u2x.TheFlux.dao;
namespace u2x.TheFlux.controllers
{
    [RoutePrefix("MovimentacaoPessoal_Obtem")]
    public class MovimentacaoPessoal_ObtemController : ApiController
    {
        // Retorna Nosso Authentication Manager
        private IAuthenticationManager Authentication
        {
            get { return HttpContext.Current.GetOwinContext().Authentication; }
        }

        [Authorize]
        public List<Movimentacao> Post([FromBody]Usuario value)
        {
            try
            {
                String a = this.Authentication.User.Identity.Name;
                return new Movimentacao().GetByUser(value.id);
            }
            catch (Exception e)
            {
                ErroHandler.Log("MovimentacaoPessoal_Obtem", e, "POST", "");
                throw e;
            }
        }
    }
}