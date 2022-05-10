const XLSX = require('xlsx');
module.exports.extractData = function(path){
    var Chemin= "Q:/AUTO EQUIP/SUPPORT/Developpement/IMPORT SAGE SQL/A IMPORTER/" + path
    console.log("Début éxtraction des données du fichier " + path.substring(path.lastIndexOf('/') + 1))
    var tabData = []
    var wb = XLSX.readFile(Chemin);
    for (let y = 0; y<wb.SheetNames.length; y++) 
    {
        console.log("Début de la feuille : ",wb.SheetNames[y])
        // On récupère de toute les informations de la feuille choisis
        var ws = wb.Sheets[wb.SheetNames[y]]; 
        //On rend nos données plus lisible (JSON) 
        const json = XLSX.utils.sheet_to_json(ws);
        for (var i = 0; i< json.length; i++) 
        {
            tabData[i] = 
            {
                REF : String(json[i]["REF"]),
                DESIGNATIONS : json[i]["DESIGNATIONS"],
                DESIGNATIONMODIF : json[i]["DESIGNATION MODIF"], // NEW
                FAMILLE : json[i]["FAMILLE"] ,
                PRIXVENTE: json[i]["PRIX VENTE"],
                PRIXACHAT: json[i]["PRIX ACHAT"],
                FOURNISSEUR: json[i]["FOURNISSEUR"] ,
                FRSPRINCIPAL: json[i]["FRS PRINCIPAL  1 OU 0"] ,
                PRIXFOURNISS: json[i]["PRIX ACHAT FRS"] , // NEW
                VALEURREMISE : json[i]["VALEUR REMISE"] ,
                BASEFAMILLE:json[i]["BASE FAMILLE"] ,
                MARQUE: json[i]["MARQUE"] ,
                GAMME: json[i]["GAMME"] ,
                COR1: FilterDatas(json[i]["COR1"],"default") ,
                COR2: json[i]["COR2"] ,
                COR3: json[i]["COR3"] ,
                COR4: json[i]["COR4"] ,
                COR5: json[i]["COR5"] ,
                COR6: json[i]["COR6"],
                COR7: json[i]["COR7"] ,
                COR8: json[i]["COR8"] ,
                COR9: json[i]["COR9"] ,
                COR10: json[i]["COR10"] ,
                PUBLIERSITE: json[i]["PUBLIER SITE"] ,
                POIDSNET: json[i]["POIDS NET"] ,
                CODEDOUANE: json[i]["CODE DOUANE"]  ,
                SUPARTICLE : json[i]["SUPP ART FOURNISSEUR"]
             }
            if(typeof tabData[i].PRIXVENTE !=="undefined" ){
                if(typeof tabData[i].PRIXVENTE == "string"){tabData[i].PRIXVENTE=parseFloat(tabData[i].PRIXVENTE.replace(",","."))}
            }
            if(typeof tabData[i].PRIXACHAT !=="undefined"){
                if(typeof tabData[i].PRIXACHAT == "string"){tabData[i].PRIXACHAT=parseFloat(tabData[i].PRIXACHAT.replace(",","."))}
            }
            if(typeof tabData[i].PRIXFOURNISS !=="undefined"){
                if(typeof tabData[i].PRIXFOURNISS == "string"){tabData[i].PRIXFOURNISS=parseFloat(tabData[i].PRIXFOURNISS.replace(",","."))}
            }
            if(typeof tabData[i].DESIGNATIONS !=="undefined"){
                tabData[i].DESIGNATIONS = tabData[i].DESIGNATIONS.slice(0,64).replace(/\t/g,'').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/,/g,'').replace('-','').replace("Rétroviseur","boitier").replace("rétroviseur","boitier").replace("Retroviseur","boitier").replace("retroviseur","boitier").replace("Rétro","boitier").replace("rétro","boitier").trim()
            }
            if (typeof tabData[i].REF !=="undefined") {
                tabData[i].REF = tabData[i].REF.replace(/\t/g,'').replace('-','').replace(/\s/g,'').replace(/[&\/\\#,+(-)$~%.'"Ø|:;=#*?<>{},]/g,'')
            }
        }
    }
    return tabData    
}   
function FilterDatas(value,valDef){
    if( value === undefined )
        value = ""
    return value.replace(/\t/g,'').replace(',','').normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace('E+','').replace('-','').trim()
}
