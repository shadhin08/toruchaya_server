require("dotenv").config();
const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser');


const app = express()
app.use(cors())
app.use(bodyParser.json())
console.log(process.env.PORT, process.env.DB_USER, process.env.DB_PASS)

const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jtktn7s.mongodb.net/?retryWrites=true&w=majority`;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID=require('mongodb').ObjectId;

app.get('/', (req, res) => 
{
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    if(err)
    {
        console.log(err);
    }
    const collection = client.db("plants").collection("all_plants");

    app.get('/plants', (req, res)=>
    {
        collection.find({})
        .toArray( (err, documents)=>
        {
            res.send(documents);
        })
    })

    //--------------------------------TEST----------------------------
    // app.get('/plants/type/:id1/room/:id2/height/:id3', (req, res)=>
    // {
    //     console.log(req.params.id1);
    //     console.log(req.params.id2);
    //     console.log(req.params.id3);
    //     let types=[" ", " "];

    //     const allTypes=req.params.id1.split("+");
    //     for(let i=0;i<allTypes.length;++i) types[i]=allTypes[i];
    //     console.log("Types : ", types);
    //     // collection.find({"plant.categorie": type[0], "plant.categorie": type[1]})
    //     // .toArray((err, documents)=>
    //     // {
    //     //     console.log(documents);
    //     // })

    // }) 
    app.get('/plants-:id', (req, res)=>
    {
        // console.log(req.params.id);
        const cat=req.params.id;
        const allCat=cat.split("+");
        // console.log(allCat[0].toLowerCase(), allCat.length);
        if(allCat.length==1)
        {
            collection.find({"plant.categorie": allCat[0]})
            .toArray((err, documents)=>
            {
                res.send(documents);
            })
        }
        else if(allCat.length==2)
        {
            collection.find({"plant.categorie": allCat[0], "plant.underCategorie": allCat[1][0].toUpperCase()+allCat[1].slice(1)}) //Palms
            .toArray((err, documents)=>
            {
                res.send(documents);
            })
        }
    }) 
    
    //--------------------------------TEST----------------------------

    //-------------------------------INDOOR--------------------------


    // app.get('/plants-indoor', (req, res)=>
    // {
    //     const cat="indoor";
    //     collection.find({"plant.categorie": cat})
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })
    // app.get('/plants-indoor+palms', (req, res)=>
    // {
    //     const cat="indoor";
    //     const plantType="Palms";
    //     collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Palms
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })
    // app.get('/plants-indoor+fern', (req, res)=>
    // {
    //     const cat="indoor";
    //     const plantType="Fern";
    //     collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Fern
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })
    // app.get('/plants-indoor+flowering', (req, res)=>
    // {
    //     const cat="indoor";
    //     const plantType="Flowering";
    //     collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Flowering 
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })
    // app.get('/plants-indoor+hanging', (req, res)=>
    // {
    //     const cat="indoor";
    //     const plantType="Hanging";
    //     collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Hanging
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })
    

    //---------------------------------OUTDOOR-------------------------------


    // app.get('/plants-outdoor', (req, res)=>
    // {
    //     const cat="outdoor";
    //     collection.find({"plant.categorie": cat})
    //     .toArray((err, documents)=>
    //     {
    //         res.send(documents);
    //     })
    // })

    //-------------------------------LOAD SINGLE PLANT---------------------------


    app.get('/plant/:id', (req, res)=>
    {
        // console.log(req.params.id);
        collection.find({_id: ObjectID(req.params.id)})
        .toArray( (err, documents)=>
        {
            
            res.send(documents[0]);
        })
    })

    //----------------------------------UPDATE----------------------------


    app.patch('/update/:id', (req, res)=>
    {
        const product=req.body;
        // console.log(req.params.id);
        const {name, height, categorie, underCategorie, size, price, oldPrice, quantity, image, tags, allImage, lastUpdateDate, lastUpdateTime}=product.plant;
        // console.log(name, height, categorie, underCategorie, size, price, quantity, image, tags);
        
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set:{"plant.name": name, "plant.height": height, "plant.categorie": categorie,"plant.underCategorie": underCategorie,"plant.size": size,"plant.price": price, "plant.oldPrice": oldPrice,"plant.quantity": quantity,"plant.image": image,"plant.tags": tags, "plant.allImage": allImage, "plant.lastUpdateDate":lastUpdateDate, "plant.lastUpdateTime":lastUpdateTime}
        })
        .then(result=>
        {
            console.log("plant update succesfully");
        })
    })


    app.post('/addProduct', (req, res) =>
    {
        // console.log("Recirved", req.body)
        collection.insertOne(req.body)
        .then(res=>
        {
            console.log('new plant added');
        })
    })

    app.delete('/delete/:id', (req, res)=>
    {
        collection.deleteOne({_id: ObjectID(req.params.id)})
        .then(res=>
        {
            console.log("plant deleted succesfully");
        })
    })

    //----------------------------------PROFILE----------------------------
    const userProfile = client.db("toruchaya").collection("toruchaya_user");

    app.get('/user/:uid', (req, res)=>
    {
        console.log(req.params.uid)
        userProfile.find({"profile.userID": req.params.uid})
        .toArray( (err, documents)=>
        {
            // console.log(documents);
            res.send(documents);
        })
    })
    app.post('/addProfile', (req, res) =>
    {
        // console.log("Recirved", req.body)
        userProfile.insertOne(req.body)
        .then(res=>
        {
            console.log('profile added');
        })
    })
    app.patch('/user/update/:uid', (req, res)=>
    {
        console.log(req.body.logdInUser.profile.userID);
        userProfile.updateOne({"profile.userID": req.body.logdInUser.profile.userID},
        {
            $set:{"profile": req.body.logdInUser.profile}
        })
        .then(result=>
        {
            console.log("profile data update succesfully");
        })
    })
});
//----------------------------------PROFILE----------------------------

//----------------------------------Order List----------------------------
const orderList = client.db("toruchaya").collection("toruchaya_orderList");

    app.post('/addOrder', (req, res) =>
    {
        // console.log("Recirved", req.body)
        orderList.insertOne(req.body)
        .then(res=>
        {
            console.log('new order added');
        })
    })

    app.get('/getOrder', (req, res)=>
    {
        console.log(req.params.uid)
        orderList.find()
        .toArray( (err, documents)=>
        {
            // console.log(documents);
            res.send(documents);
        })
    })
//----------------------------------Order List----------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
