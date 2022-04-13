$(document).ready(function() {
    $('table.display').DataTable({
        "scrollY":        "400px",
        "scrollCollapse": true,
        "paging":         false,
        "bInfo" : false,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json'
        }
    } );
    $('table.display_Data').DataTable({
        "scrollY":        "400px",
        "scrollCollapse": true,
        "paging":         false,
        "bInfo" :         false,
        "bFilter":        false,
        "ordering":       false,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json'
        }
    });
    $('button#resetQTE').click(function() {
        $('td.number > input[type=number]').val("0");
    });
    $("#XMC > td").click(function() {
        $("#XMC > td").each(function(){$(this).parents().removeClass('selected')})
        $(this).parents().addClass('selected')
        filters($(this).text().trim());
    })
    function filters(clicked){
        console.log(clicked)
        $("#DataTables_Table_6 > tbody > tr > td:nth-child(2)").each(function(){
            $(this).parent().attr("hidden",true)
            if($(this).text().trim() == clicked){
                $(this).parent().attr("hidden",false)
            }
        })
    }
});

