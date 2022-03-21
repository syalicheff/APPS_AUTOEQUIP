var excelsData =  require("./extractData.js");
var cron = require('node-cron');
var fsextra = require('fs-extra');
var fs = require("fs");
var ImportPublic =  require("./AppImportPrixPublic.js");
var ImportNet =  require("./AppImportPrixNets.js");
const sql = require("mssql")
var sqlConfig =  require("./database.js");


cron.schedule('0 21 * * 1-5', () => {
    console.log("Lancement de la tâche programmé quotidienne")
    Main();
});

cron.schedule('0 23 * * 5', function(){
    ImportNet.majPubliee() 
});

console.log("APPLICATION D'IMPORTS LANCE")

async function Main (type)
{
  filenames = fs.readdirSync("Q:/AUTO EQUIP/SUPPORT/Developpement/IMPORT SAGE SQL/A IMPORTER/"); 
  for(const file of filenames) 
  {
    if(file.includes('NET'))
    {
      if( filenames.indexOf(file)+1 === filenames.length )
      {
        var tabData = await excelsData.extractData(file)
        var dernierFichier = "OUI"
        var modif = await ImportNet.sqlModifOffi(Object.values(tabData),file,dernierFichier)
      }
      else 
      { 
        var tabData = await excelsData.extractData(file)
        var dernierFichier = "NON"
        var modif = await ImportNet.sqlModifOffi(Object.values(tabData),file,dernierFichier)
      }
    }
    else if(file.includes('PUBLIC'))
    {
      if( filenames.indexOf(file)+1 === filenames.length )
      {
        var tabData = await excelsData.extractData(file)
        var dernierFichier = "OUI"
        var modif = await ImportPublic.sqlModifOffi(Object.values(tabData),file,dernierFichier)
      }
      else{ 
        var tabData = await excelsData.extractData(file)
        var dernierFichier = "NON"
        var modif = await ImportPublic.sqlModifOffi(Object.values(tabData),file,dernierFichier)
      }
    }
  }
   return "Done"
}

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    alert(out);
    // or, if you wanted to avoid alerts...
    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre)
}
async function fournisseurPrincipal(){
  const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
  let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server

  console.log("SUPPRESSION TABLE TAMPON")
  var Clean = "delete from f_principal"
  var ResClean = await pool.request().query(Clean)
  
  console.log("INSERTION TABLE TAMPON")
  var InsertFPrinc = "INSERT INTO [AUTO_EQUIP].[dbo].[F_PRINCIPAL] (AR_Ref,CT_Num,AF_PrixAch,AF_Remise) SELECT [F_ARTFOURNISS].AR_Ref,[F_ARTFOURNISS].CT_Num,[F_ARTFOURNISS].AF_PrixAch,[F_ARTFOURNISS].AF_Remise FROM [F_ARTFOURNISS] WHERE AR_Ref in (SELECT ar_ref from f_article where FA_CodeFamille LIKE '%PSA%')"
  var resInsertFPrinc = await pool.request().query(InsertFPrinc)
  
  console.log("INSERTION PRIX VENTE")
  var insertPrixVen = 
  "MERGE f_principal as princ\n"+
  "using F_article as art\n"+
  "ON ART.AR_ref = princ.ar_ref\n"+
  "when matched then\n"+
  "update set \n"+
    "princ.ar_prixven = art.ar_prixven ;"
  var resinsertPrixVen = await pool.request().query(insertPrixVen)


  console.log("MAJ RFA")

  var RFA = "UPDATE F_PRINCIPAL SET \n"+
  "F_RFA = CT_Taux04 FROM  F_PRINCIPAL \n"+
  "INNER JOIN F_COMPTET on F_PRINCIPAL.CT_Num = F_COMPTET.CT_Num"
  var resRFA = await pool.request().query(RFA)

  console.log("CALCUL PRIX MINI")
  var prixMini = 
    "update F_PRINCIPAL set \n"+
    "AF_PrixMini =  (case when AF_PrixAch = 0 OR af_prixach is null \n"+
    "then (ar_prixven * ( 100 - af_remise ) / 100 ) * ( 100 - F_RFA ) /100 \n"+
    "else AF_PrixAch * ( 100 - F_RFA ) /100 end) "
  var resprixMini = await pool.request().query(prixMini)

  console.log("MAJ A 0 ")

  var Princ = "update F_ARTFOURNISS SET af_principal = 0 where ar_ref in (SELECT ar_ref FROM f_article WHERE FA_CodeFamille LIKE '%PSA%')"
  var resPrinc= await pool.request().query(Princ)

  console.log("MAJ PRINCIPAL")
  var fPrincipal = 
  "MERGE  F_artfourniss as art\n"+  
  "using 	(SELECT AR_Ref,CT_Num \n"+
    "FROM(\n"+
      "SELECT AR_Ref,CT_Num ,AF_PrixMini, [rnk] = ROW_NUMBER() OVER(PARTITION BY AR_Ref  ORDER BY AF_PrixMini)\n"+
      "FROM F_Principal\n"+
    ") AS a\n"+
    "WHERE [rnk] = 1 ) as princ\n"+
  "ON	art.AR_ref = princ.ar_ref\n"+
  "AND art.CT_NUM = princ.CT_num\n"+
  "when matched then\n"+
    "UPDATE set\n"+
      "art.AF_Principal = 1 ;"
   resfPrincipal = await pool.request().query(fPrincipal)
   

  // REQUETE DE VERIFICATION D'IMPORT : select f_artfourniss.ar_ref,ct_num,af_remise,af_prixach,af_principal,AR_PrixVen  from f_artfourniss  inner join f_article on f_article.ar_ref = f_artfourniss.ar_ref where  f_artfourniss.ar_ref in (SELECT ar_ref FROM f_article WHERE FA_CodeFamille LIKE '%PSA%') order by AR_Ref

  console.log("Mise a jour fournisseur principal éffectué")
  sql.close() // On ferme la connexion a la BDD

}
module.exports = {Main}
const delay = ms => new Promise(res => setTimeout(res, ms));
