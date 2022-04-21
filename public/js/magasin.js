$(document).ready(function() {
    baseDOM()
    $('table.display').DataTable({
        "scrollY":        "400px",
        "scrollCollapse": true,
        "paging":         false,
        "bInfo" : false,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json'
        }
    });
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
        $('#DataTables_Table_6 > tbody > tr:visible > td > input[type=number]').val("0");
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
    $('#DataTables_Table_0 > tbody > tr > td').click(function(){
       
        var display_0 = []
        var selected =$(this).text().trim()

        $('input[type=checkbox]').show()

        $(this).parent().closest('tr').addClass('selected')
        $('#DataTables_Table_0 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["FOURNISSEUR"] == $(this).text().trim()){
                display_0.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        display_0.forEach(o=>{
            $('table.ligne > tbody > tr > td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showFourn')
                    }
                })
            })
        })
        $('table.ligne > tbody > tr:not(.showFourn)').hide()
    })
    $("#DataTables_Table_1 > tbody > tr > td").click(function(event) {
        if ($(event.target).is('input[type=checkbox]')) {
            if (!$(this).children('input[type=checkbox]').is(":checked")){
                filters($(this).children('label').text().trim(),'XMC',false)
            }
            else{
                filters($(this).children('label').text().trim(),'XMC',true);
            }
            return
        }
        var display_1 = []
        $('#DataTables_Table_1 > tbody > tr > td').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        //$('#DataTables_Table_1 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["CDE ACH"] == $(this).children('label').text().trim()){
                display_1.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        display_1.forEach(o=>{
            $('table.ligne > tbody > tr > td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showXMC')
                    }
                })
            })
        })
        $('table.ligne > tbody > tr:not(.showXMC)').hide()
    })
    $('#DataTables_Table_2 > tbody > tr > td').click(function(event){
        if ($(event.target).is('input[type=checkbox]')) {
            if (!$(this).children('input[type=checkbox]').is(":checked")){
                filters($(this).children('label').text().trim(),'DOC CLIENT',false)

            }
            else{
                filters($(this).children('label').text().trim(),'DOC CLIENT',true);

            }
            return
        }
        var display_2 = []

        $('#DataTables_Table_2 > tbody > tr > td').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        //$('#DataTables_Table_1 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["CDE VT"] == $(this).children('label').text().trim()){
                display_2.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        display_2.forEach(o=>{
            $('table.ligne > tbody > tr > td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showDOCVT')
                    }
                })
            })
        })
        $('table.ligne > tbody > tr:not(.showDOCVT)').hide()


        
        //
    })
    $('#DataTables_Table_3 > tbody > tr > td').click(function(){
         
        var display_3 = []
        var selected =$(this).text().trim()

        $('#DataTables_Table_3 > tbody > tr').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        $('#DataTables_Table_3 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["REFERENCE"] == $(this).text().trim()){
                display_3.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        display_3.forEach(o=>{
            $('table.ligne > tbody > tr > td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showRef')
                    }
                })
            })
        })
        $('table.ligne > tbody > tr:not(.showRef)').hide()
    })
    $('#DataTables_Table_4 > tbody > tr > td').click(function(){
         
        var display_4 = []
        var selected =$(this).text().trim()

        $('#DataTables_Table_4 > tbody > tr').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        $('#DataTables_Table_4 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["CLIENT"] == $(this).text().trim()){
                display_4.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }

        display_4.forEach(o=>{
            $('table.ligne > tbody > tr> td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showClient')
                    }
            })
        })
        })
        $('table.ligne > tbody > tr:not(.showClient)').hide()

    })
    $('#DataTables_Table_5 > tbody > tr > td').click(function(){
         
        var display_5 = []
        var selected =$(this).text().trim()

        $('#DataTables_Table_5 > tbody > tr').each(function(){
            $(this).removeClass('selected')
        })  
        $(this).parent().closest('tr').addClass('selected')
        $('#DataTables_Table_5 > tbody >  tr:not(.selected)').hide()
        for (let i = 0; i < tabData.length; i++){
            if(tabData[i]["PAYS"] == $(this).text().trim()){
                display_5.push({
                    FOURNISSEUR:tabData[i]["FOURNISSEUR"],
                    "CDE ACHAT":tabData[i]["CDE ACH"],
                    "CDE VT":tabData[i]["CDE VT"],
                    "REFERENCE":tabData[i]["REFERENCE"],
                    "CLIENT":tabData[i]["CLIENT"],
                    "PAYS":tabData[i]["PAYS"]
                })
            }           
        }
        display_5.forEach(o=>{
            $('table.ligne > tbody > tr > td').each(function(){
                Object.keys(o).forEach(key=>{
                    if(o[key].trim() == $(this).text().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim()){
                        $(this).parent().closest('tr').addClass('showPays')
                    }
                })
            })
        })
        $('table.ligne > tbody > tr:not(.showPays)').hide()
    })
    $('#filters_buttons > div.buttons > button:nth-child(1)').click(function(){
        $('table.ligne > tbody > tr').each(function(){
            $(this).removeClass().show()

        })
        $('input[type=checkbox]').hide()

    })
    $('#Transfo').click(function(){
        
        var postedData = $("#DataTables_Table_6 > tbody > tr:visible").map(function(i, row) {
            const data = $('td', row);
            return {
                "CDE ACH":data.eq(1).text().trim() ,
                "CDE VT":data.eq(2).text().trim() ,
                "FOURNISSEUR":data.eq(15).text().trim()
            }
          }).get();
          if(typeof postedData[0] !=="undefined"){
            $('#modalTransform').addClass('show').removeAttr('aria-hidden').attr({
                'aria-modal':'true',
                'style':'display: block'
            });
            $.when(getFactType(postedData[0].FOURNISSEUR)).done(function(modeFacturation){
                modeFacturation = modeFacturation[0].MODE_FACTURATION
                if(modeFacturation == 'FACTURE'){
                    $('#radio_FACTURE').prop("checked", true);
                }
                else if (modeFacturation == 'BL'){
                    $('#radio_BL').prop("checked", true)
                }
            });
          }
          else{
           
            alert('Aucune ligne a transformer ! ')
            //$('#modalTransform').hide()
           
          }
    });
    $('#modalTransform > div > div > div.modal-footer > button.btn.btn-primary').click(function(){
        $('#DataTables_Table_6 > tbody > tr:visible').each(function(){
           console.log($(this).children('td:nth-child(-n+3)').text().trim())
        })
    });
    $('#modalTransform > div > div > div.modal-footer > button.btn.btn-secondary').click(function(){
        $('#modalTransform').hide() 
    });
    $('.headerButtons > button').click(function(){
        $('.headerButtons > button').removeClass('headerButtonSelected')
        $(this).addClass('headerButtonSelected')

        if($(this).attr('id') == 'cmd'){
            $('div#Commandes').show()
            $('div#Etiquettes').hide()
            $('button#resetQTE').show()

        }
        else if ($(this).attr('id') == 'etq'){
            $('div#Commandes').hide()
            $('div#Etiquettes').show()
            $('button#resetQTE').hide()
        }
    })
})
    function filters(clicked,type,show){
        if(type == 'XMC'){
            $("#DataTables_Table_6 > tbody > tr > td:nth-child(2)").each(function(){
                //$(this).parent().attr("hidden",true)
                if($(this).text().trim() == clicked && show==true){
                    $(this).parent().attr("hidden",false)
                }
                else if($(this).text().trim() == clicked && show!==true) {$(this).parent().attr("hidden",true)}
            })
        }
        else if(type == 'DOC CLIENT'){
            $("#DataTables_Table_6 > tbody > tr > td:nth-child(3)").each(function(){
                //$(this).parent().attr("hidden",true)
                if($(this).text().trim() == clicked && show==true){
                    $(this).parent().attr("hidden",false)
                }
                else if($(this).text().trim() == clicked && show!==true) {$(this).parent().attr("hidden",true)}
            })
        }
    }
    function getFactType(fournisseur) {
        return $.ajax({
            url:"/magasin ",
            type:"POST",
            data:{
                Fournisseur : fournisseur,
            }
        })
    };
    function baseDOM() {
        $('div#Commandes').show()
        $('div#Etiquettes').hide()
    }