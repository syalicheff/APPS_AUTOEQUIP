$(document).ready(function() {
	// NAVIGATIONS 
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
});