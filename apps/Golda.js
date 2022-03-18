var XLSX = require("XLSX")
module.exports.AutoStoreImportSGDB = async function(file){
    console.log("OUVERTURE DU FICHIER : " + file.replace(/^.*[\\\/]/, ''))
    //FONCTION DE RECHERCHE DE REF
    //On créer un objet XLSX
    //On lis notre fichier excel
    var wb = XLSX.readFile(file);
    const wb2 = XLSX.readFile('Q:/EXPLOITATION/ORLY/SUPPORT/SITE WEB/PARAMETRAGE SITE/TECCOM/MARQUE TECCOM POUR IMPORT ARTICLE PAR FRS.xlsx');
    // On récupère le nom de la feuille Excel
    const sheetName = wb.SheetNames[0];
    const sheetName2 = wb2.SheetNames[1];
    //console.log(sheetName)
    
    // On récupère de toute les informations de la feuille choisis
    var ws = wb.Sheets[sheetName];
    const ws2 = wb2.Sheets[sheetName2];
    
    
    //On rend nos données plus lisible (JSON) 
    var json = XLSX.utils.sheet_to_json(ws);
    var tabTeccom = XLSX.utils.sheet_to_json(ws2);
     
    
    //On lis chaque ligne en cherchant notre référence
    //Si SGBD
    var compteurModif=0
    var tabDelete = []
    var compteurBlanc=0
    var tabFinal=[]
    json.splice(0,2)
    console.log("TRAITEMENT DU FICHIER")
    for (var y = 0; y < tabTeccom.length; y++) {
         //console.log(tabTeccom[y]["Marque pour import article sur site"])
        if (tabTeccom[y]["Marque pour import article sur site"] == "A SUPPRIMER"){
             tabDelete[y]=tabTeccom[y]["Code Marque fichier FRS"]
         }
     }
     for (var i = 0; i < json.length; i++) {
         //Supression des colones innutiles
        if(json[i].Section.includes("ENT") || json[i].Section.includes("FAM")){
            json.splice(i,1)
        }
        delete json[i].Section
        delete json[i].N_Ligne_Tarif
        delete json[i].Code_EAN
        delete json[i].Art_substitution
        delete json[i].Art_remplaceQte_mini
        delete json[i].Udm_qte_mini
        delete json[i].Qte_cond
        delete json[i].Udm_qte_cond
        delete json[i].Base_ppc
        delete json[i].Base_prix_euro
        delete json[i].Type_prix
        delete json[i].Poids
        delete json[i].Udm_poids
        delete json[i].Code_remise
        delete json[i].Code_sousfamille_NU
        delete json[i].Montant_consigne
        delete json[i].Code_classe_consigne
        delete json[i].Reference_consigne
        delete json[i].Ref_complementaire
        delete json[i].Code_metier	
        delete json[i].Prix2
        delete json[i].Qte2
        delete json[i].Prix3
        delete json[i].Qte3
        delete json[i].Prix4
        delete json[i].Qte4
        delete json[i].Prix5
        delete json[i].Qte5
        delete json[i].Prix6
        delete json[i].Qte6	
        delete json[i].Prix7	
        delete json[i].Qte7	
        delete json[i].Art_remplacement	
        delete json[i].Qte_multiple	
        delete json[i].Codes_constructeurs		
        delete json[i].ValeurHT_DEEE	
        delete json[i].Code_DEEE	
        delete json[i].Coefficient_TICPE	
        delete json[i].Mention_Coeff_TICPE	
        delete json[i].Valeur_TICPE	
        delete json[i].Coeff_TGAP	
        delete json[i].Mention_Coeff_TGAP	
        delete json[i].Valeur_TGAP	
        delete json[i].Udm_prix2x_qte2x	
        delete json[i].Description_courte	
        delete json[i].Qte_contenant	
        delete json[i].Udm_qte_contenant	
        delete json[i].Hauteur	
        delete json[i].Longueur	
        delete json[i].Largeur	
        delete json[i].Udm_dimensions	
        delete json[i].Classe_ADR	
        delete json[i].Code_ONU	
        delete json[i].Grp_emballage	
        delete json[i].Symbol_danger	
        delete json[i].Point_eclair	
        delete json[i].Description_ADR	
        delete json[i].Statut	
        delete json[i].Description_complementaire	
        delete json[i].Date_application	
        delete json[i].Code_famille_NU	
        delete json[i].Prefixe_tarif	
        delete json[i].Date_fin_validite	
        delete json[i].Num_jour_creation	
        delete json[i].Ref_TecDoc	
        delete json[i].Volume	
        delete json[i].Udm_volume	
        delete json[i].Code_pays	
        delete json[i].GTIN_14
        delete json[i].Code_EAN_1	
        delete json[i].Code_EAN_2	
        delete json[i].Code_EAN_3	
        delete json[i].Code_EAN_4	
        delete json[i].Valeur_DDS	
        delete json[i].DLC	
        delete json[i].DLU	
        delete json[i].Code_douane	
        delete json[i].Code_famille_fournisseur
        delete json[i].Qte_mini
        // SI l'index courrant appartient a tabDelete
    
        var tabCle = Object.keys(json[i])
            if (tabCle.indexOf("Code_marque")==-1 ){
                json[i]["Code_marque"]="#NA"
            }
            if(tabCle.indexOf("Prix_ppc")==-1 || json[i]["Prix_ppc"] == 0  ){
                json[i]["Prix_ppc"]=json[i]["Prix_euro"]*1.5
            }
            if (tabCle.indexOf("Prix_euro")==-1){
                json[i]["Prix_euro"]="#NA"
            }
            if (tabDelete.indexOf(json[i]["Code_marque"])!=-1){
                json.splice(i,5);
                i=i-1
                continue
                compteurModif+=1
            }
    
        json[i]["Code_marque"].trim()
        //On modifie certain CODES MARQUE
    
        if (json[i]["Code_marque"]=="ALP"){json[i]["Code_marque"]="SPILU"}
        if (json[i]["Code_marque"]=="AP"){json[i]["Code_marque"]="DELPHI"}
        if (json[i]["Code_marque"]=="CTG"){json[i]["Code_marque"]="VDO"}
        if (json[i]["Code_marque"]=="DO"){json[i]["Code_marque"]="DAYCO"}
        if (json[i]["Code_marque"]=="EL"){json[i]["Code_marque"]="EFI AUTOMOTIVE"}
        if (json[i]["Code_marque"]=="FEBI"){
            if(json[i]["Ref_fournisseur"].charAt(0)=="A"){json[i]["Code_marque"]="BLUE PRINT"}
                else json[i]["Code_marque"]="FEBI BILSTEIN"
            }
        if (json[i]["Code_marque"]=="FED"){json[i]["Code_marque"]="FERODO"}
        if (json[i]["Code_marque"]=="FER"){json[i]["Code_marque"]="FERRON"}
        if (json[i]["Code_marque"]=="FG"){json[i]["Code_marque"]="DEPA"}
        if (json[i]["Code_marque"]=="FLR"){json[i]["Code_marque"]="FLENNOR"}
        if (json[i]["Code_marque"]=="INR"){json[i]["Code_marque"]="INTFRADIS"}
        if (json[i]["Code_marque"]=="KSM"){json[i]["Code_marque"]="PIERBURG"}
        if (json[i]["Code_marque"]=="LT"){json[i]["Code_marque"]="MECAFILTER"}
        if (json[i]["Code_marque"]=="MAG"){json[i]["Code_marque"]="MAGNETI MARELLI"}
        if (json[i]["Code_marque"]=="MANN"){json[i]["Code_marque"]="MANN-FILTER"}
        if (json[i]["Code_marque"]=="SAL"){json[i]["Code_marque"]="Saleri SIL"}
        if (json[i]["Code_marque"]=="SAS"){json[i]["Code_marque"]="SASIC"}
        if (json[i]["Code_marque"]=="TEN"){json[i]["Code_marque"]="MONROE"}
        if (json[i]["Code_marque"]=="ZFT"){json[i]["Code_marque"]="SACHS"}
        if (json[i]["Code_marque"]=="ATE"){
            if (json[i]["Ref_fournisseur"].charAt(0)=="G") {
                json[i]["Code_marque"]="GALFER"
            }
            if (json[i]["Ref_fournisseur"].charAt(0)=="B") {
                json[i]["Code_marque"]="BARUM"
            }
        }
        tabFinal[i]= json[i]
    }
    let debut = new Date()
    var date = padTo2Digits(debut.getDate()) + "." + padTo2Digits(debut.getMonth()+1) + "."+debut.getFullYear()

    console.log("SAUVEGARDE DU FICHIER")
    tabFinal.filter(function(val){return val});
    ws = XLSX.utils.json_to_sheet(tabFinal);
    wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');
    XLSX.writeFile(wb,'Q:/EXPLOITATION/ORLY/SUPPORT/SITE WEB/PARAMETRAGE SITE/GOLDA (TARIF)/TARIF FOURNISSEUR/2022/STE GEN/IMPORT SGDB '+date+'.xlsx');
    return "Done"
}
module.exports.AutoStoreImportBLOIS = async function(file){
try{
    console.log("OUVERTURE DU FICHIER : " + file.replace(/^.*[\\\/]/, ''))
        //FONCTION DE RECHERCHE DE REF
    //On créer un objet XLSX
    const XLSX = require('xlsx');
    //On lis notre fichier excel
    var wb = XLSX.readFile(file);
    const wb2 = XLSX.readFile('Q:/EXPLOITATION/ORLY/SUPPORT/SITE WEB/PARAMETRAGE SITE/TECCOM/MARQUE TECCOM POUR IMPORT ARTICLE PAR FRS.xlsx');
    // On récupère le nom de la feuille Excel
    const sheetName = wb.SheetNames[0];
    const sheetName2 = wb2.SheetNames[0];
    //console.log(sheetName)

    // On récupère de toute les informations de la feuille choisis

    var ws = wb.Sheets[sheetName];
    const ws2 = wb2.Sheets[sheetName2];


    //On rend nos données plus lisible (JSON) 
    var json = XLSX.utils.sheet_to_json(ws);
    const tabTeccom = XLSX.utils.sheet_to_json(ws2);
    //On lis chaque ligne en cherchant notre référence
    //Si SGBD
    var compteurModif=0
    var tabDelete = []
    json.splice(0,2)
    console.log("TRAITEMENT DU FICHIER")
    for (var y = 0; y < tabTeccom.length; y++) {
            //console.log(tabTeccom[y]["Marque pour import article sur site"])
        if (tabTeccom[y]["Marque pour import article sur site"] == "A SUPPRIMER"){
                tabDelete[y]=tabTeccom[y]["Code Marque fichier FRS"]
            }
        }
    
    for (var i = 0; i < json.length; i++) {
        //Supression des colones innutiles
        delete json[i].Section
        delete json[i].N_Ligne_Tarif
        delete json[i].Code_EAN
        delete json[i].Art_substitution
        delete json[i].Art_remplaceQte_mini
        delete json[i].Udm_qte_mini
        delete json[i].Qte_cond
        delete json[i].Udm_qte_cond
        delete json[i].Base_ppc
        delete json[i].Base_prix_euro
        delete json[i].Type_prix
        delete json[i].Poids
        delete json[i].Udm_poids
        delete json[i].Code_remise
        delete json[i].Code_sousfamille_NU
        delete json[i].Montant_consigne
        delete json[i].Code_classe_consigne
        delete json[i].Reference_consigne
        delete json[i].Ref_complementaire
        delete json[i].Code_metier	
        delete json[i].Prix2
        delete json[i].Qte2
        delete json[i].Prix3
        delete json[i].Qte3
        delete json[i].Prix4
        delete json[i].Qte4
        delete json[i].Prix5
        delete json[i].Qte5
        delete json[i].Prix6
        delete json[i].Qte6	
        delete json[i].Prix7	
        delete json[i].Qte7	
        delete json[i].Art_remplacement	
        delete json[i].Qte_multiple	
        delete json[i].Codes_constructeurs		
        delete json[i].ValeurHT_DEEE	
        delete json[i].Code_DEEE	
        delete json[i].Coefficient_TICPE	
        delete json[i].Mention_Coeff_TICPE	
        delete json[i].Valeur_TICPE	
        delete json[i].Coeff_TGAP	
        delete json[i].Mention_Coeff_TGAP	
        delete json[i].Valeur_TGAP	
        delete json[i].Udm_prix2x_qte2x	
        delete json[i].Description_courte	
        delete json[i].Qte_contenant	
        delete json[i].Udm_qte_contenant	
        delete json[i].Hauteur	
        delete json[i].Longueur	
        delete json[i].Largeur	
        delete json[i].Udm_dimensions	
        delete json[i].Classe_ADR	
        delete json[i].Code_ONU	
        delete json[i].Grp_emballage	
        delete json[i].Symbol_danger	
        delete json[i].Point_eclair	
        delete json[i].Description_ADR	
        delete json[i].Statut	
        delete json[i].Description_complementaire	
        delete json[i].Date_application	
        delete json[i].Code_famille_NU	
        delete json[i].Prefixe_tarif	
        delete json[i].Date_fin_validite	
        delete json[i].Num_jour_creation	
        delete json[i].Ref_TecDoc	
        delete json[i].Volume	
        delete json[i].Udm_volume	
        delete json[i].Code_pays	
        delete json[i].GTIN_14
        delete json[i].Code_EAN_1	
        delete json[i].Code_EAN_2	
        delete json[i].Code_EAN_3	
        delete json[i].Code_EAN_4	
        delete json[i].Valeur_DDS	
        delete json[i].DLC	
        delete json[i].DLU	
        delete json[i].Code_douane	
        delete json[i].Code_famille_fournisseur
        delete json[i].Qte_mini

        var tabCle = Object.keys(json[i])
        
        if (tabCle.indexOf("Code_marque")==-1 ){
            json[i]["Code_marque"]="#NA"
        }
        if(tabCle.indexOf("Prix_ppc")==-1 ||json[i]["Prix_ppc"] == 0  ){
            json[i]["Prix_ppc"]=json[i]["Prix_euro"]*1.5
        }
        if (tabCle.indexOf("Prix_euro")==-1){
            json[i]["Prix_euro"]="#NA"
        }
        if (tabDelete.indexOf(json[i]["Code_marque"])!=-1){
            json.splice(i,5);
            i=i-1
            continue
            compteurModif+=1
        }

        json[i]["Code_marque"].trim()

        // SI l'index courrant appartient a tabDelete
        if (json[i]["Code_marque"]=="AIR"){json[i]["Code_marque"]="AIRTEX"}
        if (json[i]["Code_marque"]=="BER"){json[i]["Code_marque"]="BERU"}
        if (json[i]["Code_marque"]=="BOS"){json[i]["Code_marque"]="BOSCH"}
        if (json[i]["Code_marque"]=="CAB"){json[i]["Code_marque"]="CABOR"}
        if (json[i]["Code_marque"]=="CAL"){json[i]["Code_marque"]="CALORSTAT by Vernet"}
        if (json[i]["Code_marque"]=="CEV"){json[i]["Code_marque"]="CEVAM"}
        if (json[i]["Code_marque"]=="CHA"){json[i]["Code_marque"]="CHAMPION"}
        if (json[i]["Code_marque"]=="CON"){json[i]["Code_marque"]="CONTINENTAL CTAM"}
        if (json[i]["Code_marque"]=="COR"){json[i]["Code_marque"]="CORTECO"}
        if (json[i]["Code_marque"]=="DAS"){json[i]["Code_marque"]="DA SILVA"}
        if (json[i]["Code_marque"]=="DEN"){json[i]["Code_marque"]="DENSO"}
        if (json[i]["Code_marque"]=="FED"){json[i]["Code_marque"]="MOOG"}
        if (json[i]["Code_marque"]=="FRO"){json[i]["Code_marque"]="FERODO"}
        if (json[i]["Code_marque"]=="GAT"){json[i]["Code_marque"]="GATES"}
        if (json[i]["Code_marque"]=="HEL"){json[i]["Code_marque"]="HELLA"}
        if (json[i]["Code_marque"]=="JUR"){json[i]["Code_marque"]="JURID"}
        if (json[i]["Code_marque"]=="KNE"){json[i]["Code_marque"]="KNECHT"}
        if (json[i]["Code_marque"]=="LUK"){json[i]["Code_marque"]="LuK"}
        if (json[i]["Code_marque"]=="MAG"){json[i]["Code_marque"]="MAGNETI MARELLI"}
        if (json[i]["Code_marque"]=="MIN"){json[i]["Code_marque"]="MINTEX"}
        if (json[i]["Code_marque"]=="PAY"){json[i]["Code_marque"]="PAYEN"}
        if (json[i]["Code_marque"]=="PUR"){json[i]["Code_marque"]="PURFLUX"}
        if (json[i]["Code_marque"]=="RUV"){json[i]["Code_marque"]="RUVILLE"}
        if (json[i]["Code_marque"]=="SEI"){json[i]["Code_marque"]="SEIM"}
        if (json[i]["Code_marque"]=="TEX"){json[i]["Code_marque"]="TEXTAR"}
        if (json[i]["Code_marque"]=="VAL"){json[i]["Code_marque"]="VALEO"}	
        }
        let debut = new Date()
        var date = padTo2Digits(debut.getDate()) + "." + padTo2Digits(debut.getMonth()+1) + "."+debut.getFullYear()

        console.log("SAUVEGARDE DU FICHIER")
        json.filter(function(val){return val});
        ws = XLSX.utils.json_to_sheet(json);
        wb  = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'BLOIS');
        XLSX.writeFile(wb,'Q:/EXPLOITATION/ORLY/SUPPORT/SITE WEB/PARAMETRAGE SITE/GOLDA (TARIF)/TARIF FOURNISSEUR/2022/BLOIS/IMPORT BLOIS '+date+'.xlsx');
        return "Done"
    }
    catch(err){
        console.log(err)
    }    
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}