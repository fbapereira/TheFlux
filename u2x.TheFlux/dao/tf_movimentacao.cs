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
    
    public partial class tf_movimentacao
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tf_movimentacao()
        {
            this.tf_movimentacao_futura = new HashSet<tf_movimentacao_futura>();
            this.tf_movimentacao_futura1 = new HashSet<tf_movimentacao_futura>();
            this.tf_movimentacao_futura2 = new HashSet<tf_movimentacao_futura>();
        }
    
        public int id { get; set; }
        public int id_usuario { get; set; }
        public int id_tipo_movimentacao { get; set; }
        public int is_entrada { get; set; }
        public string descricao { get; set; }
        public double valor { get; set; }
        public System.DateTime data { get; set; }
        public Nullable<int> id_tipo_pagamento { get; set; }
        public Nullable<bool> is_canceled { get; set; }
        public Nullable<int> id_parcela_futura { get; set; }
    
        public virtual tf_parcela_futura tf_parcela_futura { get; set; }
        public virtual tf_tipo_movimentacao tf_tipo_movimentacao { get; set; }
        public virtual tf_tipo_pagamento tf_tipo_pagamento { get; set; }
        public virtual tf_usuario tf_usuario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_movimentacao_futura> tf_movimentacao_futura { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_movimentacao_futura> tf_movimentacao_futura1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_movimentacao_futura> tf_movimentacao_futura2 { get; set; }
    }
}
