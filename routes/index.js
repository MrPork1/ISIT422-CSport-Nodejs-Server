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
app.post('/NewUser', function(req, res) {

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
module.exports = app;