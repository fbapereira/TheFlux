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
    
    public partial class tf_pagamento
    {
        public int id { get; set; }
        public int id_instituicao { get; set; }
        public int ano { get; set; }
        public int mes { get; set; }
        public bool is_pago { get; set; }
    
        public virtual tf_instituicao tf_instituicao { get; set; }
    }
}
