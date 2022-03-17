var excelsData =  require("./extractData.js");
var cron = require('node-cron');
var fsextra = require('fs-extra');
var fs = require("fs");
var ImportPublic =  require("./AppImportPrixPublic.js");
var ImportNet =  require("./AppImportPrixNets.js");
const sql = require("mssql")
var sqlConfig =  require("./database.js");

module.exports.sqlModifOffi= async function (tabData,file,dernierFichier)
{
  try
  {
    var log = "DEBUT PROCESS SQL\n"
    console.log("DEBUT PROCESS SQL")
    if(dernierFichier == "OUI")
      log= "DERNIER FICHIER EN COUR DE LECTURE\n"
    
    var pre_query = new Date().getTime();

    tabData = uniqueRef(tabData, it=>it.REF)
    //console.log(tabData)
    var tabDataInsert = []

    for (let i = 0; i < tabData.length; i++) {
      tabDataInsert[i] = {
          'AR_Ref':tabData[i].REF,
          'AR_Design':tabData[i].DESIGNATIONS,
          'FA_CodeFamille':tabData[i].FAMILLE,
          'AR_PrixVen':tabData[i].PRIXVENTE,
          'AR_PrixAch':tabData[i].PRIXACHAT,         
          'CT_Num':tabData[i].FOURNISSEUR,
          'AF_Principal':tabData[i].FRSPRINCIPAL,
          'AF_Remise':tabData[i].VALEURREMISE,
          'MARQUE':tabData[i].MARQUE,
          'GAMME':tabData[i].GAMME,
          'Correspondance ref 1':tabData[i].COR1,
          'Correspondance ref 2':tabData[i].COR2,
          'Correspondance ref 3':tabData[i].COR3,
          'Correspondance ref 4':tabData[i].COR4,
          'Correspondance ref 5':tabData[i].COR5,
          'Correspondance ref 6':tabData[i].COR6,
          'Correspondance ref 7':tabData[i].COR7,
          'Correspondance ref 8':tabData[i].COR8,
          'Correspondance ref 9':tabData[i].COR9,
          'Correspondance ref 10':tabData[i].COR10,
          'AR_Publie':tabData[i].PUBLIERSITE,
          'AR_PoidsNet':tabData[i].POIDSNET,
          'AR_CodeFiscal':tabData[i].CODEDOUANE,
          'AR_Sommeil':0,
          'AR_Contremarque':1,
          'FA_BaseFamille':tabData[i].BASEFAMILLE,
          'AR_UnitePoids':2,
          'AF_PrixAch':tabData[i].PRIXFOURNISS,
          'Type Tarif' : 'Net'
        }
    }

    console.log("Création du tableau d'import fait")
    var strBulk = ""
    for (let i = 0; i < tabDataInsert.length; i++) 
    {
      if(tabDataInsert[i]["AR_Ref"].length<20)
      {
        strBulk = strBulk + Object.values(tabDataInsert[i])+"\n"
      }
    }

    strBulk = strBulk.replaceAll(',','\t')
    fs.writeFileSync("C:/DATA/DOSSIER_FTP/testSQL/Import SAGE.txt", strBulk,'utf-8')
    console.log("Création du fichier d'import fait ")

    const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
    let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
    let ImpDel = await pool.request().query("DELETE FROM [AUTO_EQUIP].[dbo].[F_IMPORT]")
    
    log = log+"INSERTION TABLE TAMPON\n"
    console.log("INSERTION TABLE TAMPON")
    var CreationArticleFournisseurTampon = "BULK INSERT [AUTO_EQUIP].[dbo].[F_IMPORT] FROM 'C:/DATA/DOSSIER_FTP/testSQL/Import SAGE.txt' WITH (FIRSTROW = 1,FIELDTERMINATOR = '0x09' ,ROWTERMINATOR='0x0a')"
    let resCreationArticleFournisseurTampon = await pool.request().query(CreationArticleFournisseurTampon)
    //console.log(resCreationArticleFournisseurTampon)

    // On place notre fichier d'import dans le dossier 

    console.log("CREATION DES NOUVEAUX ARTICLES")
    log=log+"CREATION DES NOUVEAUX ARTICLES\n"


      var sqlNewRef = "INSERT INTO [AUTO_EQUIP].[dbo].[F_ARTICLE] ([AR_Ref],[AR_Design],[FA_CodeFamille],[AR_PrixVen],[AR_PrixAch],[MARQUE],[GAMME],[Correspondance ref 1],[Correspondance ref 2],[Correspondance ref 3],[Correspondance ref 4],[Correspondance ref 5],[Correspondance ref 6],[Correspondance ref 7],[Correspondance ref 8],[Correspondance ref 9],[Correspondance ref 10],[AR_Publie],[AR_PoidsNet],[AR_CodeFiscal],[AR_Contremarque],[AR_Sommeil],[Type Tarif])\n"+
      "SELECT [AR_Ref],isNull([AR_Design],'PIECE')[AR_Design],isNull([FA_CodeFamille],[FA_BaseFamille])[FA_CodeFamille],[AR_PrixVen],[AR_PrixAch],[MARQUE],[GAMME],[Correspondance ref 1],[Correspondance ref 2],[Correspondance ref 3],[Correspondance ref 4],[Correspondance ref 5],[Correspondance ref 6],[Correspondance ref 7],[Correspondance ref 8],[Correspondance ref 9],[Correspondance ref 10],[AR_Publie],[AR_PoidsNet],[AR_CodeFiscal],[AR_Contremarque],[AR_Sommeil],[Type Tarif]\n"+
      "FROM [AUTO_EQUIP].[dbo].[F_IMPORT]\n"+
      "WHERE [AR_Ref] NOT IN\n"+
        "(SELECT [AR_Ref]\n"+
          "FROM [AUTO_EQUIP].[dbo].[F_ARTICLE])"
      let resCreationArticle = await pool.request().query(sqlNewRef)

    console.log("SUPRESSION DU FOURNISSEUR")
    log=log+"SUPRESSION DU FOURNISSEUR\n"
    //Ont Supprime la liste du FOURNISSEUR

    if (tabData[0].SUPARTICLE == 'OUI') 
    {
      console.log("OUI")     
      var SuppressionArticlesFournisseur = "DELETE FROM [AUTO_EQUIP].[dbo].[F_ARTFOURNISS] WHERE [CT_Num] = " +"'"+ tabData[0].FOURNISSEUR+"'"
    //console.log(SuppressionArticlesFournisseur)
      let resSuppressionArticlesFournisseur = await pool.request().query(SuppressionArticlesFournisseur)
    }
    else if (tabData[0].SUPARTICLE == 'NON')
    {
      console.log("NON")
      var SuppressionArticlesFournisseur = "DELETE FROM [dbo].[F_ARTFOURNISS] WHERE [CT_Num]="+"'"+ tabData[0].FOURNISSEUR+"' AND [AR_Ref] IN (SELECT [F_ARTICLE].[AR_Ref] FROM [F_ARTICLE] INNER JOIN [F_IMPORT] on [F_IMPORT].[MARQUE] = [F_ARTICLE].[MARQUE]   WHERE [dbo].[F_ARTICLE].[MARQUE] = [dbo].[F_IMPORT].[MARQUE])"
      //console.log(SuppressionArticlesFournisseur)
      let resSuppressionArticlesFournisseur = await pool.request().query(SuppressionArticlesFournisseur)
    }

    
    //Puis on importe nos données FOUNISSEUR
    log=log+"INSERTION DONNEES FOURNISSEUR\n"
    console.log("INSERTION DONNEES FOURNISSEUR")
    var CreationArticleFournisseur = "INSERT INTO [AUTO_EQUIP].[dbo].[F_ARTFOURNISS] ([AR_Ref],[CT_Num],[AF_PrixAch],[AF_Principal],[AF_Remise]) SELECT [AR_Ref],[CT_Num],[AF_PrixAch],[AF_Principal],[AF_Remise] FROM [AUTO_EQUIP].[dbo].[F_IMPORT] WHERE [F_IMPORT].[AR_Ref] NOT IN (SELECT [AR_Ref] from [F_ARTFOURNISS] where [CT_Num] = '"+tabData[0].FOURNISSEUR+"')" 
    //var CreationArticleFournisseur = "INSERT IGNORE INTO [AUTO_EQUIP].[dbo].[F_ARTFOURNISS] ([AR_Ref],[CT_Num],[AF_PrixAch],[AF_Principal],[AF_Remise]) SELECT [AR_Ref],[CT_Num],[AF_PrixAch],[AF_Principal],[AF_Remise] FROM [AUTO_EQUIP].[dbo].[F_IMPORT];" 
    let resCreationArticleFournisseur = await pool.request().query(CreationArticleFournisseur)

    // ENFIN ON MET A JOUR TOUTE LES REFS ARTICLES 
    log=log+"MISE A JOUR DONNEES ARTICLES\n"
    console.log("MISE A JOUR DONNEES ARTICLES")
    //if()
    if(tabData[0].DESIGNATIONMODIF == "NON")
    {
      var MajsArticles =
      "MERGE [F_ARTICLE] AS Art\n"+
      "USING [F_IMPORT] AS Imp\n"+
      "ON  Imp.[AR_Ref]=Art.[AR_Ref]\n"+
        "WHEN MATCHED THEN\n"+
      "UPDATE SET\n"+
			  "Art.[FA_CodeFamille] = isNull(Imp.[FA_CodeFamille],Art.[FA_CodeFamille]),\n"+
			  "Art.[MARQUE] = isNull(Imp.[MARQUE],Art.[MARQUE]), \n"+
			  "Art.[GAMME] = isNull(Imp.[GAMME],Art.[GAMME]),\n"+
			  "Art.[Correspondance ref 1] = isNull(Imp.[Correspondance ref 1],Art.[Correspondance ref 1]),\n"+
			  "Art.[Correspondance ref 2] = isNull(Imp.[Correspondance ref 2],Art.[Correspondance ref 2]),\n"+
			  "Art.[Correspondance ref 3] = isNull(Imp.[Correspondance ref 3],Art.[Correspondance ref 3]),\n"+
			  "Art.[Correspondance ref 4] = isNull(Imp.[Correspondance ref 4],Art.[Correspondance ref 4]),\n"+
			  "Art.[Correspondance ref 5] = isNull(Imp.[Correspondance ref 5],Art.[Correspondance ref 5]),\n"+
			  "Art.[Correspondance ref 6] = isNull(Imp.[Correspondance ref 6],Art.[Correspondance ref 6]),\n"+
			  "Art.[Correspondance ref 7] = isNull(Imp.[Correspondance ref 7],Art.[Correspondance ref 7]),\n"+
			  "Art.[Correspondance ref 8] = isNull(Imp.[Correspondance ref 8],Art.[Correspondance ref 8]),\n"+
			  "Art.[Correspondance ref 9] = isNull(Imp.[Correspondance ref 9],Art.[Correspondance ref 9]),\n"+
			  "Art.[Correspondance ref 10] = isNull(Imp.[Correspondance ref 10],Art.[Correspondance ref 10]),\n"+
			  "Art.[AR_PoidsNet] = isNull(Imp.[AR_PoidsNet],Art.[AR_PoidsNet]),\n"+
			  "Art.[AR_CodeFiscal] = isNull(Imp.[AR_CodeFiscal],Art.[AR_CodeFiscal]),\n"+
			  "Art.[AR_Contremarque] = isNull(Imp.[AR_Contremarque],Art.[AR_Contremarque]),\n"+
			  "Art.[AR_Publie] = isNull(Imp.[AR_Publie],Art.[AR_Publie]),\n"+
			  "Art.[AR_UnitePoids] = isNull(Imp.[AR_UnitePoids],Art.[AR_UnitePoids]),\n"+
			  "Art.[Type Tarif] = case when Art.[AR_PrixVen] = 0 and  Art.[AR_PrixAch] = 0  OR Art.[AR_PrixVen] IS NULL then Imp.[Type Tarif] end,\n"+
			  "Art.[AR_PrixVen] = \n"+	  
			  "case \n"+
				"when Art.[AR_PrixVen] = 0 OR Art.[AR_PrixVen] IS NULL then Imp.[AR_PrixVen]\n"+
			  "end,\n"+
			  "Art.[AR_PrixAch] = case when Art.[AR_PrixAch] = 0 OR Art.[AR_PrixAch]  IS NULL then Imp.[AR_PrixAch] end ;\n"
      let resMajsArticles = await pool.request().query(MajsArticles)
      console.log(resMajsArticles)
    }
    if(tabData[0].DESIGNATIONMODIF == "OUI")
    {
      var MajsArticles =
      "MERGE [F_ARTICLE] AS Art\n"+
      "USING [F_IMPORT] AS Imp\n"+
      "ON  Imp.[AR_Ref]=Art.[AR_Ref]\n"+
        "WHEN MATCHED THEN\n"+
      "UPDATE SET\n"+
			  "Art.[FA_CodeFamille] = isNull(Imp.[FA_CodeFamille],Art.[FA_CodeFamille]),\n"+
			  "Art.[MARQUE] = isNull(Imp.[MARQUE],Art.[MARQUE]), \n"+
			  "Art.[GAMME] = isNull(Imp.[GAMME],Art.[GAMME]),\n"+
        "Art.[AR_Design] = Imp.[AR_Design],\n"+
			  "Art.[Correspondance ref 1] = isNull(Imp.[Correspondance ref 1],Art.[Correspondance ref 1]),\n"+
			  "Art.[Correspondance ref 2] = isNull(Imp.[Correspondance ref 2],Art.[Correspondance ref 2]),\n"+
			  "Art.[Correspondance ref 3] = isNull(Imp.[Correspondance ref 3],Art.[Correspondance ref 3]),\n"+
			  "Art.[Correspondance ref 4] = isNull(Imp.[Correspondance ref 4],Art.[Correspondance ref 4]),\n"+
			  "Art.[Correspondance ref 5] = isNull(Imp.[Correspondance ref 5],Art.[Correspondance ref 5]),\n"+
			  "Art.[Correspondance ref 6] = isNull(Imp.[Correspondance ref 6],Art.[Correspondance ref 6]),\n"+
			  "Art.[Correspondance ref 7] = isNull(Imp.[Correspondance ref 7],Art.[Correspondance ref 7]),\n"+
			  "Art.[Correspondance ref 8] = isNull(Imp.[Correspondance ref 8],Art.[Correspondance ref 8]),\n"+
			  "Art.[Correspondance ref 9] = isNull(Imp.[Correspondance ref 9],Art.[Correspondance ref 9]),\n"+
			  "Art.[Correspondance ref 10] = isNull(Imp.[Correspondance ref 10],Art.[Correspondance ref 10]),\n"+
			  "Art.[AR_PoidsNet] = isNull(Imp.[AR_PoidsNet],Art.[AR_PoidsNet]),\n"+
			  "Art.[AR_CodeFiscal] = isNull(Imp.[AR_CodeFiscal],Art.[AR_CodeFiscal]),\n"+
			  "Art.[AR_Contremarque] = isNull(Imp.[AR_Contremarque],Art.[AR_Contremarque]),\n"+
			  "Art.[AR_Publie] = isNull(Imp.[AR_Publie],Art.[AR_Publie]),\n"+
			  "Art.[AR_UnitePoids] = isNull(Imp.[AR_UnitePoids],Art.[AR_UnitePoids]),\n"+
			  "Art.[Type Tarif] = case when Art.[AR_PrixVen] = 0 and  Art.[AR_PrixAch] = 0  OR Art.[AR_PrixVen] IS NULL then Imp.[Type Tarif] end,\n"+
			  "Art.[AR_PrixVen] = \n"+	  
			  "case \n"+
				"when Art.[AR_PrixVen] = 0 OR Art.[AR_PrixVen] IS NULL then Imp.[AR_PrixVen]\n"+
			  "end,\n"+
			  "Art.[AR_PrixAch] = case when Art.[AR_PrixAch] = 0 OR Art.[AR_PrixAch]  IS NULL then Imp.[AR_PrixAch] end ;\n"

      let resMajsArticles = await pool.request().query(MajsArticles)
      console.log(resMajsArticles)
    }
    //ON VIDE ENSUITE NOTRE TABLE TAMPON
    log=log+"SUPPRESSION DES DONNES TABLE IMPORT\n"
    console.log("SUPPRESSION DES DONNES TABLE IMPORT")
    var deleteTampon = await pool.request().query("DELETE FROM [AUTO_EQUIP].[dbo].[F_IMPORT]")
    sql.close() // On ferme la connexion a la BDD
    var post_query = new Date().getTime();
    // calculate the duration in seconds
    if(dernierFichier == "OUI"){
      log=log+"DERNIER FICHIER EN COUR DE LECTURE\n"
      //fournisseurPrincipal();
      // PROCESS DE MISE A JOUR DES FOURNISSEUR PRINCIPAUX 
    }
      

    var duration = (post_query - pre_query) / 1000;
    log=log+"FIN PROCESS SQL EN : "+ duration
    const delay = ms => new Promise(res => setTimeout(res, ms));

    await fs.writeFile("Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/LOGS/"+file.slice(0, -5)+".txt",log+"\n",() => {
      console.log("Fichier Logs Crée");  
      });

    await fsextra.move('C:/DATA/DOSSIER_FTP/testSQL/Import SAGE.txt','Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/FICHIER IMPORT TXT/'+file.slice(0, -5)+'.txt', function (err) {
      if (err) return console.error(err)
      console.log("Fichier Import déplacé !")
    })
    await fsextra.move('Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/A IMPORTER/'+file,'Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/FAIT/'+file, function (err) {
      if (err) return console.error(err)
      console.log("Fichier excel déplacé!")
    })
    await sleep(10000);
    await console.log("FIN PROCESS SQL EN : "+ duration)

    // Petite pause entre deux imports 
    return "Done"
  }
  catch(err){
    log = log + err; 
    console.log("Erreur dans le traitement")
    await fs.writeFile("Q:/EXPLOITATION/ORLY/8-IMPORT POUR SAGE/IMPORT VIA SQL/LOGS/"+file.slice(0, -5)+".txt",log+"\n",() => {
      console.log("Fichier Logs Crée");  
    });
  }
}
async function majPubliee(){
  const sqlProperties = sqlConfig.dbConfig() // On récupère notre configuration SQL 
  let pool = await sql.connect(sqlProperties) // Connexion à la BDD SQL Server
  let MajPubliee = await pool.request().query("UPDATE F_ARTICLE SET AR_Publie = 0 WHERE AR_REF NOT IN (SELECT DISTINCT AR_REF FROM F_ARTFOURNISS)")

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

  var Princ0 = "update F_ARTFOURNISS SET af_principal = 0 where ar_ref in (SELECT ar_ref FROM f_article WHERE FA_CodeFamille LIKE '%PSA%')"
  var resPrinc0= await pool.request().query(Princ0)

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

  console.log("Mise a jour fournisseur principal éfféctué")
  sql.close() // On ferme la connexion a la BDD

}
function uniqueRef(tabData,key){
  return [
      ...new Map(
          tabData.map(x => [key(x),x])
      ).values()
  ]
} 
//  SELECT COUNT(*) from f_article where ar_publie = 1 ;
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}