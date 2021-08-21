var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const ejs = require('ejs');
var ObjectId = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));
const path = require("path")
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));

mongoose.connect('mongodb+srv://userShahd:shahd@testcluster.vcl9u.mongodb.net/MongoDatabase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var gender = req.body.gender;
    var address = req.body.address;
    var date = req.body.date;
    var email = req.body.email;

    var data = {
        "name": name,
        "gender": gender,
        "address": address,
        "date": date,
        "email" : email
    };

    db.collection('persons').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    res.redirect("/");

})

const note = mongoose.model('Persons', {
    name: String,
    gender: String,
    address: String,
    date: String,
    email: String
});


const hobbyRecord = new mongoose.model('personshobbies', {
    personid: String,
    hobby: String
});

// app.get("/",(req,res)=>{
//     note.find({}, function(err, records){
//         console.log("got here");
//         res.render('index', {
//             recordsList: records
//         });
//     });

// });



// app.get("/",(req,res)=>{
//     note.find({}, function(err, hobbies){
//         res.render('index', {
//             hobbiesList: hobbies
//         });
//     });
// });

app.get("/", (req, res)=>{
    note.find({

    }).then(function(dbRecords){
        hobbyRecord.find({

        }).then(function(dbHobbies){
            var dbStuff = {
                dbRecords,
                dbHobbies
            };
            res.render('index', {
                everything: dbStuff
            });
        })
    })
});


app.post("/del", (req, res)=>{
    db.collection('persons').findOneAndDelete({}, {sort: {_id: -1}});
    res.redirect("/");
});

app.post("/cv", (req, res)=>{
    res.sendFile(__dirname+ "/cv.html");
});

app.post("/delAll", (req, res)=>{
    db.collection('persons').deleteMany();
    res.redirect("/");
});


app.post("/check", (req, res)=>{
    var arr = req.param("checks");
    for (i = 0; i < arr.length; i++) {
        db.collection('persons').deleteOne({_id: new ObjectId(arr[i])});
    } 
    res.redirect("/");
});

app.listen(4000, function(){
    console.log("Server is running");
});

