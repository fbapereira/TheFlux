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
    
    public partial class tf_tesouro
    {
        public int id { get; set; }
        public string titulo { get; set; }
        public Nullable<System.DateTime> vencimento { get; set; }
        public Nullable<decimal> rendimento { get; set; }
        public Nullable<decimal> valorMinimo { get; set; }
        public Nullable<decimal> precoUnitario { get; set; }
        public Nullable<System.DateTime> loggedTime { get; set; }
        public Nullable<int> tipoOperacao { get; set; }
    }
}
