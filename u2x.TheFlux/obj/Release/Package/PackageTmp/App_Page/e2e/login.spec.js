// spec.js

describe('Tela de Login', function () {
    var sLogin = 'fba_pereira';
    var sSenha = '#L3v1t1c0s#';

    var login = element(by.model('login'));
    var senha = element(by.model('senha'));


    var Menu_Rapido = element(by.id('Menu_Rapido'));

    beforeEach(function () {
        browser.get('http://localhost:64010/App_Page/index.html#!/login');
    });

    it('Deve ser possivel logar', function (done) {
        var txtLogin = element(by.id('txtLogin'));
        var txtPassword = element(by.id('txtPassword'));
        var btn_entrar = element(by.id('btn_entrar'));

        txtLogin.sendKeys(sLogin);
        txtPassword.sendKeys(sSenha);
        btn_entrar.click();

        setTimeout(function () {

            return browser.getCurrentUrl().then(function (actualUrl) {
                expect(actualUrl).toContain('dashboard');
                done();
            });

        }, 5000);
    });

    it('Deve ser possivel sair ', function (done) {
        setTimeout(function () {
            var btnSair = element(by.id('btnSair'));

            btnSair.click();

            return browser.getCurrentUrl().then(function (actualUrl) {
                expect(actualUrl).not.toContain('dashboard');
                done();
            });

        }, 1000);
    });

    it('Deve bloquear senha errada', function (done) {
        var txtLogin = element(by.id('txtLogin'));
        var txtPassword = element(by.id('txtPassword'));
        var btn_entrar = element(by.id('btn_entrar'));

        txtLogin.sendKeys(sLogin);
        txtPassword.sendKeys(sSenha + "XXX");
        btn_entrar.click();
        
        return browser.getCurrentUrl().then(function (actualUrl) {
            expect(actualUrl).not.toContain('dashboard');
            done();
        });
    });
});