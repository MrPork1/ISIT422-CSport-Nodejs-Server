// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  CID:{
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Descript: {
    type: String,
    required: true
  },
  STime: {
    type: String,
    required: true
  },
  ETime: {
    type: String,
    required: true
    
  },
  Date: {
    type: String,
    required: true
  },
  ClassSeats: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model("classcollections", ClassSchema);