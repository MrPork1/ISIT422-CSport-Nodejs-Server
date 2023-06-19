var express = require('express');
var router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require("../firebaseAccountKey.json");

const adminHere = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  
});

//Make sure to comment this out before deploying! Lines 13-18
// router.use((req, res, next) => 
// { res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");    
//   next();
// });

const mongoose = require("mongoose");

const appUser = require("../UserCollections");
const appUser2 = require("../ClassCollections");
const appUser3 = require("../TransactionCollection");
const { application } = require('express');

const dbURI = "mongodb+srv://Ironman:DsKn1S5YFvqRiGkA@seansmaincluster.ulkp95p.mongodb.net/";

const options = {
  maxPoolSize: 50, 
  wtimeoutMS: 2500,
  useNewUrlParser: true,
  //reconnectTries: Number.MAX_VALUE,
  //poolSize: 10
};

var connected = false;

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
    connected = true;
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

/* GET Connection Status from MongoDB */
router.get('/ConnectionStatus', function(req, res) {
  if (connected) {
    res.status(200).json("Connected!");
  } else{
    res.status(200).json("Failed to connect to Mongo!");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Delete one User from mongoDB and Firebase
router.delete('/DeleteUser2/:UID', function (req, res) {
  let uidHere = req.params.UID;
  appUser.deleteOne({ UID: req.params.UID }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    } else {
      adminHere.auth().deleteUser(uidHere)
      .then(() => {
        console.log("Deleted user from firebase!");
        res.status(200).json({ message: "User successfully (maybe) deleted" });
      })
      .catch((error) => {
        console.log("Problem with deleting user from firebase", error);
      });
    }
  });
});

/* GET one user . */
router.get('/GetOneUser/:UID', function(req, res) {
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
router.get('/usercollections', function(req, res) {
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
router.post('/userscollection', function(req, res) {

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
router.delete('/DeleteUser/:UID', function (req, res) {
  appUser.deleteOne({ UID: req.params.UID }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "User successfully (maybe) deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one User
router.put('/EditUser', function (req, res) {
  var which = (req.body).UID;   // get the -id from the object passed up, ignore rest of it
  appUser.findOneAndUpdate(
    { UID: which },  
    { 
      
    Fname: req.body.Fname, //req=requires body=html from angular Fname=first name info from angular
    Lname: req.body.Lname,
    ClassIDList: req.body.ClassIDList,
    ClassHistory:req.body.ClassHistory ,
    TransactionHistory:req.body.TransactionHistory,
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
router.get('/GetOneClass/:_id', function(req, res) {
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
router.get('/classcollections', function(req, res) {
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
router.post('/classcollections', function(req, res) {

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
router.delete('/DeleteClass/:_id', function (req, res) {
  appUser2.deleteOne({ _id: req.params._id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Class successfully (maybe) deleted" });
  });
});

// Make Mongoose use `findOneAndUpdate()`. 
// update one Class
router.put('/EditClass', function (req, res) {
  var which = (req.body)._id;   // get the -_id from the object passed up, ignore rest of it
  appUser2.findOneAndUpdate(
    { _id: which },  
    {   
    Name: req.body.Name,
    Descript: req.body.Descript,
    STime: req.body.STime,
    ETime: req.body.ETinme,
    Date:req.body.Date ,
    ClassSeats: req.body.ClassSeats,
    Price: req.body.Price},   // ignore the value of the object's Start Time, just force it to 2:16 PM
    (err, clas) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(clas);
    })
  });

  /* post a new Transaction and push to Mongo */
router.post('/transactioncollection', function(req, res) {

  let oneNewPayment = new appUser3(req.body);  
  console.log(req.body);
  oneNewPayment.save((err, transaction) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(transaction);
    res.status(201).json(transaction);
    }
  });
});

/* GET all Transactions . */
router.get('/transactioncollections', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  appUser3.find({}, (err, AllTransaction) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllTransaction);
    res.status(200).json(AllTransaction);
  });
});
  // delete one Transaction
  // since we are taking the info from the params we need to pass the _id in the URl
  router.delete('/DeleteTransaction/:_id', function (req, res) {
    appUser3.deleteOne({ _id: req.params._id }, (err, note) => { 
      if (err) {
        res.status(404).send(err);
      }
      res.status(200).json({ message: "Transaction successfully (maybe) deleted" });//will post just b/c the file was ran
    });
  });

    // delete All Transaction
  // since we are taking the info from the params we need to pass the _id in the URl
  router.delete('/DeleteAllTransactions', function (req, res) {
    appUser3.deleteMany({}, (err, note) => { 
      if (err) {
        res.status(404).send(err);
      }
      res.status(200).json({ message: "All Transaction successfully (maybe) deleted" });//will post just b/c the file was ran
    });
  });
  
  // Make Mongoose use `findOneAndUpdate()`. 
  // update one Transaction
  // This code changes the status to paid after a transaction (will be more useful when we change to month to month)
  router.put('/EditTransaction', function (req, res) {
    var which = (req.body)._id;   // get the -_id from the object passed up, ignore rest of it
    appUser3.findOneAndUpdate(
      { _id: which },  
      {   
      PStatus: req.body.PStatus,
      },   
      (err, trans) => {
        if (err) {
          res.status(500).send(err);
      }
      res.status(200).json(trans);
      })
    });

module.exports = router;
