const express = require('express')
const app = express();
const path = require('path')
const methodOverride = require('method-override')
const {v4: uuid} = require('uuid');
uuid();

const axios = require('axios')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const Punk = require('./models/punk')
mongoose.connect('mongodb://localhost:27017/punksApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("CONNECTION OPEN!! HERE WE ARE!")
})
.catch(err => {
  console.log("ERROR!");
  console.log(err);
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('punks/home')
})

app.get('/punks', async (req, res) => {
  const punks = await Punk.find({ranking: {$lte: 100}})
  res.render('punks/index', {punks})
})

app.post('/punks', async (req, res) => {
  console.log(req.body)
  const punk = new Punk(req.body);
  await punk.save();
  console.log(punk);
  res.redirect(`/punks/id/${punk.id}`)
})

app.get('/punks/new', async (req, res) => {
  res.render('punks/new')
})

app.get('/punks/id/:id/edit', async (req, res) => {
  const {id} = req.params
  const punk = await Punk.findOne({id: id})
  res.render('punks/edit', {punk})
})

app.get('/punks/:attribute', async (req, res) => {
  const {attribute} = req.params
  console.log(attribute);
  const punks = await Punk.find({attributes: attribute})
  console.log(punks)
  res.render('punks/index', {punks})
})

app.get('/punks/id/:id', async (req, res) => {
  const {id} = req.params
  const punk = await Punk.findOne({id: id})
  let purchaseData = await axios.post('https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks', {
    query: `
    {
      purchases(where: {punk: "${id}"}) {
        id
        punk {
          id
        }
        seller
        buyer {
          id
        }
        amount
        transaction {
          id
        }
      }
    }
    `
  });
  let resData = purchaseData.data.data;
  console.log(resData);
  res.render('punks/show', {punk, resData});
})

const purchases = async function(id){
  let resData = {}
  await axios.post('https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks', {
    query: `
    {
      purchases(where: {punk: "${id}"}) {
        id
        punk {
          id
        }
        seller
        buyer {
          id
        }
        amount
        transaction {
          id
        }
      }
    }
    `
  })
  .then((graphRes) => {
    console.log(graphRes.data.data)
    return graphRes.data.data
  })
  .catch((error) => {
    console.error(error)
    return error
  })
}


app.patch('/punks/id/:id', async (req, res) =>{
  const {id} = req.params
  console.log(req.body.on_sale)
  if (req.body.on_sale === 'on'){
    req.body.on_sale = true
  } else {
    req.body.on_sale = false
  }
  const punk = await Punk.findOneAndUpdate({id: id} , req.body,{runValidators: true, new: true})
  res.redirect(`/punks/id/${punk.id}`)
})

app.delete('/punks/id/:id', async (req, res) =>{
  const {id} = req.params
  const punk = await Punk.findOneAndDelete({id: id})
  res.redirect('/punks')
})

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000")
})
