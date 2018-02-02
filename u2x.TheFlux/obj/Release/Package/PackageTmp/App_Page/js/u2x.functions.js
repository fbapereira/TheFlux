function U2X_ConfiguraInterface() {
    U2X_ConfigModal();

    $('.button-collapse').sideNav();
    $('select').material_select();
    $('.collapsible').collapsible();
    $('ul.tabs').tabs();
    $('.button-collapse').sideNav('hide');
    $("body").css("overflow", "")
    $(".dropdown-button").dropdown();

}

function U2X_ValidaLogin(oUsuario) {
    if (!oUsuario) {
        $location.path("/login");
        U2X_FechaLoader();
    }
    return oUsuario;
}

function U2X_AbreLoader() {
    $('#modalLoader').modal('open');
}

function U2X_FechaLoader() {
    $('#modalLoader').modal('close');
}

function U2X_ConfigModal() {
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .8, // Opacity of modal background
        ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            Materialize.updateTextFields();
        }
    });
}
function U2X_TrataErro(error) {
    console.log(error);

    if (!error) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }

    if (!error.data) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }
    if (!error.data.ExceptionMessage) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }

    var msg = error.data.ExceptionMessage;
    if (msg.indexOf("U2X_Message") > -1) {
        Materialize.toast(msg.replace("U2X_Message", ""), 4000);
        return;
    }

    Materialize.toast('Não foi possível realizar a operação', 4000);


}


function U2X_TrataValores(
    valor,
    precision,
    prefix,
    sufix,
    decimalSeparator,
    millionSeparator) {

    try {
        //validate parameter
        if (!valor) valor = 0;
        if (!prefix) prefix = "";
        if (!sufix) sufix = "";
        if (!decimalSeparator) decimalSeparator = ",";
        if (!millionSeparator) millionSeparator = ".";

        //trasnform in string 
        var sValor = valor.toString();

        //split in decimal and int
        var sDecimal = "";
        var sInteger = "";

        sInteger = sValor.split(".")[0];
        if (precision > 0) {
            sDecimal = sValor.split(".")[1];
            if (!sDecimal) sDecimal = "";

            if (sDecimal.length > precision) {
                sDecimal = sDecimal.substring(0, precision);
            }
            while (sDecimal.length < precision) {
                sDecimal = sDecimal + "0";
            }
        }

        //split decimal in tri
        //let tempString: string
        var millionList = []
        while (sInteger.length != 0) {
            if (sInteger.length > 3) {
                millionList.push(sInteger.substring(sInteger.length - 3));
                sInteger = sInteger.substring(0, sInteger.length - 3)
            } else {
                millionList.push(sInteger);
                sInteger = "";
            }
        }
        //concat int with "point"
        millionList = millionList.reverse();
        sInteger = millionList.join(millionSeparator);

        //verify is sInterger 
        if (sInteger.indexOf("-.") > -1) {
            sInteger = sInteger.replace("-.", "-");
        }

        //concat decimal with "comma"
        if (sDecimal.length == 0) {
            sValor = prefix + sInteger + sufix;
        } else {
            sValor = prefix + sInteger + decimalSeparator + sDecimal + sufix;
        }
        return sValor;
    }
    catch (error) {

    }
}

/*
 verifica_cpf_cnpj
 
 Verifica se é CPF ou CNPJ
 
 @see http://www.todoespacoonline.com/w/
*/
function verifica_cpf_cnpj(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Verifica CPF
    if (valor.length === 11) {
        return 'CPF';
    }

    // Verifica CNPJ
    else if (valor.length === 14) {
        return 'CNPJ';
    }

    // Não retorna nada
    else {
        return false;
    }

} // verifica_cpf_cnpj

/*
 calc_digitos_posicoes
 
 Multiplica dígitos vezes posições
 
 @param string digitos Os digitos desejados
 @param string posicoes A posição que vai iniciar a regressão
 @param string soma_digitos A soma das multiplicações entre posições e dígitos
 @return string Os dígitos enviados concatenados com o último dígito
*/
function calc_digitos_posicoes(digitos, posicoes, soma_digitos) {

    if (!posicoes) { posicoes = 10 }
    if (!soma_digitos) { soma_digitos = 0 }

    // Garante que o valor é uma string
    digitos = digitos.toString();

    // Faz a soma dos dígitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for (var i = 0; i < digitos.length; i++) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + (digitos[i] * posicoes);

        // Subtrai 1 da posição
        posicoes--;

        // Parte específica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if (posicoes < 2) {
            // Retorno a posição para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos é menor que 2
    if (soma_digitos < 2) {
        // soma_digitos agora será zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dígito procurado é 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dígito aos primeiro nove dígitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;

} // calc_digitos_posicoes

/*
 Valida CPF
 
 Valida se for CPF
 
 @param  string cpf O CPF com ou sem pontos e traço
 @return bool True para CPF correto - False para CPF incorreto
*/
function valida_cpf(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Captura os 9 primeiros dígitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
    var novo_cpf = calc_digitos_posicoes(digitos);

    // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);

    // Verifica se o novo CPF gerado é idêntico ao CPF enviado
    if (novo_cpf === valor) {
        // CPF válido
        return true;
    } else {
        // CPF inválido
        return false;
    }

} // valida_cpf

/*
 valida_cnpj
 
 Valida se for um CNPJ
 
 @param string cnpj
 @return bool true para CNPJ correto
*/
function valida_cnpj(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 números do CNPJ
    var primeiros_numeros_cnpj = valor.substr(0, 12);

    // Faz o primeiro cálculo
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);

    // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);

    // Concatena o segundo dígito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado é idêntico ao enviado
    if (cnpj === cnpj_original) {
        return true;
    }

    // Retorna falso por padrão
    return false;

} // valida_cnpj

/*
 valida_cpf_cnpj
 
 Valida o CPF ou CNPJ
 
 @access public
 @return bool true para válido, false para inválido
*/
function U2X_ValidaCPFCNPJ(valor) {

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {
        // Retorna true para cpf válido
        return valida_cpf(valor);
    }

    // Valida CNPJ
    else if (valida === 'CNPJ') {
        // Retorna true para CNPJ válido
        return valida_cnpj(valor);
    }

    // Não retorna nada
    else {
        return false;
    }

} // valida_cpf_cnpj

/*
 formata_cpf_cnpj
 
 Formata um CPF ou CNPJ
 
 @access public
 @return string CPF ou CNPJ formatado
*/
function formata_cpf_cnpj(valor) {

    // O valor formatado
    var formatado = false;

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {

        // Verifica se o CPF é válido
        if (valida_cpf(valor)) {

            // Formata o CPF ###.###.###-##
            formatado = valor.substr(0, 3) + '.';
            formatado += valor.substr(3, 3) + '.';
            formatado += valor.substr(6, 3) + '-';
            formatado += valor.substr(9, 2) + '';

        }

    }

    // Valida CNPJ
    else if (valida === 'CNPJ') {

        // Verifica se o CNPJ é válido
        if (valida_cnpj(valor)) {

            // Formata o CNPJ ##.###.###/####-##
            formatado = valor.substr(0, 2) + '.';
            formatado += valor.substr(2, 3) + '.';
            formatado += valor.substr(5, 3) + '/';
            formatado += valor.substr(8, 4) + '-';
            formatado += valor.substr(12, 14) + '';

        }

    }

    // Retorna o valor 
    return formatado;

} // formata_cpf_cnpj

function U2X_ValidateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}