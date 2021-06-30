const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chatapp:chatappone@cluster0.o44ds.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

//Schema
const Schema = mongoose.Schema;

const UserSchema =  new Schema({
    username: String,
    email: String,
    password:String,
    image:String,
    contacts:[{ name: String,isMuted:Boolean,isBlocked:Boolean}]
});

//Model
var Userdata = mongoose.model('userdata',UserSchema);

module.exports = Userdata;