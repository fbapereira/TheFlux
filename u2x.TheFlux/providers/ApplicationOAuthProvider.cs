using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using u2x.TheFlux.dao;

namespace U2X.TheFlux
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext c)
        {
            c.Validated();

            return Task.FromResult<object>(null);
        }

        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext c)
        {
            u2xMainEntities db = new u2xMainEntities();
            tf_usuario oUsuario = (tf_usuario)db.tf_usuario.Where(
                    usuario => usuario.login == c.UserName && usuario.senha == c.Password).FirstOrDefault();

            if (oUsuario != null)
            {
                Claim claim = new Claim(ClaimTypes.Name, c.UserName);
                Claim[] claims = new Claim[] { claim };
                ClaimsIdentity claimsIdentity =
                    new ClaimsIdentity(
                       claims, OAuthDefaults.AuthenticationType);
                c.Validated(claimsIdentity);
            }

            return Task.FromResult<object>(null);
        }
    }
}