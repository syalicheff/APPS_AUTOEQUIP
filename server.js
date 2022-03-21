const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const ImportGolda = require('./apps/Golda.js')
const bodyParser = require("body-parser");
const ImportSQL = require('./apps/IMPORTS/main.js')
const session = require('express-session')



var path = require('path');
const { Console } = require('console');
const port = process.env.PORT || 8000;
app.set('view engine', 'ejs')


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
	try 
    {
        if(!req.files) {
            res.send({ 
                status: false,
                message: 'No file uploaded'
            });
        } else {
            (async() => 
            {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files.avatar;   
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                avatar.mv('./public/uploads/' + avatar.name);
                await new Promise(resolve => setTimeout(resolve, 30000));
                //send respone
                if(req.body.taskOption == 'SGDB'){
                    var over = await ImportGolda.AutoStoreImportSGDB("./public/uploads/" + avatar.name)
                    if(over == "Done"){  
                        over = "🎉🎉🎉 CREATION FICHIER FAITES 🎉🎉🎉"
                        await res.render('pages/golda',{
                            over
                        })
                    }
                    else{
                        over = "😢😢😢  CREATION FICHIER A ECHOUE 😢😢😢"
                        await res.render('pages/golda',{
                            over
                        })
                    }
                }
                if (req.body.taskOption == 'BLOIS'){
                    var over = await ImportGolda.AutoStoreImportBLOIS("./public/uploads/" + avatar.name)
                    
                    if(over == "Done"){  
                        over = "🎉🎉🎉 CREATION FICHIER FAITES 🎉🎉🎉"
                        await res.render('pages/golda',{
                            over
                        })
                    }
                    else{
                        over = "😢😢😢 CREATION FICHIER A ECHOUE 😢😢😢"
                        await res.render('pages/golda',{
                            over
                        })

                    }
                }
            })();
    
        }
    } 
    catch (err) {
        res.status(500).send(err);
    }

})
app.post('/imports', (req,res) => 
{  
	try 
    {
        (async() => {
            if(req.body.typeImport == 'MANUEL')
            {
                console.log("MODE MANUEL")
                 var over = await ImportSQL.Main()
                if (over ==  "Done"){
                    over = "🎉🎉🎉 IMPORT TERMINE 🎉🎉🎉"
                    await res.render('pages/imports',{
                        over
                    })
                }
                else{
                    over = "😢😢😢 L'IMPORT A ECHOUE 😢😢😢"
                    await res.render('pages/imports',{
                        over
                    })
                }
            }
            if (req.body.typeImport == 'TACHE PLANIFIE')
            {
                console.log("TACHE PLANIFIER")
            }
        })();
    } 
    catch (err)
    {
        res.status(500).send(err);
    }
})

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});


const delay = ms => new Promise(res => setTimeout(res, ms));
