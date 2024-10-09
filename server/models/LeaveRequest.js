const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  branch:String,
  year:String,
  sem:String,
  subj: String,
  section:String,
  name: String,
  email:String,
  leaveDate: Date,
  period:String,
  dayName:String,
  startTime:String,
  endTime:String,
  status: { type: String, default: 'Pending' },
  acceptedAt: { type: Date, default: null },
  acceptedBy: String  

});
const LeaveRequest= mongoose.model('LeaveRequest', LeaveRequestSchema);
module.exports = LeaveRequest


// const express = require('express');
// const router = express.Router();
// const LeaveRequest = require('../models/LeaveRequest');
// const nodemailer = require('nodemailer');
// const Register =require('../models/registrations')
// const auth =require('../env.js')

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: auth.EMAIL_USER,
//     pass: auth.EMAIL_PASS,
//   },
// });
// // console.log('Email User:',auth.EMAIL_USER);
// // console.log('Email Pass:', auth.EMAIL_PASS);


// router.post('/', async (req, res) => {
//   const { name,email, branch, facultyId, startDate, endDate, reason } = req.body;

//   try {
//     // Save the leave request to the database
//     const leaveRequest = new LeaveRequest({ name,email, branch, facultyId, startDate, endDate, reason });
//     await leaveRequest.save();

//     // Fetch all users' emails to whom the leave request should be sent
//     const users = await Register.find({}, 'email name');// Replace with the actual user collection
//     const emailAddresses = users.map(user => user.email);


//     const emailMessage = `
//       <h3>Leave Request from ${name}</h3>
//       <p>Reason: ${reason}</p>
//       <p>Start Date: ${startDate}</p>
//       <p>End Date: ${endDate}</p>
//       <p>
//         <a href="http://localhost:5000/api/leave/accept/${leaveRequest._id}">Accept</a> | 
//         <a href="http://localhost:5000/api/leave/decline/${leaveRequest._id}">Decline</a>
//       </p>
//     `;

    

//     // Send the leave request email to all users
//     const emailPromises = emailAddresses.map(email => {
//       return transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'New Leave Request',
//         html: emailMessage,
//       });
//     });

//     // Wait for all emails to be sent
//     await Promise.all(emailPromises);

//     // Respond with a message indicating success
//     res.status(201).json({ message: `Leave request submitted and emails sent to ${emailAddresses.length} users.` });
//   } catch (error) {
//     console.error('Error submitting leave request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// router.get('/accept/:id', async (req, res) => {
//   try {
//     const leaveRequest = await LeaveRequest.findById(req.params.id);
//     if (!leaveRequest) return res.status(404).send('Leave request not found.');

//     leaveRequest.status = 'Accepted';
//     await leaveRequest.save();

//     // Send email to the requester
//     await transporter.sendMail({
//       from: auth.EMAIL_USER,
//       to: leaveRequest.email, // Assuming leaveRequest contains email field
//       subject: 'Leave Request Accepted',
//       html: `<p>Your leave  adjustment request has been accepted by ${req.query.name}.</p>`,
//     });

//     res.send(`Accepted by ${req.query.name}`);
//   } catch (error) {
//     console.error('Error updating leave request:', error);
//     res.status(500).send('Error updating leave request');
//   }
// });

// router.get('/decline/:id', async (req, res) => {
//   try {
//     const leaveRequest = await LeaveRequest.findById(req.params.id);
//     if (!leaveRequest) return res.status(404).send('Leave request not found.');

//     leaveRequest.status = 'Declined';
//     await leaveRequest.save();

//     // Send email to the requester
//     await transporter.sendMail({
//       from: auth.EMAIL_USER,
//       to: leaveRequest.email, // Assuming leaveRequest contains email field
//       subject: 'Leave Request Declined',
//       html: `<p>Your leave adjustment request has been declined by ${req.query.name}.</p>`,
//     });

//     res.send(`Declined by ${req.query.name}`);
//   } catch (error) {
//     console.error('Error updating leave request:', error);
//     res.status(500).send('Error updating leave request');
//   }
// });

// module.exports = router;
