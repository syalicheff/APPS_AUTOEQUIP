const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const ImportGolda = require('./apps/Golda.js')
const ImportSQL = require('./apps/IMPORTS/main.js')


var path = require('path');
const { Console } = require('console');
const port = process.env.PORT || 8000;
app.set('view engine', 'ejs')

// On définit un dossier public pour mettre nos différents assets ( Bannierre, CSS , Snippets ,Doc )
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    createParentPath: true
}));
// Routess
app.get('/', (req, res) => {
    res.render('pages/index'); 
});
app.get('/golda', (req, res) => {
    res.render('pages/golda'); 
});
app.get('/imports', (req, res) => {
    res.render('pages/imports'); 
});

app.post('/golda', async (req,res) => 
{
    var Golda = req.body.taskOption;
	try 
    {
        if(!req.files) {
            res.send({ 
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;        
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./public/uploads/' + avatar.name);
            await new Promise(resolve => setTimeout(resolve, 5000));
            //send response

            if(Golda == 'SGDB'){
                await ImportGolda.AutoStoreImportSGDB("./public/uploads/" + avatar.name)
            }
            if (Golda == 'BLOIS'){
                 var test = await ImportGolda.AutoStoreImportBLOIS("./public/uploads/" + avatar.name)
                  if(test == "Done"){  
                    await console.log("FICHIER D'IMPORT CREER")
                 }
            }    
        }
    } 
    catch (err) {
        res.status(500).send(err);
    }

})
app.post('/imports', async (req,res) => 
{
    var typeImport = req.body.typeImport;
	try 
    {
        if(typeImport == 'MANUEL'){
            console.log("MODE MANUEL")
            ImportSQL.Main()
        }
        if (typeImport == 'TACHE PLANIFIE'){
            console.log("TACHE PLANIFIER")
        }
    } 
    catch (err)
    {
        res.status(500).send(err);
    }
})

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

