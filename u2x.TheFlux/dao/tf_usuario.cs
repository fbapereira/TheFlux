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
    
    public partial class tf_usuario
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tf_usuario()
        {
            this.tf_aluno = new HashSet<tf_aluno>();
            this.tf_estrelas = new HashSet<tf_estrelas>();
            this.tf_movimentacao = new HashSet<tf_movimentacao>();
            this.tf_movimentacao_futura = new HashSet<tf_movimentacao_futura>();
        }
    
        public int id { get; set; }
        public int id_instituicao { get; set; }
        public string login { get; set; }
        public string senha { get; set; }
        public Nullable<bool> isAdmin { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_aluno> tf_aluno { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_estrelas> tf_estrelas { get; set; }
        public virtual tf_instituicao tf_instituicao { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_movimentacao> tf_movimentacao { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tf_movimentacao_futura> tf_movimentacao_futura { get; set; }
    }
}
