require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {Schema } = mongoose;
mongoose.connect(process.env.MONGO_URI);

let entry;
const SchemaUrl = new Schema({
  original_url: String,
  short_url: Number
});
entry = mongoose.model("entry", SchemaUrl);



// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/shorturl', async (req, res) => {
  
    const { url } = req.body;
    let shortUrlNum = Math.floor(Math.random() * 100000);
    if (url.slice(0, 7) === "http://") {
      let newEntry = new entry({original_url: url, short_url: shortUrlNum});
  
      try {
       const user = await newEntry.save();
        res.json(user);
      } catch(err) {
        console.log(err);
      }
    } else {
      res.json({error: 'invalid url'});
    }
    
  
  });


app.get("/api/shorturl/:hash", async (req, res) => {
  
  if ((req.params.hash !== undefined) && (req.params.hash !== "undefined") ) {
    let inputNum = Number(req.params.hash);
    let URLentries = await entry.findOne({ short_url: inputNum}).exec();
    
    Object.keys(URLentries).forEach(function (value) {

      console.log(URLentries[value]);
    });
    res.redirect(URLentries.original_url);
  } else {
    res.send({error: 'invalid url'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
