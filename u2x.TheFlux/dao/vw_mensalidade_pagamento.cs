//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace u2x.TheFlux.dao
{
    using System;
    using System.Collections.Generic;
    
    public partial class vw_mensalidade_pagamento
    {
        public int id { get; set; }
        public Nullable<int> id_aluno { get; set; }
        public Nullable<decimal> valor { get; set; }
        public Nullable<int> id_tipo_pagamento { get; set; }
        public Nullable<System.DateTime> dt_pagamento { get; set; }
        public Nullable<int> mes { get; set; }
        public Nullable<int> ano { get; set; }
        public string status { get; set; }
        public string formaPagamento { get; set; }
    }
}
