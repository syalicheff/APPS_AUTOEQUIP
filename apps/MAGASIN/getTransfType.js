const sql = require("mssql")
var sqlConfig =  require("./database.js");


async function typeTransf(fournisseur){
    const sqlProperties = sqlConfig.dbConfig() 
    let pool = await sql.connect(sqlProperties) 
    var reqTypeTransf = "SELECT CT_NUM,[MODE_FACTURATION] FROM [AUTO_EQUIP_TEST].[dbo].[F_COMPTET] where CT_Sommeil = 0 and CT_NUM='"+fournisseur+"'"
    var resTypeTransf= await pool.request().query(reqTypeTransf);
    //console.log(resTypeTransf)
    return(resTypeTransf.recordset)
}
module.exports = {typeTransf}