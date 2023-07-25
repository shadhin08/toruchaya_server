const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser');


const app = express()
app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 3000;

const uri = "mongodb+srv://sh08:helpme08@cluster0.jtktn7s.mongodb.net/?retryWrites=true&w=majority";
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
    
    //--------------------------------TEST----------------------------

    //-------------------------------INDOOR--------------------------


    app.get('/plants/indoor', (req, res)=>
    {
        const cat="indoor";
        collection.find({"plant.categorie": cat})
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })
    app.get('/plants/indoor/palms', (req, res)=>
    {
        const cat="indoor";
        const plantType="Palms";
        collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Palms
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })
    app.get('/plants/indoor/fern', (req, res)=>
    {
        const cat="indoor";
        const plantType="Fern";
        collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Fern
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })
    app.get('/plants/indoor/flowering', (req, res)=>
    {
        const cat="indoor";
        const plantType="Flowering";
        collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Flowering 
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })
    app.get('/plants/indoor/hanging', (req, res)=>
    {
        const cat="indoor";
        const plantType="Hanging";
        collection.find({"plant.categorie": cat, "plant.underCategorie": plantType}) //Hanging
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })
    

    //---------------------------------OUTDOOR-------------------------------


    app.get('/plants/outdoor', (req, res)=>
    {
        const cat="outdoor";
        collection.find({"plant.categorie": cat})
        .toArray((err, documents)=>
        {
            res.send(documents);
        })
    })

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
        const {name, height, categorie, underCategorie, size, price, quantity, image, tags, allImage}=product.plant;
        // console.log(name, height, categorie, underCategorie, size, price, quantity, image, tags);
        
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set:{"plant.name": name, "plant.height": height, "plant.categorie": categorie,"plant.underCategorie": underCategorie,"plant.size": size,"plant.price": price,"plant.quantity": quantity,"plant.image": image,"plant.tags": tags, "plant.allImage": allImage}
        })
        .then(result=>
        {
            console.log("data update succesfully");
        })
    })


    app.post('/addProduct', (req, res) =>
    {
        // console.log("Recirved", req.body)
        collection.insertOne(req.body)
        .then(res=>
        {
            console.log('data added');
        })
    })

    app.delete('/delete/:id', (req, res)=>
    {
        collection.deleteOne({_id: ObjectID(req.params.id)})
        .then(res=>
        {
            console.log("data deleted succesfully");
        })
    })
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
