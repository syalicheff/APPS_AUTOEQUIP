const mongoose = require('mongoose');
const routes = require("./routes/server") // new

mongoose.connect('mongodb+srv://App_Autoequip:Autoequip94@cluster0.kjbyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const schema = mongoose.Schema({
	PAYS: String,
	CODEAERO: String,
})