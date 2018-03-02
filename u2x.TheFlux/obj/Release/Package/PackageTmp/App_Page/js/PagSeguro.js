function CheckOut(email, token, senderName, senderEmail, produtos) {

    var url = 'https://ws.pagseguro.uol.com.br/v2/checkout' +
        '?email=' + email +
        '&token=' + token +
        '&currency=BRL';

    var index = 1;
    produtos.forEach((produto) => {
        url = url +
            '&itemId' + index + '=0001' +
            '&itemDescription' + index + '=' + produto.nome +
            '&itemAmount' + index + '=' + produto.valor +
            '&itemQuantity' + index + '=1' +
            '&itemWeight' + index + '=1000';
        index = index + 1;
    });

    url = url +
        '&reference=REF1234' +
        '&senderName=' + senderName +
        '&senderEmail=' + senderEmail;
    console.log(url);
    $http({
        method: 'POST',
        url: url,
        data: {}
    }).then(function sucess(response) {
        PagSeguroLightbox();
    });
}
//3D5977E186B347D9A6A08DD90EA0F842
//https://ws.sandbox.pagseguro.uol.com.br/v2/checkout/email=fba_pereira&token=3D5977E186B347D9A6A08DD90EA0F842&currency=BRL&itemId1=0001&itemDescription1=Produto_PagSeguroI&itemAmount1=99999.99&itemQuantity1=1&itemWeight1=1000&itemId2=0002&itemDescription2=Produto-PagSeguroII&itemAmount2=99999.98&itemQuantity2=2&itemWeight2=750&reference=REF1234&senderName=Jose_Comprador&senderAreaCode=99&senderPhone=99999999&senderEmail=comprador@uol.com.br&shippingType=1&shippingAddressStreet=Av.PagSeguro&shippingAddressNumber=9999&shippingAddressComplement=99oandar&shippingAddressDistrict=JardimInternet&shippingAddressPostalCode=99999999&shippingAddressCity=CidadeExemplo&shippingAddressState=SP&shippingAddressCountry=ATA
