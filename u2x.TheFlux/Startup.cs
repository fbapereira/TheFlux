using System;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security.OAuth;
using U2X.TheFlux;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(U2X.TheFlux.Startup))]
namespace U2X.TheFlux
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }

        private void ConfigureAuth(IAppBuilder app)
        {
            // Para utilizar o Header "Authorization" nas requisições
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            // Ativar o método para gerar o OAuth Token
            app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions()
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            });
                   

            app.UseCors(CorsOptions.AllowAll);
        }
    }
}
