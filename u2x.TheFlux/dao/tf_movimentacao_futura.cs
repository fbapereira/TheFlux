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
    
    public partial class tf_movimentacao_futura
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tf_movimentacao_futura()
        {
            this.tf_parcela_futura = new HashSet<tf_parcela_futura>();
        }
    
        public int id { get; set; }
        public string nome { get; set; }
        public Nullable<int> id_tipo_movimentacao { get; set; }
        public Nullable<decimal> valor_base { get; set; }
        public Nullable<int> id_usuario { get; set; }
        public Nullable<bool> is_entrada { get; set; }
        public Nullable<int> id_tipo_pagamento { get; set; }
    
        public virtual tf_movimentacao tf_movimentacao { get; set; }
        public virtual tf_movimentacao tf_movimentacao1 { get; set; }
        public virtual tf_movimentacao tf_movimentacao2 { get; set; }
        public virtual tf_tipo_pagamento tf_tipo_pagamento { get; set; }
        public virtual tf_usuario tf_usuario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_parcela_futura> tf_parcela_futura { get; set; }
        public virtual tf_tipo_movimentacao tf_tipo_movimentacao { get; set; }
    }
}
