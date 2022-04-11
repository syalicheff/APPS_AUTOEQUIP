const XLSX = require('xlsx');
var fs = require("fs");
const { Console } = require('console');
function extractData(path)
{
    var Chemin= "Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/APP IMPORT SQL/AppImportClients/LISTE CLIENT A IMPORTER/" + path
    console.log("Début éxtraction des données du fichier " + path.substring(path.lastIndexOf('/') + 1))
    var wb = XLSX.readFile(Chemin);
    console.log("Début de la feuille : ",wb.SheetNames[0])
    // On récupère de toute les informations de la feuille choisis
    var ws = wb.Sheets[wb.SheetNames[0]]; 
    //On rend nos données plus lisible (JSON) 
    const json = XLSX.utils.sheet_to_json(ws);
    var tabData = [];
    for (let i = 0; i < json.length; i++) {
        tabData[i]  ={
            CLI_NUM : json[i].CLI_NUM,
            CLI_QUALITE : json[i]["CLI_QUALITE"] ,
            CLI_CONTACT:json[i]["CLI_CONTACT"] ,
            CLI_ADRESSE: json[i]["CLI_ADRESSE"],
            CLI_COMPLEMENT :json[i]["CLI_COMPLEMENT"],
            CLI_CODEPOSTAL:json[i]["CLI_CODEPOSTAL"],
            CLI_VILLE:json[i]["CLI_VILLE"] ,
            CLI_PAYS:json[i]["CLI_PAYS"] ,
            CLI_TELEPHONE:json[i]["CLI_TELEPHONE"] ,
            CLI_TELECOPIE:json[i]["CLI_TELECOPIE"] ,
            CLI_EMAIL:json[i]["CLI_EMAIL"] ,
            CLI_SITE:json[i]["CLI_SITE"],
            LI_Intitule:json[i]["LI_Intitule"] ,
            LI_Adresse:json[i]["LI_Adresse"] ,
            LI_Complement:json[i]["LI_Complement"],
            LI_CodePostal:json[i]["LI_CodePostal"],
            LI_Ville:json[i]["LI_Ville"] ,
            LI_Pays:json[i]["LI_Pays"] ,
            LI_Contact:json[i]["LI_Contact"],
            LI_Telephone:json[i]["LI_Telephone"] ,
            LI_Telecopie:json[i]["LI_Telecopie"],
            LI_EMail:json[i]["LI_EMail"]
        }
    }
    return tabData ;   
}
// select cli_num,[CLI_PAYS],CLI_SOMMEIL,[CT_NUM],LI_Pays  FROM [AUTO_EQUIP].dbo.DP_CLIENTS inner join F_LIVRAISON ON F_LIVRAISON.[CT_NUM] = DP_CLIENTS.CLI_NUM  where CLI_SOMMEIL LIKE '%SOMMEIL%'


async function ImportClientSQL(tab){

    var strBulk = ""
    for (let i = 0; i < tab.length; i++) {
        strBulk = strBulk + Object.values(tab[i])+"\n"
    }
    strBulk = strBulk.replaceAll(',','\t')
    fs.writeFileSync("C:/DATA/DOSSIER_FTP/testSQL/Import Client.txt", strBulk,'ucs2')

    // const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    // let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
}
ImportClientSQL(extractData('CLIENTS SOMMEIL PAYS.xlsx'))

// // MAJ DONNES CLIENTS
// MERGE [DP_CLIENTS]
// USING [F_IMPORTCLIENT]
// ON  [DP_CLIENTS].[CLI_NUM]=[F_IMPORTCLIENT].[CLI_NUM]
// 	WHEN MATCHED THEN
// 		UPDATE SET 
// 			[DP_CLIENTS].[CLI_NUM] = [F_IMPORTCLIENT].[CLI_NUM],
// 			[DP_CLIENTS].[CLI_QUALITE] = [F_IMPORTCLIENT].[CLI_QUALITE],
// 			[DP_CLIENTS].[CLI_CONTACT] = [F_IMPORTCLIENT].[CLI_CONTACT],
// 			[DP_CLIENTS].[CLI_ADRESSE] = [F_IMPORTCLIENT].[CLI_ADRESSE],
// 			[DP_CLIENTS].[CLI_COMPLEMENT] = [F_IMPORTCLIENT].[CLI_COMPLEMENT],
// 			[DP_CLIENTS].[CLI_CODEPOSTAL] = [F_IMPORTCLIENT].[CLI_CODEPOSTAL],
// 			[DP_CLIENTS].[CLI_VILLE] = [F_IMPORTCLIENT].[CLI_VILLE],
// 			[DP_CLIENTS].[CLI_PAYS] = [F_IMPORTCLIENT].[CLI_PAYS],
// 			[DP_CLIENTS].[CLI_TELEPHONE] = [F_IMPORTCLIENT].[CLI_TELEPHONE],
// 			[DP_CLIENTS].[CLI_TELECOPIE] = [F_IMPORTCLIENT].[CLI_TELECOPIE],
// 			[DP_CLIENTS].[CLI_EMAIL] = [F_IMPORTCLIENT].[CLI_EMAIL],	
// 			[DP_CLIENTS].[CLI_SITE] = [F_IMPORTCLIENT].[CLI_SITE];

// // MAJ DONNEES LIVRAISON
// MERGE [F_LIVRAISON]
// USING [F_IMPORTCLIENT]
// ON [F_LIVRAISON].[CT_NUM]=[F_IMPORTCLIENT].[CLI_NUM]
// 	WHEN MATCHED THEN
// 		UPDATE SET 
//             [F_LIVRAISON].[LI_Intitule] = [F_IMPORTCLIENT].[LI_Intitule],
//             [F_LIVRAISON].[LI_Adresse] = [F_IMPORTCLIENT].[LI_Adresse],
//             [F_LIVRAISON].[LI_Complement] = [F_IMPORTCLIENT].[LI_Complement],
//             [F_LIVRAISON].[LI_CodePostal] = [F_IMPORTCLIENT].[LI_CodePostal],
//             [F_LIVRAISON].[LI_Ville] = [F_IMPORTCLIENT].[LI_Ville],
//             [F_LIVRAISON].[LI_Pays] = [F_IMPORTCLIENT].[LI_Pays],
//             [F_LIVRAISON].[LI_Contact] = [F_IMPORTCLIENT].[LI_Contact],
//             [F_LIVRAISON].[LI_Telephone] = [F_IMPORTCLIENT].[LI_Telephone],
//             [F_LIVRAISON].[LI_Telecopie] = [F_IMPORTCLIENT].[LI_Telecopie],
//             [F_LIVRAISON].[LI_EMail] = [F_IMPORTCLIENT].[LI_EMail];
