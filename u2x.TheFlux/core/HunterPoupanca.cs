using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.core
{
    public class PoupancaItem
    {
        public DateTime aporte;
        public Double rendimento;
    }

    public class HunterPoupanca
    {
        private u2xMainEntities1 db = new u2xMainEntities1();
        String url = "http://www4.bcb.gov.br/pec/poupanca/poupanca.asp";

        public void SearchAsync()
        {
            try
            {
                if (ValidaImportacao())
                {
                    WebClient client = new WebClient();
                    client.Encoding = System.Text.Encoding.UTF8;
                    client.DownloadStringCompleted += (sender, args) =>
                    {
                        if (!args.Cancelled && args.Error == null)
                        {
                        // Investir 
                        String sBody = CortaTabela(args.Result);
                            List<String> lstData = ProcessaTabela(sBody);
                            List<PoupancaItem> lstDataProcessada = ProcessaDados(lstData);
                            SalvaDados(lstDataProcessada);

                        }
                    };
                    client.DownloadStringAsync(new Uri(url));
                }
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "SearchAsync", "");
                throw e;
            }
        }

        private void SalvaDados(List<PoupancaItem> lstDataProcessada)
        {
            try
            {
                lstDataProcessada.ForEach(x =>
                    {
                        if (this.ultimoAporte < x.aporte)
                        {
                            tf_poupanca poupanca = new tf_poupanca()
                            {
                                aporte = x.aporte,
                                rendimento = (decimal)x.rendimento
                            };

                            db.tf_poupanca.Add(poupanca);
                            db.SaveChanges();
                        }
                    });
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "SalvaDados", "");
                throw e;
            }
        }
        DateTime ultimoAporte;
        public Boolean ValidaImportacao()
        {
            try
            {
                tf_poupanca oPoupanca = db.tf_poupanca.OrderByDescending(t => t.aporte).FirstOrDefault();
                if (oPoupanca == null) { return true; }
                ultimoAporte = (DateTime)oPoupanca.aporte;
                return (oPoupanca.aporte < DateTime.Today);
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "ValidaImportacao", "");
                throw e;
            }
        }

        public String CortaTabela(String body)
        {
            try
            {
                Int32 startIndex = body.IndexOf("<tr class=fundoPadraoAClaro2 align='center'><td class=fundoPadraoAClaro1a>");
                body = body.Substring(startIndex - 1);

                Int32 endIndex = body.IndexOf("</table>");
                body = body.Substring(0, endIndex);

                return body;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "CortaTabela", "");
                throw e;
            }
        }


        public List<String> ProcessaTabela(String body)
        {
            try
            {
                string[] values = body.Split(new string[] { "<tr>", "</tr>", "<td>", "</td>" }, StringSplitOptions.RemoveEmptyEntries);

                List<String> lstString = new List<string>(values);
                List<String> lstReturnString = new List<string>();

                lstString.ForEach((String field) =>
                {
                    Int32 startIndex = field.LastIndexOf(">");
                    if (startIndex != -1)
                    {
                        startIndex = startIndex + 1;

                        String filedValue = field.Substring(startIndex);

                        if (!String.IsNullOrEmpty(filedValue.Trim()))
                            lstReturnString.Add(filedValue.Replace("&nbsp;", ""));
                    }
                });

                return lstReturnString;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "ProcessaTabela", "");
                throw e;
            }
        }

        public List<PoupancaItem> ProcessaDados(List<String> lststring)
        {
            try
            {
                List<PoupancaItem> lstRetorno = new List<PoupancaItem>();


                while (lststring.Count > 0)
                {
                    PoupancaItem oPoupancaItem = new PoupancaItem();

                    //Data 
                    oPoupancaItem.aporte = DateTime.ParseExact(lststring[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    lststring.RemoveAt(0);

                    //Discarta coluna 
                    for (int i = 0; i < 6; i++)
                    {
                        lststring.RemoveAt(0);
                    }


                    //Remuneração total
                    oPoupancaItem.rendimento = Convert.ToDouble(lststring[0].Replace(",", "."));
                    lststring.RemoveAt(0);



                    lstRetorno.Add(oPoupancaItem);
                }
                return lstRetorno;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterPoupanca", e, "ProcessaDados", "");
                throw e;
            }
        }
    }
}