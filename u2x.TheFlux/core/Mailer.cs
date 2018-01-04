using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.core
{
    public class Mailer
    {
        public bool RecuperaSenha(string email, string senha)
        {
            String body = "<html><head><style>html{line-height:1.5;font-family:\"Roboto\",sans-serif;font-weight:normal;color:rgba(0, 0, 0, 0.87)}</style></head><body style=\"margin: 0px\"><div style=\"height: 50px; background: black\"><center> <img style=\"height: 40px; margin - top:5px\" src=\"http://app.basicflux.com/img/logo_header.png\"/></center </div><div style=\"height:50px; margin-left:20%; width:60%;\"><h1 style=\"color:purple\">Nova Senha</h1><p> Você solicitiou uma nova senha no TheFlux! Sua nova senha é:</p><div style=\"height:50px; background:purple; color:white\"><center style=\"vertical-align: middle;line-height: 50px;\">{0}</center></div><p> Você pode trocar sua senha a qualquer momento, selecionando o menu \"Usuário\", então clicando na chave ao lado do seu nome.</p><p> Atenciosamente,</p><p> Equipe BasicFlux</p></div></body></html>";
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("contato@basicflux.com");

                message.To.Add(new MailAddress(email));

                message.Subject = "THEFLUX - Troca de Senha";
                body = body.Replace("{0}", senha);
                message.Body = body;
                message.IsBodyHtml = true;

                SmtpClient client = new SmtpClient();
                client.Send(message);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mailer", e, "RecuperaSenha", "");
                return false;
            }
        }
    }
}