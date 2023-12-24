const mongoose = require('mongoose');

const idCardSchema = new mongoose.Schema({
  IdentificationNumber: {
    type: String,
  },
  Name: {
    type: String,
  },
  LastName: {
    type: String,
  },
  DOB: {
    type: String,
  },
  DataOfIssue: {
    type: String,
  },
  DateOfExpiry: {
    type: String,
  },
  success: {
    type: Boolean,
    default: true, // You can set the default value based on your requirements
  },
  error:{
    type: String
  },
  timeStamp:{
    type: String,
    required:true,
  }
});

const IDCard = mongoose.model('IDCard', idCardSchema);

module.exports = IDCard;
