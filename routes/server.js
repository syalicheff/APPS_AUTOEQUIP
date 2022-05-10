const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const ImportGolda = require('../apps/Golda.js')
const bodyParser = require("body-parser");
const ImportSQL = require('../apps/IMPORTS/main.js')
const session = require('express-session')
const AppMagasin = require('../apps/MAGASIN/AppMagasin.js')
const TypeFacturation = require('../apps/MAGASIN/getTransfType.js')
const sqlConfig = require('../apps/MAGASIN/database.js')
var path = require('path');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://App_Autoequip:Autoequip94@cluster0.kjbyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const schema = mongoose.Schema({
	PAYS: String,
	CODEAERO: String,
})
const Pays =  mongoose.model('pays',schema);


const port = process.env.PORT || 8000;
app.set('view engine', 'ejs')


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// On définit un dossier public pour mettre nos différents assets ( Bannierre, CSS , Snippets ,Doc )
app.use(express.static(path.join(__dirname, '../public')));
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
app.get('/magasin',  async (req, res) => {  
        AppMagasin.RequiredDatas().then(Data =>{
            res.render('pages/magasin',
            {
                datas: Object.values(Data),
            });
        })
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
                var principal = ["Sans"]
                if (req.body.principal)
                {
                    principal = req.body.principal
                }
                console.log(principal)
                console.log("MODE MANUEL")
                var over = await ImportSQL.Main(principal)
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
var transfoData = []
app.post('/getFactype', async (req,res) =>{
    transfoData = req.body.tabData
    TypeFacturation.typeTransf(req.body.Fournisseur).then(facType =>{
        res.send(Object.values(facType))
    })
})
app.get('/AeroPays', async (req,res) =>{
    const pays = await Pays.find()
    console.log(pays)
    await res.send(Object.values(pays))
})
app.post('/AeroPays', async (req,res) =>{
    //await Pays.deleteMany({})
    console.log(req.body.pays)
    await res.send('Done')
    // Pays.insertMany(arr, function(error, docs) {});
    
})

app.post('/transformer',  async (req, res) => {  
    console.log(req.body)
    AppMagasin.Transformer(req.body,transfoData)
    await res.send('Done')

    // AppMagasin.RequiredDatas().then(Data =>{
    //     res.render('pages/magasin',
    //     {
    //         datas: Object.values(Data),
    //     });
    // })
});



app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});
module.exports = app

const delay = ms => new Promise(res => setTimeout(res, ms));
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
