const express = require('express');
const { defaultMaxListeners } = require('stream');
var router = express.Router();
var publicDir = require("path").join(__dirname,'/public');
router.use(express.static(publicDir));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoalamoa:hoalatao@cluster0-0dgyl.azure.mongodb.net/test";



router.get('/',async (req,res)=>{   
    let client = await MongoClient.connect(url);
    let dbo = client.db("asmdb");
    let result = await dbo.collection("products").find({}).toArray();
    res.render('index',{products:result});
});
router.get('/delete',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmdb");
    await dbo.collection("products").deleteOne(condition);
    
    res.redirect('/');
});
router.get('/insert',async(req,res)=>{
    res.render('insertProduct');
});
router.post('/doInsert',async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmdb");
    let nameValue = req.body.txtName;
    let priceValue = req.body.txtPrice;
    let colorValue = req.body.txtColor;

    if(colorValue!="Green"||colorValue!="Yellow"||colorValue!="Blue"){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('color should be one of 3 type: Green, Blue or Yellow!');
    }
    else{
    let newProduct = {name : nameValue, price : priceValue,color:colorValue};
    await dbo.collection("products").insertOne(newProduct);
    console.log(newProduct);
    // let results = await dbo.collection("products").find({}).toArray();
    // res.render('index',{products:results});
    res.redirect('/');  
    }
});
router.get('/update',async(req,res)=>
{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID; 
    let cliet = await MongoClient.connect(url);
    let dbo = cliet.db('asmdb');
    let result = await dbo.collection("products").findOne({'_id' : ObjectID(id)});
    res.render('updateProduct',{products:result});
})
router.post('/doUpdate', async(req,res)=>{
    let id = req.body.id;
    let nameValue = req.body.txtName;
    let priceValue = req.body.txtPrice;
    let colorValue = req.body.txtColor;
    
    let newValues ={$set : {name: nameValue,price:priceValue,color:colorValue}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("asmdb");
    await dbo.collection("products").updateOne(condition,newValues);
    //
    // let results = await dbo.collection("products").find({}).toArray();
    // res.render('index',{products:results});
    res.redirect('/');
});



module.exports = router;