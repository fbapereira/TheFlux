using System;
using System.Collections.Generic;
using System.Linq;
using u2x.TheFlux.dao;

namespace u2x.TheFlux.dao
{
    public class Instituicao : tf_instituicao
    {
        public new Int32 id;
        public new String nome;

        private u2xMainEntities1 db = new u2xMainEntities1();

        public void Add(String nome)
        {
            tf_instituicao instituicao = new tf_instituicao()
            {
                nome = nome
            };
            db.tf_instituicao.Add(instituicao);
            db.SaveChanges();

        }

        public Instituicao GetByUser(Int32 idUsuario)
        {
            List<tf_usuario> lstUsuario;
            lstUsuario = db.tf_usuario.Where(usuario => (usuario.id == idUsuario)).ToList<tf_usuario>();
            if (lstUsuario.Count == 0) { return null; }

            Int32 id = lstUsuario[0].id_instituicao;
            List<tf_instituicao> lstInstituicao;
            lstInstituicao = db.tf_instituicao.Where(instituicao => (instituicao.id == id)).ToList<tf_instituicao>();
            if (lstInstituicao.Count == 0) { return null; }

            return ToInstituicao(lstInstituicao[0]);
        }

        private Instituicao ToInstituicao(tf_instituicao obj)
        {
            return new Instituicao()
            {
                id = obj.id,
                nome = obj.nome,
            };
        }
    }
}