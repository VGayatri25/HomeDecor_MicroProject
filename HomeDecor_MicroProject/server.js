const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/HomeDecor',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('HomeDecor')
    app.listen(8080,()=>{
        console.log('Listening at port number 8080')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('Furniture').find().toArray(function(err,result){
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs');
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs');
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('Furniture').insertOne(req.body,(err,result)=>{
        if(err) console.log(err);
    res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
    db.collection('Furniture').find().toArray((err,result)=>{
        if(err) console.log(err);
    for(var i=0;i<result.length;i++)
    {
        if(result[i].id==req.body.id)
        {
            s=result[i].stock
            break
        }
    }
    db.collection('Furniture').findOneAndUpdate({id: req.body.id},{
        $set:{stock: parseInt(s)+parseInt(req.body.stock)}},{sort:{_id:-1}},
        (err,result)=>{
            if(err) return console.log(err)
        //console.log(req.body.id+' stock updated')
        res.redirect('/')
    })
})
})

app.post('/delete',(req,res)=>{
    db.collection('Furniture').findOneAndDelete({id:req.body.id},(err,result)=>{
        if(err) console.log(err)
    res.redirect('/')
    })

})