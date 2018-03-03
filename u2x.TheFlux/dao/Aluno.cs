using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace u2x.TheFlux.dao
{
    public class Aluno : tf_aluno
    {

        private u2xMainEntities1 db = new u2xMainEntities1();

        public Int32 Criar(string nome, string cpf, string email, int id_instituicao)
        {

            string senha = cpf.Replace(".", "").Substring(0, 5);
            Int32 idUsuario = new Usuario().Add(email, senha, false, id_instituicao);

            tf_aluno aluno = new tf_aluno()
            {
                nome = nome,
                cpf = cpf,
                email = email,
                id_instituicao = id_instituicao,
                id_usuario = idUsuario

            };

            db.tf_aluno.Add(aluno);
            db.SaveChanges();
            return aluno.id;
        }



        public List<tf_aluno> Obtem(int id_instituicao)
        {
            return (from item in db.tf_aluno
                    where item.id_instituicao == id_instituicao
                    select item)
                    .OrderByDescending(x => x.nome)
            .ToList();

        }

        public tf_aluno ObtemUnicoPorUsuario(int id_usuario)
        {
            return (from item in db.tf_aluno
                    where item.id_usuario == id_usuario
                    select item)
                    .OrderByDescending(x => x.nome)
            .ToList()[0];

        }

        public tf_aluno ObtemUnico(int id_Aluno)
        {
            return (from item in db.tf_aluno
                    where item.id == id_Aluno
                    select item)
                    .OrderByDescending(x => x.nome)
            .ToList()[0];

        }


        public tf_aluno Editar(tf_aluno aluno)
        {


            List<tf_aluno> lst = db.tf_aluno.Where(x => (x.id == aluno.id)).ToList<tf_aluno>();

            if (lst.Count == 0) { return null; }

            lst[0].nome = aluno.nome;
            lst[0].cpf = aluno.cpf;
            lst[0].email = aluno.email;

            db.SaveChanges();

            return lst[0];
        }


        public Aluno ToAluno(tf_aluno obj)
        {
            return new Aluno()
            {
                id = obj.id,
                nome = obj.nome,
                cpf = obj.cpf,
                id_usuario = obj.id_usuario,
                id_instituicao = obj.id_instituicao,

                email = obj.email,
            };
        }
    }
}