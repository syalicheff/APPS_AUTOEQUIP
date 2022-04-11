$(document).ready(function() {
    $('table.display').DataTable( {
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
} );

