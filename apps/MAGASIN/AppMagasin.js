var fsextra = require('fs-extra');
var fs = require("fs");
const sql = require("mssql")
var sqlConfig =  require("./database.js");
const { info } = require('console');



async function RequiredDatas(){
    const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
    console.log("SELECTION DES FOURNISSEURS")

    var Datas = "SELECT  DISTINCT top(100)  \n"+
    "[F_DOCLIGNE].[CT_Num],\n"+
    "[F_DOCLIGNE].DO_Piece,\n"+
    "[F_DOCLIGNE].DO_Ref,\n"+
    "[F_DOCLIGNE].AR_Ref,\n"+
    "[F_DOCLIGNE].DL_Design,\n"+
    "[F_DOCLIGNE].DO_Date,\n"+
    "[F_DOCLIGNE].DL_PrixUnitaire,\n"+
    "[F_DOCLIGNE].DL_MontantHT,\n"+
    "[F_DOCLIGNE].DL_Qte,\n"+
    "[F_DOCLIGNE].DL_QteBC,\n"+
    "[F_DOCLIGNE].DL_Remise01REM_Valeur,\n"+
	"Ven.V_CLINUM,\n"+
	"[F_LIVRAISON].LI_Pays,\n"+
    "[F_LIVRAISON].N_Expedition,\n"+
	"[F_DOCENTETE].DO_Coord01,\n"+
    "[F_DOCENTETE].Remarque\n"+
    "FROM [AUTO_EQUIP_TEST].[dbo].[F_DOCLIGNE] \n"+
	    "JOIN (SELECT * FROM DP_VENTES where V_DOCTYPE=1) AS Ven ON F_DOCLIGNE.DO_Ref =Ven.V_DOCNUM \n"+
		"JOIN F_LIVRAISON ON Ven.V_CLINUM = F_LIVRAISON.CT_Num\n"+
		"JOIN F_DOCENTETE ON [F_DOCLIGNE].DO_Ref = F_DOCENTETE.DO_Piece\n"+
    "WHERE [F_DOCLIGNE].DO_Domaine = '1' and [F_DOCENTETE].DO_Type = '1' and [F_DOCLIGNE].DO_Type = '12' AND [F_DOCLIGNE].DO_REF != '' order by DO_Piece"
    var ResDatas= await pool.request().query(Datas);
    var date ;
    var GlobalArray = []
    var FOURNISSEUR = [] , BC_ACHAT = [] , DOC_CLIENT = [], REFERENCE = [], CLIENT = [] ,PAYS = [];
    var DATA = []

    ResDatas.recordset.forEach(element => {
        element.LI_Pays=element.LI_Pays.toLowerCase()
        element.LI_Pays=element.LI_Pays.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" FRANCAISE","")
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
    return GlobalArray
}
module.exports = {RequiredDatas}
function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}