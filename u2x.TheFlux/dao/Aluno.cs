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
            tf_aluno aluno = new tf_aluno()
            {
                nome = nome,
                cpf = cpf,
                email = email,
                id_instituicao = id_instituicao

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
                email = obj.email,
            };
        }
    }
}