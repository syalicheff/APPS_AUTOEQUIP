

$(document).ready(function(){
    $('#importFrom').submit(function () {
            console.log("test")
            $('.chargement').show();
    });  
    $("label#fin").get(function(){
        $('.chargement').hide();
    });
    $(document).ready(function () {
        bsCustomFileInput.init()
      })
});

