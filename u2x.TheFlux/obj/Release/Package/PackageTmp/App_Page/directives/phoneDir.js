app.directive("phoneDir",
    function () {
        return {
            link: function (scope, element, attrs) {
                var options = {
                    onKeyPress: function (val, e, field, options) {
                        putMask();
                    }
                }
                $(element).mask('(00) 00000-0000', options);
                function putMask() {
                    var mask;
                    var cleanVal = element[0].value.replace(/\D/g, '');//pega o valor sem mascara
                    if (cleanVal.length > 10) {//verifica a quantidade de digitos.
                        mask = "(00) 00000-0000";
                    } else {
                        mask = "(00) 0000-00009";
                    }
                    $(element).mask(mask, options);//aplica a mascara novamente
                }
            }
        }
    });

app.directive("docDir",
    function () {
        return {
            link: function (scope, element, attrs) {
                var options = {
                    onKeyPress: function (cpf, ev, el, op) {
                        if (cpf.length > 12) console.log(cpf.length);
                        var masks = ['000.000.000-000', '00.000.000/0000-00'],
                            mask = (cpf.length > 14) ? masks[1] : masks[0];
                        el.mask(mask, op);
                    }
                }
                $(element).mask('000.000.000-000', options);

            }
        }
    });

app.directive("moneyDir",
    function () {
        return {
            link: function (scope, element, attrs) {
                var options = {
                    onKeyPress: function (value, ev, el, op) {
                        if (value.length > 1) {
                            if (value.charAt(0) == "0") {
                                value = value.substring(1, value.length);
                                $(element).val(value);
                            }
                        }
                    },
                    reverse: true
                };
                $(element).mask("#.##0,00", options);
            }
        }
    }
);