var fsextra = require('fs-extra');
var fs = require("fs");
const sql = require("mssql")
var sqlConfig =  require("./database.js");
const { info, Console } = require('console');



async function RequiredDatas(){
    const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
    console.log("SELECTION DES FOURNISSEURS")

    var Datas = "USE [AUTO_EQUIP_TEST]\n"+
    "SELECT \n"+
    "[F_DOCLIGNE].DO_Piece,\n"+
    "[F_DOCLIGNE].[CT_Num],\n"+
    "[F_DOCLIGNE].AR_Ref,\n"+
    "[F_DOCLIGNE].DL_Design,\n"+
    "[F_DOCLIGNE].DO_Ref,\n"+
    "[F_DOCLIGNE].DO_Date,\n"+
    "[F_DOCLIGNE].DL_PrixUnitaire,\n"+
    "[F_DOCLIGNE].DL_MontantHT,\n"+
    "[F_DOCLIGNE].DL_Qte,\n"+
    "[F_DOCLIGNE].DL_QteBC,\n"+
    "[F_DOCLIGNE].DL_Remise01REM_Valeur,\n"+
    "Ven.V_CLINUM,\n"+
    "[F_LIVRAISON].LI_Pays,\n"+
    "Ven.V_EXPEDIT,\n"+
    "[F_DOCENTETE].DO_Coord01,\n"+
    "[F_DOCENTETE].Remarque\n"+
    "FROM [F_DOCLIGNE] \n"+
        "LEFT JOIN (SELECT V_CLINUM,V_docnum,V_EXPEDIT FROM DP_VENTES where V_DOCTYPE=1) AS Ven ON F_DOCLIGNE.DO_Ref =Ven.V_DOCNUM \n"+
        "LEFT JOIN F_LIVRAISON ON Ven.V_CLINUM = F_LIVRAISON.CT_Num\n"+
        "LEFT JOIN F_DOCENTETE ON [F_DOCLIGNE].DO_Piece = F_DOCENTETE.DO_Piece\n"+
    "WHERE [F_DOCLIGNE].DO_Domaine = '1' and  F_DOCENTETE.DO_Domaine = '1' and [F_DOCENTETE].DO_Type = '12' and [F_DOCLIGNE].DO_Type = '12' order by [F_DOCLIGNE].DO_Piece desc"
    var ResDatas= await pool.request().query(Datas);
    console.log(ResDatas.recordset.length)
    var date ;
    var GlobalArray = []
    var FOURNISSEUR = [] , BC_ACHAT = [] , DOC_CLIENT = [], REFERENCE = [], CLIENT = [] ,PAYS = [];
    var DATA = []

    ResDatas.recordset.forEach(element => {
        if( element.LI_Pays != null ){
            element.LI_Pays=element.LI_Pays.toLowerCase()
            element.LI_Pays=element.LI_Pays.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" FRANCAISE","")
        }
        if (!FOURNISSEUR.includes(element.CT_Num)) {
            FOURNISSEUR.push(element.CT_Num)
        }
        if (!BC_ACHAT.includes(element.DO_Piece))
            {BC_ACHAT.push(element.DO_Piece)}
        if (!DOC_CLIENT.includes(element.DO_Ref))
            {DOC_CLIENT.push(element.DO_Ref)}
        if (!REFERENCE.includes(element.AR_Ref))
            {REFERENCE.push(element.AR_Ref)}
        if (!CLIENT.includes(element.V_CLINUM))
            {CLIENT.push(element.V_CLINUM)}
        if (!PAYS.includes(element.LI_Pays))
            {PAYS.push(element.LI_Pays)}


        if(element.N_Expedition == 6)
        {
            element.N_Expedition="AVION"
        }
        if(element.N_Expedition == 3)
        {
            element.N_Expedition ="LIVRAISON FRAN"
        }
        if(element.N_Expedition == 4)
        {
            element.N_Expedition ="CHRONOPOST"
        }
        if(element.N_Expedition == 5)
        {
            element.N_Expedition ="MIDEX ORLY"
        }
        if(element.N_Expedition == 7)
        {
            element.N_Expedition ="BATEAU"
        }

        date = new Date(element.DO_Date)
        var OutDate = checkTime(date.getUTCDay().toString()) + "/" +checkTime((date.getUTCMonth()+1).toString()) +"/" +date.getUTCFullYear().toString().slice(2)
        element.DO_Date = OutDate
        DATA.push({
            "DATE":element.DO_Date,
            "CDE ACH":element.DO_Piece,
            "CDE VT":element.DO_Ref,
            "REFERENCE":element.AR_Ref,
            "QTE COMMANDE":element.DL_QteBC,
            "QTE RECUE":element.DL_Qte,
            "DESIGNATION":element.DL_Design,
            "PAYS":element.LI_Pays,
            "MODE EXP":element.N_Expedition,
            "CLIENT":element.V_CLINUM,
            "REMARQUE":element.Remarque,
            "IMMAT / INFO":"A FAIRE",
            "PRIX UNITAIRE":element.DL_PrixUnitaire,
            "REMISE":element.DL_Remise01REM_Valeur,
            "MONTANT HT":element.DL_MontantHT,
            "FOURNISSEUR":element.CT_Num

        })
    });

    
    GlobalArray.push(ResDatas.recordset,FOURNISSEUR.sort(),BC_ACHAT.sort(),DOC_CLIENT.sort(),REFERENCE.sort(),CLIENT.sort(),PAYS.sort(),DATA)
    //console.log(GlobalArray)
    return GlobalArray
}

async function Transformer(options,postedDatas){
    const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
    // FETCH DATAS MAJ QTE AVEC REF ET XMC ET QTE RECUE
    // ATTENTION CHANGEMENT DE LETTRE DANS L'AUTOINCREMENTATION
    
    if(options.typeFac == "BL"){
        var doType = 13
        var idCol = 3
    }else if (options.typeFac == "FACTURE"){ var doType = 16; var idCol = 6;}

        var getMC ='USE [AUTO_EQUIP_TEST] select DC_Piece from F_DOCCURRENTPIECE WHERE DC_IdCol = '+idCol+' and DC_Domaine = 1'
        var resgetMC = await pool.request().query(getMC);
        let currentMC = resgetMC.recordset[0].DC_Piece

        var whereUpdate = await fetchQTE(postedDatas)
 
        
        var transfoEntete = "USE [AUTO_EQUIP_TEST]\n"+
        "UPDATE [F_DOCENTETE]\n"+
        "SET DO_Piece = '"+currentMC+"',\n"+
        "DO_DocType = "+doType+",\n"+
        "DO_Type = "+doType+",\n"+
        "DO_Date =CONVERT (date, SYSDATETIME()),\n"+
        "DO_Ref= '"+options.nFacture+"'\n"+ 
        "where DO_Piece ='"+tabuniqueXMC[0]+"'"

        console.log("reqTransfoEntete : ")
        console.log(transfoEntete) 

        //BOUCLE SUR LES XMC Pour MAJ
        for (let i = 0; i < tabuniqueXMC.length; i++) {
            var transfoLigne = "USE [AUTO_EQUIP_TEST]\n"+
            "UPDATE [F_DOCLIGNE]\n"+ 
            "SET DO_Piece = '"+currentMC+"',\n"+
            "DO_Type = "+doType+",\n"+
            "DO_DocType = "+doType+",\n"+
            "DL_PieceBC = '"+tabuniqueXMC[i]+"',\n"+
            "DO_Date =CONVERT (date, SYSDATETIME()) \n"+
            "where DO_Piece = '"+tabuniqueXMC[i]+"'";

            console.log("reqTransfoLigne : ")
            console.log(transfoLigne)    
        }
        var SupRegl = " DELETE FROM [AUTO_EQUIP_TEST].[dbo].[F_DOCREGL] where DO_Type = 12 and do_domaine = 1 and do_piece in ("+whereUpdate+")"
        var SupBCVIDE = "delete from F_DOCLIGNE where DO_Piece in ("+whereUpdate+") and DO_Domaine = '1' and DO_Type = '12'"
        console.log("supFichier : ")
        console.log(SupRegl)  
        console.log(SupBCVIDE)    
  
        var incrementedMc = await IncrementDocs(options.typeFac,currentMC)   
        var reqIncrement = "USE [AUTO_EQUIP_TEST]\n"+
        "UPDATE AUTO_EQUIP_TEST.dbo.F_DOCCURRENTPIECE SET DC_Piece = '"+incrementedMc+"' WHERE DC_IdCol = 3 and DC_Domaine = 1"
        console.log("reqIncrement : ")
        console.log(reqIncrement)

        
        // select DC_Piece from AUTO_EQUIP_TEST.dbo.F_DOCCURRENTPIECE WHERE DC_IdCol = 3 and DC_Domaine = 1 


}

module.exports = {RequiredDatas,Transformer}
function checkTime(i) {
    if (i<10) {i = "0" + i};
    return i;
}
async function IncrementDocs(typeFac,mc) {
    if(typeFac == "BL"){
        var incrementedMc = (Number(mc.slice(2))+ 1).toString()
        //console.log(incrementedMc)
         return ("MC"+incrementedMc)
    }
    else if(typeFac == "FACTURE"){
        var incrementedMc = (Number(mc.slice(1))+ 1).toString()
        //console.log(incrementedMc)
         return ("G"+incrementedMc)
    }
}
var tabuniqueXMC = []
async function fetchQTE(postedDatas){
    tabuniqueXMC = []
    if(postedDatas.length>1){
        var strUpdate = "'"+postedDatas[0]['CDE ACH']+"',";
        const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
        let pool = await sql.connect(sqlProperties)
        for (let i = 1; i < postedDatas.length; i++){
            if (!tabuniqueXMC.includes(postedDatas[i]['CDE ACH']))
            {
                tabuniqueXMC.push(postedDatas[i]['CDE ACH'])
            }
            if(postedDatas[i]["QTERECUE"] != postedDatas[i]["QTECOMMANDE"])
            {
                console.log("USE [AUTO_EQUIP_TEST] UPDATE [F_DOCLIGNE] SET DL_QteBL = "+ postedDatas[i]["QTERECUE"] +" WHERE DO_Piece= "+postedDatas[i]["CDE ACH"]+" AND AR_Ref="+postedDatas[i]["REF"]+" AND CT_Num="+postedDatas[i]["FOURNISSEUR"]+" AND DO_Domaine = '1'  AND DO_type = '12' ")
                //await pool.request().query("UPDATE [F_DOCLIGNE] SET DL_QteBL = "+ postedDatas[i]["QTERECUE"] +" WHERE DO_Piece= "+postedDatas[i]["CDE ACH"]+" AND AR_Ref="+postedDatas[i]["REF"]+" AND CT_Num="+postedDatas[i]["FOURNISSEUR"]+" AND DO_Domaine = '1'  AND DO_type = '12' ");
            }
        }
        for (let y = 1; y < tabuniqueXMC.length; y++) {
            strUpdate = strUpdate + "'"+tabuniqueXMC[y]+"',"
            console.log(strUpdate)
        }
        strUpdate = strUpdate.substring(0, strUpdate.length - 1)

        return strUpdate
    }
};