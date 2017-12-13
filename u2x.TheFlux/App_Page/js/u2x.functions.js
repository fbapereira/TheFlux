function U2X_ConfiguraInterface() {
    U2X_ConfigModal();
    $('.button-collapse').sideNav();
    $('select').material_select();
    $('.collapsible').collapsible();
}

function U2X_AbreLoader() {
    $('#modalLoader').modal('open');
}

function U2X_FechaLoader() {
    $('#modalLoader').modal('close');
}

function U2X_ConfigModal() {
    $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .8, // Opacity of modal background
    });
}
function U2X_TrataErro(error) {
    console.log(error);
    Materialize.toast('Não foi possível realizar a operação', 4000);
    return;
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