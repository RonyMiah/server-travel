const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

// middle Ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j8vgw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async  function run (){

    try{
        await client.connect();
        
        const database = client.db("Travel");
        const servicesCollection = database.collection("Services");

// Get Singel service 

        app.get('services/:id' , async(req , res)=>{
            const id = req.params.id;
            console.log('getting data ' , id);
            const ObjectId = require ('mongodb').ObjectId;
            const query = {_id: ObjectId(id)} ;
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



     // Get API 

     app.get('/services',async (req , res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray()
        res.json(services);

        /// json change korse 
        
     })

    //Post Api 
        app.post('/services' ,async(req , res)=>{
            const service = req.body ;
           
            console.log('Hitted The post ',service);
            res.send('Hitted The post 1111111  ');

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);

        });

      


    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir)




// console.log(uri);

app.get('/', (req,res)=>{
    res.send('Runing My Curd Server')
});
app.listen(port , ()=>{
    console.log('Lisning Port ', port);
})