$(document).ready(function(){
    $('#importFrom').submit(function () {
            $('.chargement').show();
    });  
    $("label#fin").get(function(){
        $('.chargement').hide();
        $('#Termine').show();
    });
});

