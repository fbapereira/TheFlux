using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.core
{
    public class TesouroDiretoItem
    {
        public String titulo;
        public DateTime vencimento;
        public Double rendimento;
        public Double valorMinimo;
        public Double precoUnitario;
        public Int32 tipoOperacao;

    }

    public class HunterTesouro
    {
        private u2xMainEntities1 db = new u2xMainEntities1();
        String url = "http://www.tesouro.fazenda.gov.br/tesouro-direto-precos-e-taxas-dos-titulos";


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
                            if (ValidaDados(args.Result))
                            {
                                // Investir 
                                String sBody = CortaTabelaInvestir(args.Result);
                                List<String> lstData = ProcessaTabela(sBody);
                                List<TesouroDiretoItem> lstDataProcessada = ProcessaDados(lstData, false);
                                SalvaDados(lstDataProcessada);

                                // Vender 
                                sBody = CortaTabelaVender(args.Result);
                                lstData = ProcessaTabela(sBody);
                                lstDataProcessada = ProcessaDados(lstData, true);
                                SalvaDados(lstDataProcessada);
                            }
                        }
                    };
                    client.DownloadStringAsync(new Uri(url));
                }
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "SearchAsync", "");
                throw e;
            }
        }

        private void SalvaDados(List<TesouroDiretoItem> lstDataProcessada)
        {
            try
            {
                lstDataProcessada.ForEach(x =>
                    {
                        tf_tesouro tesouro = new tf_tesouro()
                        {
                            loggedTime = AtualImport,
                            precoUnitario = (decimal)x.precoUnitario,
                            rendimento = (decimal)x.rendimento,
                            titulo = x.titulo,
                            valorMinimo = (decimal)x.valorMinimo,
                            vencimento = x.vencimento,
                            tipoOperacao = x.tipoOperacao,

                        };

                        db.tf_tesouro.Add(tesouro);
                        db.SaveChanges();
                    });
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "SalvaDados", "");
                throw e;
            }
        }

        DateTime ultimoImport;
        DateTime AtualImport;
        public Boolean ValidaImportacao()
        {
            try
            {
                tf_tesouro otesouro = db.tf_tesouro.OrderByDescending(t => t.loggedTime).FirstOrDefault();
                if (otesouro == null) { return true; }
                ultimoImport = (DateTime)otesouro.loggedTime;
                return (otesouro.loggedTime < DateTime.Today);
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "ValidaImportacao", "");
                throw e;
            }
        }

        public Boolean ValidaDados(String body)
        {
            try
            {
                String index = "Atualizado em: ";
                Int32 startIndex = body.IndexOf(index);

                body = body.Substring(startIndex + index.Length);

                body = body.Replace("<b>", "");

                body = body.Replace("</b>", "");

                body = body.Substring(0, 10);

                this.AtualImport = DateTime.ParseExact(body, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                return ultimoImport < AtualImport;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "ValidaDados", "TESTE" + body);
                throw e;
            }
        }

        public String CortaTabelaInvestir(String body)
        {
            try
            {
                Int32 startIndex = -1;
                if (startIndex == -1)
                    startIndex = body.IndexOf("<tr class=\"tituloprefixado\"><td bgcolor=\"FFFF9C\" class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadoreferencia\" ><b>Indexados ao IPCA</b></td> <td class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadoreferencia\" colspan=\"6\"> </tr>");

                if (startIndex == -1)
                    startIndex = body.IndexOf("<tr class=\"tituloprefixado\"><td bgcolor=\"FFFF9C\" class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadosuspenso\"><b>Indexados ao IPCA</b></td> <td class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadosuspenso\" colspan=\"3\"> </td></tr>");


                body = body.Substring(startIndex);

                Int32 endIndex = body.IndexOf("</tbody></table>");
                body = body.Substring(0, endIndex);

                return body;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "CortaTabelaInvestir", "");
                throw e;
            }
        }

        public String CortaTabelaVender(String body)
        {
            try
            {
                Int32 startIndex = body.LastIndexOf("<tr class=\"tituloprefixado\"><td bgcolor=\"FFFF9C\" class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadoreferencia\" ><b>Indexados ao IPCA</b></td> <td class=\"tittuloTabelaTesouroDireto prefixadoTesouroDireto preipca mercadoreferencia\" colspan=\"3\"> </tr>");
                body = body.Substring(startIndex);

                Int32 endIndex = body.IndexOf("</tbody></table>");
                body = body.Substring(0, endIndex);

                return body;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "CortaTabelaVender", "");
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
                            lstReturnString.Add(filedValue);
                    }
                });

                return lstReturnString;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "ProcessaTabela", "");
                throw e;
            }
        }

        public List<TesouroDiretoItem> ProcessaDados(List<String> lststring, Boolean isCompra)
        {
            String sDate = "";
            try
            {
                List<TesouroDiretoItem> lstRetorno = new List<TesouroDiretoItem>();


                while (lststring.Count > 0)
                {
                    TesouroDiretoItem oTesouroDiretoItem = new TesouroDiretoItem();

                    //Título
                    oTesouroDiretoItem.titulo = lststring[0];
                    lststring.RemoveAt(0);

                    //Vencimento
                    sDate = lststring[0];
                    oTesouroDiretoItem.vencimento = DateTime.ParseExact(lststring[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    lststring.RemoveAt(0);

                    //Taxa de Rendimento(% a.a.)
                    oTesouroDiretoItem.rendimento = Convert.ToDouble(lststring[0].Replace(",", "."));
                    lststring.RemoveAt(0);

                    //Valor Mínimo
                    if (!isCompra)
                    {
                        lststring[0] = lststring[0].Replace(".", "");
                        lststring[0] = lststring[0].Replace("R$", "");
                        oTesouroDiretoItem.valorMinimo = Convert.ToDouble(lststring[0].Replace(",", "."));
                        lststring.RemoveAt(0);
                    }

                    //Preço Unitário
                    lststring[0] = lststring[0].Replace(".", "");
                    lststring[0] = lststring[0].Replace("R$", "");
                    oTesouroDiretoItem.precoUnitario = Convert.ToDouble(lststring[0].Replace(",", "."));
                    lststring.RemoveAt(0);

                    //tipoOperacao 
                    if (isCompra)
                    {
                        oTesouroDiretoItem.tipoOperacao = 1;
                    }
                    else
                    {
                        oTesouroDiretoItem.tipoOperacao = 2;
                    }

                    lstRetorno.Add(oTesouroDiretoItem);
                }
                return lstRetorno;
            }
            catch (Exception e)
            {
                ErroHandler.Log("HunterTesouro", e, "ProcessaDados", sDate);
                throw e;
            }
        }

    }
}