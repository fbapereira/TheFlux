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
    
    public partial class tf_instituicao
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tf_instituicao()
        {
            this.tf_pagamento = new HashSet<tf_pagamento>();
            this.tf_tipo_pagamento = new HashSet<tf_tipo_pagamento>();
            this.tf_usuario = new HashSet<tf_usuario>();
            this.tf_aluno = new HashSet<tf_aluno>();
        }
    
        public int id { get; set; }
        public string nome { get; set; }
        public string email { get; set; }
        public string telefone { get; set; }
        public string documento { get; set; }
        public Nullable<int> idTipo { get; set; }
        public string token { get; set; }
        public string token_dev { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_pagamento> tf_pagamento { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_tipo_pagamento> tf_tipo_pagamento { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_usuario> tf_usuario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_aluno> tf_aluno { get; set; }
    }
}
