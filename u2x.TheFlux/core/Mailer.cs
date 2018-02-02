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

        public bool ContaAReceber(string email, string conta, String valor)
        {
            String body = "<html><head><style>html{line-height:1.5;font-family:\"Roboto\",sans-serif;font-weight:normal;color:rgba(0, 0, 0, 0.87)}</style></head><body style=\"margin: 0px\"><div style=\"height: 50px; background: black\"><center> <img style=\"height: 40px; margin - top:5px\" src=\"http://app.basicflux.com/img/logo_header.png\" /></center</div><div style=\"height:50px; margin-left:20%; width:60%;\"><h1 style=\"color:purple\">Conta Atrasada</h1><p> Você registrou um pagamento ({0}) no TheFlux! E ele vence hoje:</p><div style=\"height:50px; background:purple; color:white\"><center style=\"vertical-align: middle;line-height: 50px;\">{1}</center></div><p> Não se esqueça de marcar a conta como paga.</p><p> Atenciosamente,</p><p> Equipe BasicFlux</p></div></body></html>";
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("contato@basicflux.com");

                message.To.Add(new MailAddress(email));

                message.Subject = "THEFLUX - Conta a Receber";
                body = body.Replace("{0}", conta);
                body = body.Replace("{1}", valor);
                message.Body = body;
                message.IsBodyHtml = true;

                SmtpClient client = new SmtpClient();
                client.Send(message);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mailer", e, "ContaAReceber", "");
                return false;
            }
        }

        public bool ContaAPagar(string email, string conta, String valor)
        {
            String body = "<html><head><style>html{line-height:1.5;font-family:\"Roboto\",sans-serif;font-weight:normal;color:rgba(0, 0, 0, 0.87)}</style></head><body style=\"margin: 0px\"><div style=\"height: 50px; background: black\"><center> <img style=\"height: 40px; margin - top:5px\" src=\"http://app.basicflux.com/img/logo_header.png\" /></center</div><div style=\"height:50px; margin-left:20%; width:60%;\"><h1 style=\"color:purple\">Conta Atrasada</h1><p> Você registrou uma conta ({0}) no TheFlux! E ela vence hoje:</p><div style=\"height:50px; background:purple; color:white\"><center style=\"vertical-align: middle;line-height: 50px;\">{1}</center></div><p> Não se esqueça de marcar a conta como paga.</p><p> Atenciosamente,</p><p> Equipe BasicFlux</p></div></body></html>";
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("contato@basicflux.com");

                message.To.Add(new MailAddress(email));

                message.Subject = "THEFLUX - Conta a Vencer";
                body = body.Replace("{0}", conta);
                body = body.Replace("{1}", valor);
                message.Body = body;
                message.IsBodyHtml = true;

                SmtpClient client = new SmtpClient();
                client.Send(message);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mailer", e, "ContaAPagar", "");
                return false;
            }
        }

        public bool Comprovante(string email, string conta, String valor, String data)
        {
            String body = "<html><head><style>html{line-height:1.5;font-family:\"Roboto\",sans-serif;font-weight:normal;color:rgba(0, 0, 0, 0.87)}</style></head><body style=\"margin: 0px\"><div style=\"height: 50px; background: black\"><center> <img style=\"height: 40px; margin - top:5px\" src=\"http://app.basicflux.com/img/logo_header.png\" /></center</div><div style=\"height:50px; margin-left:20%; width:60%;\"><h1 style=\"color:purple\">Conta Paga</h1><p> Você pagou a conta ({0}) registrada para o dia {{2}} no TheFlux! O valor pago foi de:</p><div style=\"height:50px; background:purple; color:white\"><center style=\"vertical-align: middle;line-height: 50px;\">{{1}}</center></div><p> Não se esqueça de marcar a conta como paga.</p><p> Atenciosamente,</p><p> Equipe BasicFlux</p></div></body></html>";
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("contato@basicflux.com");

                message.To.Add(new MailAddress(email));

                message.Subject = "THEFLUX - Conta a Vencer";
                body = body.Replace("{0}", conta);
                body = body.Replace("{1}", valor);
                body = body.Replace("{2}", data);
                message.Body = body;
                message.IsBodyHtml = true;

                SmtpClient client = new SmtpClient();
                client.Send(message);
                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Mailer", e, "ContaAPagar", "");
                return false;
            }
        }
    }
}