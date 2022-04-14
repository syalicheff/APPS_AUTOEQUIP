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
    var tabData = $("#DataTables_Table_6 > tbody > tr").map(function(i, row) {
        const data = $('td', row);
        return {
            "DATE":data.eq(0).text().trim(),
            "CDE ACH":data.eq(1).text().trim() ,
            "CDE VT":data.eq(2).text().trim() ,
            "REFERENCE":data.eq(3).text().trim(),
            "QTE COMMANDE":data.eq(4).text().trim()	,
            "QTE RECUE":data.eq(5).children().val(),	
            "DESIGNATION":data.eq(6).text().trim(),	
            "PAYS":data.eq(7).text().trim()	,
            "MODE EXP":data.eq(8).text().trim()	,
            "CLIENT":data.eq(9).text().trim()	,
            "REMARQUE":data.eq(10).text().trim()	,
            "IMMAT / INFO":data.eq(11).text().trim(),	
            "PRIX UNITAIRE":data.eq(12).text().trim(),	
            "REMISE":data.eq(13).text().trim(),
            "MONTANT HT":data.eq(14).text().trim(),
            "FOURNISSEUR":data.eq(15).text().trim()
        }
      }).get();
    $("#XMC > td").click(function() {
        $("#XMC > td").each(function(){$(this).parent().closest('tr').removeClass('selected')})
        $(this).parent().addClass('selected')
        filters($(this).text().trim());
    })
    

    $('#DataTables_Table_2 > tbody > tr > td').click(function(){
         
        var display = []
        var selected =$(this).text().trim()

        $('#DataTables_Table_2 > tbody > tr').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        $('#DataTables_Table_2 > tbody > tr:not(.selected)').hide()

        for (let i = 0; i < tabData.length; i++) {
            if(tabData[i]["CDE VT"] == $(this).text().trim()){
                display.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        for (let y = 0; y < 6; y++) {
            $('#DataTables_Table_'+y+' > tbody > tr > td').each(function(){
                if(y==0){if(display.find(o => o.FOURNISSEUR == $(this).text().trim())){
                    $(this).parent().addClass('test')
                    $('#DataTables_Table_'+y+' > tbody > tr:not(.test)').hide()
                    }
                }
                if(y==1){if(display.find(o => o["CDE ACHAT"] == $(this).text().trim())){
                    $(this).parent().addClass('test')
                    $('#DataTables_Table_'+y+' > tbody > tr:not(.test)').hide()
                    }
                }
                if(y==3){if(display.find(o => o["REFERENCE"] == $(this).text().trim())){
                    $(this).parent().addClass('test')
                    $('#DataTables_Table_'+y+' > tbody > tr:not(.test)').hide()
                    }
                }
                if(y==4){if(display.filter(o => o["CLIENT"] == $(this).text().trim())){
                    $(this).parent().addClass('test')
                    $('#DataTables_Table_'+y+' > tbody > tr:not(.test)').hide()
                    }
                }
                if(y==5){if(display.find(o => o["PAYS"] == $(this).text().trim())){
                    $(this).parent().addClass('test')
                    $('#DataTables_Table_'+y+' > tbody > tr:not(.test)').hide()
                    }
                }

            })
        }
        console.log(display)
    })

    $('#DataTables_Table_3 > tbody > tr > td').click(function(){
        console.log($(this).text().trim())
    })
    $('#DataTables_Table_4 > tbody > tr > td').click(function(){
        console.log($(this).text().trim())
    })
    $('#DataTables_Table_5 > tbody > tr > td').click(function(){
        console.log($(this).text().trim())
    })
});
function filters(clicked){
    console.log(clicked)
    $("#DataTables_Table_6 > tbody > tr > td:nth-child(2)").each(function(){
        $(this).parent().attr("hidden",true)
        if($(this).text().trim() == clicked){
            $(this).parent().attr("hidden",false)
        }
    })
}

