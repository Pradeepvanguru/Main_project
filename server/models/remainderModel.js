
const mongoose = require('mongoose');

// const remainderSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   subjectName: { type: String, required: true },
//   whichPeriod: { type: Number, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   facultyAccepting: { type: String }, // Name of faculty who accepts the request
//   status: { type: String, default: 'pending' }, // Status: pending, accepted, rejected
//   year: { type: Number, required: true },
//   semester: { type: Number, required: true },
//   isExpired: { type: Boolean, default: false }, // To check if the mail expired
//   createdAt: { type: Date, default: Date.now }
// });
  
  const remainderSchema = new mongoose.Schema({
    branch:String,
    year:String,
    sem:String,
    status: { type: String, default: 'Pending' },
    requesterEmail: { type: String, required: true },
    acceptedUserEmail: { type: String, required: true }
  });
 
  const Remainder = mongoose.model('Remainder', remainderSchema);
  
  module.exports = Remainder;
  