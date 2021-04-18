const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
require('dotenv').config()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ar51s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("adminList");
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    app.post('/adminList', (req, res) => {
      const adminEmail = req.body
      adminCollection.insertOne(adminEmail)
      .then(result => {
        console.log(result)
      })
      console.log(adminEmail);
    })
    app.post('/isAdmin', (req,res) => {
      const email = req.body.email
      adminCollection.find({email: email})
      .toArray((err, admin) => {
        res.send(admin.length > 0)
      })
    })

    app.post('/addServices', (req, res) => {
      const product = req.body;
      serviceCollection.insertOne(product)
      .then(result => {
          res.send('Data Loaded Successfully')
      })
    })
    app.get('/services', (req, res) => {
      serviceCollection.find({})
      .toArray((err,document) => {
        res.send(document)
      })
    })
    app.post('/addReviews', (req, res) => {
      const product = req.body;
      reviewsCollection.insertOne(product)
      .then(result => {
        console.log(result)
      })
    })
    app.get('/reviews', (req, res) => {
      reviewsCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
    })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})