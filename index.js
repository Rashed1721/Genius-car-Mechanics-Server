const express = require('express');
const cors = require('cors')
const objectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.Port || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fyera.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('carMechanic')
        const servicesCollection = database.collection('services');


        //GET  all data API
        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services);
        })

        //GET SINGLE data api
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specif id', id)
            const query = { _id: objectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(JSON.stringify(service))
        })

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)

            const result = await servicesCollection.insertOne(service);
            res.send(JSON.stringify(result))
            console.log(result)
        })

        //delete api
        app.delete('/service/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: objectId(id) }
            console.log(query)
            const result = await servicesCollection.deleteOne(query);
            res.send(JSON.stringify(result))
            console.log('delete hitted', id)
        })
    }
    finally {
        //    await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running genius car')
});

app.listen(port, () => {
    console.log('Running Genius server on port', port)
})