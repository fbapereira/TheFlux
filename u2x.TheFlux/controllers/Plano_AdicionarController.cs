using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.controllers
{
    public class Plano_AdicionarController : ApiController
    {
        [HttpPost]
        public bool Post([FromBody]dynamic value)
        {
            try
            {
                DateTime dtInicial = Convert.ToDateTime(value.data);
                Int32 mes = dtInicial.Month;
                Int32 ano = dtInicial.Year;
                Int32 parcelas = (int)value.parcelas;

                for (int i = 0; i < parcelas; i++)
                {
                    new Mensalidade().Criar((int)value.id_aluno, ano, mes, ((decimal)value.valor) / 100);
                    mes = mes + 1;
                    if (mes > 12)
                    {
                        mes = 1;
                        ano = ano + 1;
                    }
                    // parcelas = parcelas - 1;
                }

                return true;
            }
            catch (Exception e)
            {
                ErroHandler.Log("Plano_AdicionarController", e, "POST", "");
                throw e;
            }
        }
    }
}
