const express = require('express');
const app = express(),
        port = 3000;
        //app.use(require("cors")()) // allow Cross-domain requests 
        app.use(require('body-parser').json()) // When someone sends something to the server, we can recieve it in JSON format


    
      
      app.listen(port, () => {
          console.log(`Server running at http://${port}/`);
      });
// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const appUser = require("../usercollections");
const appUser2 = require("../classcollections");
const { application } = require('express');

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =
  //"mongodb+srv://someone:somepw@somecluster.mongodb.net/ToDosDB?retryWrites=true&w=majority";
  "mongodb+srv://iluvjuntae:somuch@haleynisit420.cj3rn.mongodb.net/CSportsDB?retryWrites=true&w=majority";


//mongoose.set('useFindAndModify', false);

const options = {
  maxPoolSize: 50, 
  wtimeoutMS: 2500,
  useNewUrlParser: true
}

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);
/* GET all users . */
app.get('/usercollections', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  appUser.find({}, (err, AllUsers) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllUsers);
    res.status(200).json(AllUsers);
  });
});
/* post a new User and push to Mongo */
app.post('/userscollection', function(req, res) {

  let oneNewUser = new Users(req.body);  
  console.log(req.body);
  oneNewUser.save((err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(user);
    res.status(201).json(user);
    }
  });
});

// delete one User
// _id is the id genterated for the user
app.delete('/DeleteUser/:id', function (req, res) {
  appUser.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "User successfully deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one User
app.put('/EditUser/:id', function (req, res) {
  var which = (req.body).id;   // get the -id from the object passed up, ignore rest of it
  appUser.findOneAndUpdate(
    { _id: which },  
    { Birthday: "00/00/00" },   // ignore the value of the User's Birthday, just force it to 00/00/00
    (err, user) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(user);
    })
  });

/* GET all classes . */
app.get('/classcollections', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  appUser2.find({}, (err, AllClass) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllClass);
    res.status(200).json(AllClass);
  });
});
/* post a new Class and push to Mongo */
app.post('/classcollections', function(req, res) {

  let oneNewClass = new Class(req.body);  
  console.log(req.body);
  oneNewClass.save((err, clas) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(clas);
    res.status(201).json(clas);
    }
  });
});


// delete one Class
app.delete('/DeleteClass/:CID', function (req, res) {
  appUser2.deleteOne({ CID: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Class successfully deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one Class
app.put('/EditClass', function (req, res) {
  var which = (req.body).CID;   // get the -CID from the object passed up, ignore rest of it
  appUser2.findOneAndUpdate(
    { CID: which },  
    { Stime: "2:16 PM" },   // ignore the value of the object's Start Time, just force it to 2:16 PM
    (err, clas) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(clas);
    })
  });

module.exports = app;

