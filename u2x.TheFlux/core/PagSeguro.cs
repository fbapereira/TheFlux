using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.core
{
    public class PagSeguro : tf_pagseguro_pagamento
    {
        private static readonly HttpClient _HttpClient = new HttpClient();
        private u2xMainEntities1 db = new u2xMainEntities1();

        public Boolean ConsultTransaction(String code, Instituicao oInstituicao)
        {
            PagSeguroPagamento oPagSeguroPagamento = new PagSeguroPagamento();

            string urlPagSeguro = System.Configuration.ConfigurationManager.AppSettings["pagSeguroURL_CONSULT"];

            urlPagSeguro = urlPagSeguro.Replace("#email#", oInstituicao.email);
            urlPagSeguro = urlPagSeguro.Replace("#token#", oInstituicao.token);
            urlPagSeguro = urlPagSeguro.Replace("#code#", code);

            using (var client = new HttpClient())
            {
                var values = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(values);
                var response = client.GetAsync(urlPagSeguro).Result;


                if (response.IsSuccessStatusCode)
                {
                    var responseContent = response.Content;

                    // by calling .Result you are synchronously reading the result
                    string responseString = responseContent.ReadAsStringAsync().Result;
                    XmlDocument xml = new XmlDocument();
                    xml.LoadXml(responseString);

                    oPagSeguroPagamento.statusDate = DateTime.Now;

                    XmlNodeList nodeList = xml.GetElementsByTagName("status");
                    oPagSeguroPagamento.status = nodeList[0].InnerText;

                    nodeList = xml.GetElementsByTagName("code");
                    oPagSeguroPagamento.code = nodeList[0].InnerText;

                    nodeList = xml.GetElementsByTagName("paymentMethod")[0].SelectNodes("type");
                    oPagSeguroPagamento.formaPagamento = nodeList[0].InnerText;

                    List<tf_pagseguro_pagamento> lst = db.tf_pagseguro_pagamento.Where(x => (x.codeResponse == oPagSeguroPagamento.code)).ToList<tf_pagseguro_pagamento>();

                    if (lst.Count == 0) { return false; }

                    lst[0].statusDate = DateTime.Now;
                    lst[0].status = GetStatus(oPagSeguroPagamento.status);
                    lst[0].formaPagamento = GetPaymentMethod(oPagSeguroPagamento.formaPagamento);

                    db.SaveChanges();
                    return true;
                }
            }
            return true;
        }

        public Boolean ProcessNotification(String code, String port)
        {
            PagSeguroPagamento oPagSeguroPagamento = new PagSeguroPagamento();

            string idInstituicao = System.Configuration.ConfigurationManager.AppSettings["pagSeguro_" + port];
            Instituicao oInstituicao = new Instituicao().Get(Convert.ToInt32(idInstituicao));

            string urlPagSeguro = System.Configuration.ConfigurationManager.AppSettings["pagSeguroURL_NOTIFICATION"];

            urlPagSeguro = urlPagSeguro.Replace("#email#", oInstituicao.email);
            urlPagSeguro = urlPagSeguro.Replace("#token#", oInstituicao.token);
            urlPagSeguro = urlPagSeguro.Replace("#code#", code);

            using (var client = new HttpClient())
            {
                var values = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(values);
                var response = client.GetAsync(urlPagSeguro).Result;


                if (response.IsSuccessStatusCode)
                {
                    var responseContent = response.Content;

                    // by calling .Result you are synchronously reading the result
                    string responseString = responseContent.ReadAsStringAsync().Result;
                    XmlDocument xml = new XmlDocument();
                    xml.LoadXml(responseString);

                    oPagSeguroPagamento.statusDate = DateTime.Now;

                    XmlNodeList nodeList = xml.GetElementsByTagName("status");
                    oPagSeguroPagamento.status = nodeList[0].InnerText;

                    nodeList = xml.GetElementsByTagName("code");
                    oPagSeguroPagamento.code = nodeList[0].InnerText;

                    nodeList = xml.GetElementsByTagName("paymentMethod")[0].SelectNodes("type");
                    oPagSeguroPagamento.formaPagamento = nodeList[0].InnerText;

                    List<tf_pagseguro_pagamento> lst = db.tf_pagseguro_pagamento.Where(x => (x.codeResponse == oPagSeguroPagamento.code)).ToList<tf_pagseguro_pagamento>();

                    if (lst.Count == 0) { return false; }

                    lst[0].statusDate = DateTime.Now;
                    lst[0].status = GetStatus(oPagSeguroPagamento.status);
                    lst[0].formaPagamento = GetPaymentMethod(oPagSeguroPagamento.formaPagamento);

                    db.SaveChanges();
                    return true;
                }
            }
            return true;
        }

        public PagSeguroPagamento Checkout(dao.Mensalidade oMensalidade, dao.Aluno oAluno, dao.Instituicao oInstituicao)
        {
            string urlPagSeguro = System.Configuration.ConfigurationManager.AppSettings["pagSeguroURL_CHECKOUT"];
            urlPagSeguro = urlPagSeguro.Replace("#descricao#", "Mensalidade (" + oMensalidade.mes.ToString() + "/" + oMensalidade.ano.ToString() + ")");
            urlPagSeguro = urlPagSeguro.Replace("#valor#", Convert.ToInt32(oMensalidade.valor).ToString("N2"));
            urlPagSeguro = urlPagSeguro.Replace("#nome#", oAluno.nome);
            urlPagSeguro = urlPagSeguro.Replace("#email#", oAluno.email);
            urlPagSeguro = urlPagSeguro.Replace("#emailInstituicao#", oInstituicao.email);
            urlPagSeguro = urlPagSeguro.Replace("#token#", oInstituicao.token);
            urlPagSeguro = urlPagSeguro.Replace("#reference#", oMensalidade.id.ToString());


            using (var client = new HttpClient())
            {

                var values = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(values);
                var response = client.PostAsync(urlPagSeguro, content).Result;


                if (response.IsSuccessStatusCode)
                {
                    var responseContent = response.Content;

                    // by calling .Result you are synchronously reading the result
                    string responseString = responseContent.ReadAsStringAsync().Result;
                    XmlDocument xml = new XmlDocument();
                    xml.LoadXml(responseString);

                    PagSeguroPagamento oPagSeguroPagamento = new PagSeguroPagamento();

                    XmlNodeList nodeList = xml.GetElementsByTagName("code");
                    oPagSeguroPagamento.code = nodeList[0].InnerText;

                    nodeList = xml.GetElementsByTagName("date");
                    oPagSeguroPagamento.date = nodeList[0].InnerText;

                    return oPagSeguroPagamento;
                }
            }
            return null;
        }

        public Boolean CheckoutSuccess(string code, string resposta)
        {

            List<tf_pagseguro_pagamento> lst = db.tf_pagseguro_pagamento.Where(x => (x.code == code)).ToList<tf_pagseguro_pagamento>();
            if (lst.Count == 0) { return false; }
            lst[0].codeResponse = resposta;
            lst[0].dateResponse = DateTime.Now;

            Int32 idMensalidade = Convert.ToInt32(lst[0].idMensalidade);

            List<tf_mensalidade> lstMensalidade = db.tf_mensalidade.Where(x => (x.id == idMensalidade)).ToList<tf_mensalidade>();
            if (lstMensalidade.Count == 0) { return false; }
            lstMensalidade[0].dt_pagamento = DateTime.Now;

            db.SaveChanges();

            return true;
        }


        public String GetPaymentMethod(String obj)
        {
            switch (obj)
            {
                case "1":
                    return "Cartão de crédito";
                case "2":
                    return "Boleto";
                case "3":
                    return "Débito online (TEF)";
                case "4":
                    return "Saldo PagSeguro";
                case "5":
                    return "Oi Paggo";
                case "6":
                    return "Indefinido";
                case "7":
                    return "Depósito em conta";
                default:
                    return "indefinido" + obj;
            }
        }

        public String GetStatus(String obj)
        {
            switch (obj)
            {
                case "1":
                    return "Aguardando pagamento";
                case "2":
                    return "Em análise";
                case "3":
                    return "Paga";
                case "4":
                    return "Disponível";
                case "5":
                    return "Em disputa";
                case "6":
                    return "Devolvida";
                case "7":
                    return "Cancelada";
                case "8":
                    return "Debitado";
                case "9":
                    return "Retenção temporária";
                default:
                    return "indefinido" + obj;
            }
        }

    }
}