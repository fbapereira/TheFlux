// spec.js

describe('Tela de Login', function () {
    var sLogin = 'fba_pereira';
    var sSenha = '#L3v1t1c0s#';

    var login = element(by.model('login'));
    var senha = element(by.model('senha'));

    var txtLogin = element(by.id('txtLogin'));
    var txtPassword = element(by.id('txtPassword'));

    var btn_entrar = element(by.id('btn_entrar'));
    var Menu_Rapido = element(by.id('Menu_Rapido'));



    beforeEach(function () {
        browser.get('http://localhost:64010/App_Page/#!/');
    });

    it('Deve ser possivel logar', function (done) {
        txtLogin.sendKeys(sLogin);
        txtPassword.sendKeys(sSenha);
        btn_entrar.click();
        setTimeout(function () {
            debugger;
            expect(Menu_Rapido.html()).toContain('Menu Rápido');
            done();
        }, 5000);


    });

});