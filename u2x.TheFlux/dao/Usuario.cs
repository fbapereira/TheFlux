using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class Usuario : tf_usuario
    {
        public new Int32 id;
        public new String login;
        public new String senha;
        public new Boolean isAdmin;

        private u2xMainEntities1 db = new u2xMainEntities1();

        public bool Add(String login, String senha, Boolean isAdmin, Int32 idInstituicao)
        {
            List<tf_usuario> lstUsuario;

            lstUsuario = db.tf_usuario.Where(usu => (usu.login == login)).ToList<tf_usuario>();
            if (lstUsuario != null && lstUsuario.Count > 0)
            {
                throw new Exception("U2X_MessageJá existe um usuário com esse login");
            }

            tf_usuario temp = new tf_usuario()
            {
                isAdmin = isAdmin,
                login = login,
                senha = senha,
                id_instituicao = idInstituicao
            };
            db.tf_usuario.Add(temp);
            db.SaveChanges();
            return true;
        }

        public Usuario Get(String login, String senha)
        {

            tf_usuario temp = db.tf_usuario.Where(usuario =>
                usuario.login == login &&
                usuario.senha == senha).FirstOrDefault();

            if (temp == null) { return null; }

            return ToUsuario(temp);
        }

        public Usuario Get(String login)
        {

            tf_usuario temp = db.tf_usuario.Where(usuario =>
                usuario.login == login).FirstOrDefault();

            if (temp == null) { return null; }

            return ToUsuario(temp);
        }

        public List<Usuario> GetAll(Int32 idInstituicao)
        {
            List<tf_usuario> temp = db.tf_usuario.Where(usuario => usuario.id_instituicao == idInstituicao).ToList<tf_usuario>();

            List<Usuario> lstUs = new List<Usuario>();
            temp.ForEach((x) =>
            {
                lstUs.Add(ToUsuario(x));
            });

            return lstUs;
        }

        public void Update(Int32 id, String senha, Boolean isAdmin, Int32 idInstituicao)
        {
            tf_usuario temp = (tf_usuario)db.tf_usuario.Where(usuario => usuario.id == id).FirstOrDefault();
            temp.senha = senha;
            temp.isAdmin = isAdmin;
            temp.id_instituicao = idInstituicao;
            db.SaveChanges();
        }

        private Usuario ToUsuario(tf_usuario obj)
        {
            return new Usuario()
            {
                id = obj.id,
                login = obj.login,
                senha = obj.senha,
                id_instituicao = obj.id_instituicao,
                isAdmin = (bool)obj.isAdmin,
            };
        }
    }
}