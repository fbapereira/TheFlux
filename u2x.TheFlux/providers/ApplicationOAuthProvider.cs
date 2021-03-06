﻿using Microsoft.Owin.Security.OAuth;
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
            try
            {
                c.Validated();

                return Task.FromResult<object>(null);
            }
            catch (Exception e)
            {
                ErroHandler.Log("ApplicationOAuthProvider", e, "ValidateClientAuthentication", "");
            }

            return null;
        }

        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext c)
        {
            try
            {
                //u2xMainEntities1 db = new u2xMainEntities1();
                //tf_usuario oUsuario = (tf_usuario)db.tf_usuario.Where(
                //        usuario => usuario.login == c.UserName && usuario.senha == c.Password).FirstOrDefault();

                //if (oUsuario != null)
                //{
                //Claim claim = new Claim(ClaimTypes.Name, c.UserName);

                var identity = new ClaimsIdentity();
                identity.AddClaim(new Claim(ClaimTypes.Name, "userNameTeste"));

                c.Validated(identity);

                //}



                return Task.FromResult<object>(null);

            }
            catch (Exception e)
            {
                ErroHandler.Log("ApplicationOAuthProvider", e, "GrantResourceOwnerCredentials", "");
            }

            return null;
        }
    }
}