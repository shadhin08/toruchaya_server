const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser');


const app = express()
app.use(cors())
app.use(bodyParser.json())


const port = 3000;

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
    app.get('/plant/:id', (req, res)=>
    {
        // console.log(req.params.id);
        collection.find({_id: ObjectID(req.params.id)})
        .toArray( (err, documents)=>
        {
            
            res.send(documents[0]);
        })
    })
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
