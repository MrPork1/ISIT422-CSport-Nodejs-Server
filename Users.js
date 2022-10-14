// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Email: {
    type: String,
    required: true
  },
  Fname: {
    type: String,
    required: true
  },
  Lname: {
    type: String,
    required: true
  },
  Role: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Users", UserSchema);