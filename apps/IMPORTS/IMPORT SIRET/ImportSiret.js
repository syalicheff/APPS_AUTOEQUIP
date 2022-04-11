const XLSX = require('xlsx');
var fs = require("fs");
const { Console } = require('console');

function extractData(path)
{
    var Chemin= "Q:/AUTO EQUIP/SUPPORT/Developpement/SEBASTIEN/INTERFACE WEB AUTOEQUIP/apps/IMPORTS/IMPORT SIRET/LISTE SIRET A IMPORTER/" + path
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
            LI_EMail:json[i]["LI_EMail"],
            CLI_SIRET:json[i]["CLI_SIRET"],
            CLI_IDENTIFIANT:json[i]["CLI_IDENTIFIANT"]
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
    console.log(strBulk)
    fs.writeFileSync("C:/DATA/DOSSIER_FTP/testSQL/Import Client.txt", strBulk,'ucs2')

    // const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    // let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
    //BULK INSERT [AUTO_EQUIP].[dbo].[F_IMPORTCLIENT] FROM 'C:/DATA/DOSSIER_FTP/testSQL/Import Client.txt' WITH (FIRSTROW = 1,FIELDTERMINATOR = '\t' ,ROWTERMINATOR='0x0a')
}
ImportClientSQL(extractData('CLIENTS SIRET remplie.xlsx'))

// // MAJ SIRET
// MERGE [DP_CLIENTS]
// USING [F_IMPORTCLIENT]
// ON  [DP_CLIENTS].[CLI_NUM]=[F_IMPORTCLIENT].[CLI_NUM]
//     WHEN MATCHED THEN
//         UPDATE SET 
//             [DP_CLIENTS].[CLI_SIRET] = [F_IMPORTCLIENT].[CLI_SIRET],
//             [DP_CLIENTS].CLI_IDENTIFIANT = [F_IMPORTCLIENT].CLI_IDENTIFIANT;

