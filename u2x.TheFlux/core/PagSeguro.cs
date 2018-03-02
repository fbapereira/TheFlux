using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace u2x.TheFlux.core
{
    public class PagSeguro
    {
        private static readonly HttpClient _HttpClient = new HttpClient();
        public string Checkout()
        {
            using (var client = new HttpClient())
            {
                string urlPagSeguro = System.Configuration.ConfigurationManager.AppSettings["pagSeguroURL_CHECKOUT"];


                var values = new Dictionary<string, string>();
                var content = new FormUrlEncodedContent(values);
                var response = client.PostAsync("https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=fba_pereira@hotmail.com&token=4A82A4D0DCDF4D6D8140508ADE3EFC17&currency=BRL&itemId1=0001&itemDescription1=undefined&itemAmount1=100.00&itemQuantity1=1&itemWeight1=1000&reference=REF1234&senderName=ALUNO%20TESTE&senderEmail=Fba_pereira@hotmail.com", content).Result;

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = response.Content;

                    // by calling .Result you are synchronously reading the result
                    string responseString = responseContent.ReadAsStringAsync().Result;

                    return responseString;
                }
            }
            return null;
        }
    }

    public class CheckoutItem
    {

    }
}