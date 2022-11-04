const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("../firebaseAccountKey.json");
const app = express(),
        port = 3000;
        //app.use(require("cors")()) // allow Cross-domain requests 
        app.use(require('body-parser').json()) // When someone sends something to the server, we can recieve it in JSON format


    
      
      app.listen(port, () => {
          console.log(`Server running at http://${port}/`);
      });
// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
app.use((req, res, next) => 
{ res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");    
  next();
});

const adminHere = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

// Delete one User from mongoDB and Firebase
app.delete('/DeleteUser2/:UID', function (req, res) {
  let uidHere = req.params.UID;
  appUser.deleteOne({ UID: req.params.UID }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    } else {
      adminHere.auth().deleteUser(uidHere)
      .then(() => {
        console.log("Deleted user from firebase!");
      })
      .catch((error) => {
        console.log("Problem with deleting user from firebase", error);
      });
    }
  });
});

/* GET one user . */
app.get('/GetOneUser/:UID', function(req, res) {
  // find { 9239290210} works but not just UID
  
  appUser.find({UID: req.params.UID}, (err, OneUser) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(OneUser);
    res.status(200).json(OneUser);
  });
});
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

  let oneNewUser = new appUser(req.body);  
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
app.delete('/DeleteUser/:_id', function (req, res) {
  appUser.deleteOne({ _id: req.params._id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "User successfully (maybe) deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one User
app.put('/EditUser', function (req, res) {
  var which = (req.body).UID;   // get the -id from the object passed up, ignore rest of it
  appUser.findOneAndUpdate(
    { UID: which },  
    { 
      
    Fname: req.body.Fname, //req=requires body=html from angular Fname=first name info from angular
    Lname: req.body.Lname,
    ClassIDList: req.body.ClassIDList,
    ClassHistory:req.body.ClassHistory ,
    Birthday: req.body.Birthday,
    Email:  req.body.Email,
    Role: req.body.Role,
    AdminNotes:req.body.AdminNotes },   // ignore the value of the User's Birthday, just force it to 00/00/00
    (err, user) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(user);
    })
  });
/* GET one class . */
app.get('/GetOneClass/:_id', function(req, res) {
  // for some reason _id would not work, maybe b/c 
  //currently the _id's are random and not uniform 10/27 HN
  appUser2.find({_id: req.params._id }, (err, OneClass) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(OneClass);
    res.status(200).json(OneClass);
  });
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

  let oneNewClass = new appUser2(req.body);  
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
// since we are taking the info from the params we need to pass the _id in the URl
app.delete('/DeleteClass/:_id', function (req, res) {
  appUser2.deleteOne({ _id: req.params._id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Class successfully (maybe) deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one Class
app.put('/EditClass', function (req, res) {
  var which = (req.body)._id;   // get the -_id from the object passed up, ignore rest of it
  appUser2.findOneAndUpdate(
    { _id: which },  
    {   
    Name: req.body.Name,
    Descript: req.body.Descript,
    STime: req.body.STime,
    ETime: req.body.ETinme,
    Date:req.body.Date ,
    ClassSeats: req.body.ClassSeats},   // ignore the value of the object's Start Time, just force it to 2:16 PM
    (err, clas) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(clas);
    })
  });

module.exports = app;

