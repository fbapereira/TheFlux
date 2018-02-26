require('./_func');
// spec.js

describe('Tela de Alunos', function () {

    beforeAll(function (done) {
        var sLogin = 'fba_pereira';
        var sSenha = '#L3v1t1c0s#';

        var txtLogin = element(by.id('txtLogin'));
        var txtPassword = element(by.id('txtPassword'));
        var btn_entrar = element(by.id('btn_entrar'));

        txtLogin.sendKeys(sLogin);
        txtPassword.sendKeys(sSenha);
        btn_entrar.click();
        setTimeout(function () {
            done();
        }, 1000);
    });


    it('Deve ir para pagina de Alunos', function (done) {
        var btn_Alunos = element(by.id('lnkAlunos'));
        btn_Alunos.click();

        setTimeout(function () {
            return browser.getCurrentUrl().then(function (actualUrl) {
                expect(actualUrl).toContain('alunos');
                done();
            });
        }, 2000);
    });

    it('Deve ser possivel adicionar Aluno', function (done) {
        var btn_Alunos = element(by.id('btnLancamento'));
        btn_Alunos.click();

        var nome = element(by.model('aluno.nome'));
        var cpf = element(by.model('aluno.cpf'));
        var email = element(by.model('aluno.email'));

        nome.sendKeys("ALUNO TESTE");
        cpf.sendKeys("222.333.444-05");
        email.sendKeys("teste@hotmail.com");

        var btn_add = element(by.id('btn_entrar'));
        btn_add.click();

        var obj = element(by.xpath("//*[contains(., 'Novo Aluno')]"));
        expect(obj).toBeDefined();

        setTimeout(function () {
            var obj = element(by.xpath("//*[contains(., 'Aluno cadastrado com sucesso')]"));
            expect(obj).toBeDefined();
            done();
        }, 1000);


    });

    it('Deve ser possivel buscar [cpf]', function () {
        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("222.333.444-05");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        expect(cellTexts).toEqual(["222.333.444-05", "ALUNO TESTE", "teste@hotmail.com", 'create', 'payment']);

    });

    it('Deve ser possivel buscar [nome]', function () {
        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("ALUNO TESTE");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        expect(cellTexts).toEqual(["222.333.444-05", "ALUNO TESTE", "teste@hotmail.com", 'create', 'payment']);

    });

    it('Deve ser possivel buscar [email]', function () {
        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("teste@hotmail.com");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        expect(cellTexts).toEqual(["222.333.444-05", "ALUNO TESTE", "teste@hotmail.com", 'create', 'payment']);
    });

    it('Deve ser possivel editar', function (done) {
        var busca = element(by.model('sBusca'));
        busca.clear();
        busca.sendKeys("teste@hotmail.com");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        element(by.id('btn_edit_aluno')).click();

        var obj = element(by.xpath("//*[contains(., 'Editar Aluno')]"));
        expect(obj).toBeDefined();

        var nome = element(by.model('aluno.nome'));
        var cpf = element(by.model('aluno.cpf'));
        var email = element(by.model('aluno.email'));

        nome.clear();
        nome.sendKeys("Alterado");
        cpf.clear();
        cpf.sendKeys("815.516.553-14");
        email.clear();
        email.sendKeys("Alterado@hotmail.com");

        var btn_add = element(by.id('btn_entrar'));
        btn_add.click();

        setTimeout(function () {
            var obj = element(by.xpath("//*[contains(., 'Aluno editado com sucesso.')]"));
            expect(obj).toBeDefined();
            done();
        }, 2000);
    });

    it('Deve ser possivel buscar [email alterado]', function () {
        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("Alterado@hotmail.com");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        expect(cellTexts).toEqual(["815.516.553-14", "Alterado", "Alterado@hotmail.com", 'create', 'payment']);
    });


    it('Deve ser possivel desistir de editar', function () {
        var busca = element(by.model('sBusca'));
        busca.clear();
        busca.sendKeys("Alterado@hotmail.com");


        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        element(by.id('btn_edit_aluno')).click();

        var obj = element(by.xpath("//*[contains(., 'Editar Aluno')]"));
        expect(obj).toBeDefined();

        var nome = element(by.model('aluno.nome'));
        var cpf = element(by.model('aluno.cpf'));
        var email = element(by.model('aluno.email'));

        nome.clear();
        nome.sendKeys("Desitiu");
        cpf.clear();
        cpf.sendKeys("815.516.553-14");
        email.clear();
        email.sendKeys("desistiu@hotmail.com");

        var btn_add = element(by.id('btn_voltar'));
        btn_add.click();

        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("Alterado@hotmail.com");

        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });

        expect(cellTexts).toEqual(["815.516.553-14", "Alterado", "Alterado@hotmail.com", 'create', 'payment']);
    });
});



describe('Mensalidade', function () {

    beforeAll(function (done) {
        var nome = element(by.model('sBusca'));
        nome.clear();
        nome.sendKeys("Alterado@hotmail.com");

        var row = element.all(by.repeater('aluno in alunosFiltered')).first();
        var cells = row.all(by.tagName('td'));

        var cellTexts = cells.map(function (elm) {
            return elm.getText();
        });


        element(by.id('btn_more_aluno')).click();

        setTimeout(function () {
            done();
        }, 2000);
    });

    it('Deve ter os dados do usuário', function () {
        var cpf = element(by.model('aluno.cpf'));
        var nome = element(by.model('aluno.nome'));
        var email = element(by.model('aluno.email'));

        expect(cpf.getText()).toBe('815.516.553-14');
        expect(nome.getText()).toBe('Alterado');
        expect(email.getText()).toBe('Alterado@hotmail.com');

    });

    it('Nehuma mensalidade deve ser encontrada', function () {
        var obj = element(by.xpath("//*[contains(., 'Nenhuma mensalidade foi encontrada')]"));
        expect(obj).toBeDefined();
    });

    it('Deve ser possivel desistir de cadastrar uma nova mensalidade', function () {
    });

    it('Deve ser possivel cadastrar uma nova mensalidade', function () {
    });

    it('Deve haver mensalidade atrasadas', function () {
    });

    it('Deve ser possivel cancelar mensalidade ', function () {
    });

    it('Deve ser possivel pagars mensalidade ', function () {
    });

});
