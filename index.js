var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = (process.env.PORT || 3000);
var BASE_API_PATH = '/api/v1';
//var DB_FILE_NAME = __dirname + "/contacts.json";

var app = express();
app.use(bodyParser.json());

var db = new DataStore({
    //filename: DB_FILE_NAME,
    autoload: true});

app.get('/', (req, res)=> res.send('Hola mundo!'));
app.get(BASE_API_PATH + '/contacts', (req,res) => {
    console.log(Date() + " - GET /contacts");
    db.find({}, function(err, record) {
        if (err) {
            console.error(err);
        }
        res.send(record);
    });
});

app.post(BASE_API_PATH + '/contacts', (req,res)=> {
    console.log(Date() + " - POST /contacts");
    var contact = req.body;
    db.insert(contact, function(err, record){
        if (err) {
            console.error(err);
            res.sendStatus(400); // Hubo algún problema
            return;
        }else{
            res.sendStatus(201); // Todo fue bien
        }
    });
});

app.delete(BASE_API_PATH + '/contacts', (req, res)=>{
    console.log(Date() + " - DELETE /contacts");
    db.remove({}, { multi: true }, function(err, record){
        if(err){
            console.error(err);
            return;
        }else{
            res.sendStatus(204); // No content
        }
    });
});

app.get(BASE_API_PATH + '/contact/:id', (req,res)=>{
    console.log(Date() + " - GET /contact");
    var contact_id = req.params.id;
    db.find({_id:contact_id}, function(err, record){
        if(err){
            console.error(err);
            return;
        }else{
            res.send(record);
        }
    });
});

app.put(BASE_API_PATH + '/contact/:id', (req,res)=>{
    console.log(Date() + " - PUT /contact");
    var contact_id = req.params.id;
    var new_name = req.body.name;
    var new_phone = req.body.phone;
    db.update({_id:contact_id}, {$set: {name: new_name, phone:new_phone}}, {}, function(err, num){
        if(err){
            console.error(err);
            return;
        }else{
            db.find({_id:contact_id}, function(err, result) {
                if (err) {
                    console.error(err);
                    return;
                }
                res.send(result);
            });
        }
    });
});

app.delete(BASE_API_PATH + '/contact/:id', (req,res)=>{
    console.log(Date() + " - DELETE /contact");
    var contact_id = req.params.id;
    db.remove({_id:contact_id}, function(err, numberDeleted){
        if(err){
            console.error(err);
            return;
        }else{
            res.sendStatus(204); // No content
        }
    });
});

app.listen(port,() => console.log(`Aplicacion holamundo escuchando en el puerto ${port}`));