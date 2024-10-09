const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const leaveRoutes = require('./routes/leave');
const Registers = require('./models/registrations'); // Ensure you're using the correct model
const LeaveRequest = require('./models/LeaveRequest');
const  remainderRoutes= require('./models/remainderModel')
require('dotenv').config();
const cron = require('node-cron');

const app = express();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/leave', leaveRoutes);
app.use('/api/remainder', remainderRoutes); 

// API endpoint to fetch details by email  
app.get('/api/registers/:email', async (req, res) => {
  try {
    const email = req.params.email;  // Fetch the email from the request parameters
    // console.log(`Fetching details for email: ${email}`);  // Log to check if email is being passed correctly

    const userDetails = await Registers.findOne({ email }, 'name subj year sem');  // Use the correct model (Registers)

    if (userDetails) {
      res.json(userDetails);  // Send back the user details if found
    } else {
      res.status(404).json({ message: 'User not found' });  // Return 404 if no user found
    }
  } catch (err) {
    res.status(500).json({ message: err.message });  // Handle any other errors
  }
});

// Registration route
app.post("/registers", async (req, res) => {
  const { year, sem, subj, email, name,section,branch } = req.body;
  const newRegistration = new Registers({ year, sem, email, name, subj,section,branch });
  await newRegistration.save()
    .then(() => {
      console.log("Data saved to the database");
      res.status(200).send("Data saved successfully");
    })
    .catch(err => {
      console.error("Error saving data:", err);
      res.status(500).send("Failed to save data");
    });
});

// Delete "Pending" records at 11:59 PM daily
cron.schedule('59 23 * * *', async () => {
  try {
    const result = await LeaveRequest.deleteMany({ status: 'Pending' });
    console.log(`${result.deletedCount} pending leave requests were deleted.`);
  } catch (err) {
    console.error('Error deleting pending leave requests:', err);
  }
}, {
  timezone: "Asia/Kolkata"
});

// Delete "Accepted" records older than 3 days daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const result = await LeaveRequest.deleteMany({
      status: 'Accepted',
      acceptedAt: { $lte: threeDaysAgo }
    });

    console.log(`${result.deletedCount} accepted leave requests were deleted.`);
  } catch (err) {
    console.error('Error deleting accepted leave requests:', err);
  }
}, {
  timezone: "Asia/Kolkata"
});

console.log('Scheduled tasks are running...');



// API to fetch faculty names based on email
// app.post('/api/getFacultyNames', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const facultyMembers = await Registers.find({ email });

//     if (facultyMembers.length > 0) {
//       const facultyNames = facultyMembers.map(faculty => faculty.name);
//       res.status(200).json({ facultyNames });
//     } else {
//       res.status(404).json({ message: 'No faculty members found for the given email' });
//     }
//   } catch (error) {
//     console.error('Error fetching faculty names:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
app.post('/api/getFacultyData', async (req, res) => {
  const { email, branch, sem, year } = req.body;

  try {
    // Query your database to get all matching faculty data based on the criteria
    const facultyData = await Registers.find({ email, branch, sem, year });

    if (facultyData.length > 0) {
      // Map the facultyData to get unique subjects and sections
      const subjects = new Set();  // Using Set to avoid duplicates
      const sections = new Set();  // Using Set to avoid duplicates

      facultyData.forEach(faculty => {
        if (Array.isArray(faculty.subj)) {
          faculty.subj.forEach(subject => subjects.add(subject));
        } else {
          subjects.add(faculty.subj);
        }

        if (Array.isArray(faculty.section)) {
          faculty.section.forEach(section => sections.add(section));
        } else {
          sections.add(faculty.section);
        }
      });

      // Return unique subjects and sections
      res.json({
        name: facultyData[0].name, // You can return the name of the first matching faculty
        subjects: Array.from(subjects), // Convert Set back to array
        sections: Array.from(sections),   // Convert Set back to array
      });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});



// const express = require('express');  
// const router = express.Router();  
// const LeaveRequest = require('../models/LeaveRequest'); // Ensure this is the correct model  
// const nodemailer = require('nodemailer');  
// const Register = require('../models/registrations'); // Ensure this is the correct model  
// const auth = require('../env.js');  
// // const { format } = require('date-fns'); // Date formatting library  

// // Configure Nodemailer transporter  
// const transporter = nodemailer.createTransport({  
//   service: 'gmail',  
//   auth: {  
//     user: auth.EMAIL_USER,  
//     pass: auth.EMAIL_PASS,  
//   },  
// });  
// function formatDate(date) {
//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, '0');
//   const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//   const year = String(d.getFullYear()).slice(-2); // Get last two digits of year
//   return `${day}/${month}/${year}`;
// }

 

// // Helper function to send an email  
// const sendEmail = async (to, subject, html) => {  
//   return transporter.sendMail({  
//     from: auth.EMAIL_USER,  
//     to,  
//     subject,  
//     html,  
//   });  
// };  

// // Route to submit a leave request  
// router.post('/', async (req, res) => {  
//   const { year, sem, name, email, subj,leaveDate ,period, dayName, startTime,endTime,branch,section} = req.body;  

//   try {  
//     const leaveRequest = new LeaveRequest({ name, email, sem, year, leaveDate, period, subj, dayName, startTime,endTime,branch,section });  
//     await leaveRequest.save();  
    
//     const users = await Register.find({ email: { $ne: email }, sem, year,section,branch }, 'email');  
//     const emailAddresses = users.map(user => user.email);  

//     const formattedLeaveDate = formatDate(leaveDate);

//     const emailMessage = `
//     <div style="display:flex;align-items:center;justify-content:center; color:white; background-color:blue; border:2px solid yellow; border-radius:3rem;">
//       <div style="padding:20px;margin:15px;">
//         <h1 style="color:white; padding:8px; border-radius:3rem;">Class_Adjustment_Request from __<b style="color:yellow; font-size:25px; padding:3px;">${name}</b>...!!</h1>
//         <table style="font-size:18px; color:white; width:100%;">
//            <tr>
//             <td>branch</td>
//             <td><b>: ${branch} year</b></td>
//           </tr>
//           <tr>
//           <tr>
//             <td>Year</td>
//             <td><b>: ${year} year</b></td>
//           </tr>
//           <tr>
//             <td>Semester</td>
//             <td><b>: ${sem} sem</b></td>
//           </tr>
//           <tr>
//            <tr>
//             <td>Section</td>
//             <td><b>: ${section} year</b></td>
//           </tr>
//           <tr>
//             <td>Subject Name</td>
//             <td><b>: ${subj}</b></td>
//           </tr>
//           <tr>
//             <td>Which Period</td>
//             <td><b>: ${period}</b></td>
//           </tr>
//           <tr>
//             <td>Period Timings</td>
//             <td><b>: ${startTime}</b> To <b>${endTime}</b></td>
//           </tr>
//           <tr>
//             <td>Date of Class Adjustment</td>
//             <td><b style="font-size:18px; color:white;">: ${formattedLeaveDate}</b> On <b>${dayName}</b></td>
//           </tr>
//         </table><br>
//         <p>  
//           <a href="http://localhost:5000/api/leave/accept/${leaveRequest._id}?acceptingEmail={{userEmail}}"   
//              style="margin:20px;padding: 14px; background-color: green; font-size:18px; color: white; text-decoration: none;border:2px solid yellow;">Accept</a>  
//           <a href="http://localhost:5000/api/leave/reject/${leaveRequest._id}?rejectingEmail={{userEmail}}"   
//              style="margin:20px;padding: 14px; font-size:18px; background-color: red; color: white; text-decoration: none;border:2px solid yellow;">Reject</a>  
//         </p>
//       </div>
//     </div>`;
    
    
    

//     await Promise.all(emailAddresses.map(userEmail =>   
//       sendEmail(userEmail, 'New Class_Adjustment-Request_1', emailMessage.replace('{{userEmail}}', userEmail))  
//     ));  

//     res.status(201).json({ message: `Request submitted and notifications sent to ${emailAddresses.length} users.` });  
//   } catch (error) {  
//     console.error('Error submitting leave request:', error);  
//     res.status(500).json({ error: 'Internal Server Error' });  
//   }  
// });  

// // Route to accept a leave request  
// router.get('/accept/:id', async (req, res) => {  
//   try {  
//     const leaveRequest = await LeaveRequest.findById(req.params.id);  
//     if (!leaveRequest) return res.status(404).send('Class Adjustment Request not found.');  

//     if (leaveRequest.status === 'Accepted') {  
//       return res.send('<h1 style="color:red; border-radius:2rem; background-color:yellow; margin:180px; padding:20px; boxShadow: 0px 14px 6px rgba(0, 0, 10, 0.1);">Oops! This request has already been accepted by someone...!!</h1>');  
//     }  

//     leaveRequest.status = 'Accepted';  
//     leaveRequest.acceptedBy = req.query.acceptingEmail;  
//     await leaveRequest.save();  

//     const acceptingUser = await Register.findOne({ email: leaveRequest.acceptedBy }, 'name year sem subj branch section');  
//       // accepted email message 
//     await sendEmail(leaveRequest.email, 'Class_Adjustment_Request Accepted_1', `  
//       <div style="background-color:green; border:2px solid yellow; display:flex;align-items:center;justify-content:center; color:white; border-radius:3rem;">
//       <div style="margin:10px; padding:20px;">
//       <h1 style="color:yellow;"><b>| Acceptance Message |<b></h1>
//       <h2 style="color:black;">Your request has been accepted by__<b style="color:white; font-size:20px;">${acceptingUser.name}...!👋</b></h2>  
//       <h2 style="color:yellow;">Faculty Details:</h2>  
//       <ul style="color:white;font-size:18px;">  
//       <li style="color:white;">Branch           : ${acceptingUser.branch} </li> 
//       <li style="color:white;">Year           : ${acceptingUser.year} year</li> 
//         <li style="color:white;">Semister         : ${acceptingUser.sem} sem</li>  
//         <li style="color:white;">Section    : ${acceptingUser.section} </li> 
//         <li style="color:white;">Faculty Name : ${acceptingUser.name}</li>   
//         <li style="color:white;">Subject Name      : ${acceptingUser.subj}</li>  
//       </ul></div><div>`);  

//     res.send('<h1 style=";color:white;background-color:green; margin:180px; padding:20px;border-radius:2rem;">You accepted the request successfully. Thank you..👍</h1>');  
//   } catch (error) {  
//     console.error('Error accepting Class_Adjustment_Request:', error);  
//     res.status(500).send('Error accepting request');  
//   }  
// });  

// // Route to reject a leave request  
// router.get('/reject/:id', async (req, res) => {  
//   try {  
//     const leaveRequest = await LeaveRequest.findById(req.params.id);  
//     if (!leaveRequest) return res.status(404).send('Leave Request not found.');  

//     if (leaveRequest.status === 'Accepted') {  
//       return res.send('<h1 style="color:white;border-radius:2rem; background-color:blue; margin:180px; padding:20px; boxShadow: 0px 14px 16px rgba(0, 0, 10, 0.1);">Oops! This request has already been accepted by someone...!!</h1>');  
//     }  

//     leaveRequest.status = 'Declined';  
//     await leaveRequest.save(); 

//     // const register = new Register({ name, email, sem, year, startDate, endDate, subj }); 
//     // await sendEmail(leaveRequest.email, 'Class Adjustment Request_1 Declined', `  
//     //   <div style="background-color:black;border:2px solid red; display:flex;align-items:center;justify-content:center; color:white">
//     //   <div style="margin:10px;paddind:20px;"  >
//     //   <h4 style="color:red;">Your Class Adjustment Request has been declined.!!!!!</h4>
//     //   <p>Details:</p>  
//     //   <ul>  
//     //     <li>Faculty Name: ${register.name}</li>  
//     //     <li>Year: ${register.year}</li>  
//     //     <li>Semester: ${register.sem}</li>  
//     //     <li>Subject: ${register.subj}</li>  
//     //   </ul></div></div>`);  

//     const users = await Register.find({ email: { $ne: leaveRequest.email }, sem: leaveRequest.sem, year: leaveRequest.year, subj:{$ne:leaveRequest.subj} }, 'email');  
//     const emailAddresses = users.map(user => user.email);  
//     // again sent  mail
//     const formattedLeaveDate = formatDate(leaveDate);
//     const emailMessage = `
//     <div style="background-color:blue; border:2px solid yellow; display:flex;align-items:center;justify-content:center; color:white; border-radius:3rem;">
//       <div style="margin:10px; padding:25px;">
//         <h1 style="color:white; padding:8px; border-radius:3rem;">Class_Adjustment_Request_2 from __<b style="color:yellow; font-size:25px; padding:3px;">${leaveRequest.name}</b>...!!</h1>
//         <table style="font-size:20px; color:white; width:100%;">
//          <tr>
//             <td>Branch</td>
//             <td><b>: ${leaveRequest.branch} year</b></td>
//           </tr>
//           <tr>
//           <tr>
//             <td>Year</td>
//             <td><b>: ${leaveRequest.year} year</b></td>
//           </tr>
//           <tr>
//             <td>Semester:</td>
//             <td><b>: ${leaveRequest.sem} sem</b></td>
//           </tr>
//            <tr>
//             <td>Section</td>
//             <td><b>: ${leaveRequest.section} year</b></td>
//           </tr>
//           <tr>
//           <tr>
//             <td>Subject:</td>
//             <td><b>: ${leaveRequest.subj}</b></td>
//           </tr>
//           <tr>
//             <td>Period:</td>
//             <td><b>: ${leaveRequest.period}</b></td>
//           </tr>
//           <tr>
//             <td>Period Timings:</td>
//             <td><b>: ${leaveRequest.startTime}</b> To <b>: ${leaveRequest.endTime}</b></td>
//           </tr>
//             <td>Date of Class Adjustment:</td>
//             <td><b>: ${formattedLeaveDate} on </b><b>${leaveRequest.dayName}</b></td>
//           </tr>
//         </table><br>
//         <p>
//           <a href="http://localhost:5000/api/leave/accept/${leaveRequest._id}?acceptingEmail={{userEmail}}"  
//              style="margin:250px;padding:10px;boxShadow: 0px 14px 6px rgba(0, 0, 10, 0.1); font-size:20px; background-color: green; color: white; text-decoration: none; border:2px solid yellow;">Accept</a>  
//         </p>
//       </div>
//     </div>`;
     
    
//     await Promise.all(emailAddresses.map(userEmail =>   
//       sendEmail(userEmail, 'Class_Adjustment_Request_2', emailMessage.replace('{{userEmail}}', userEmail))  
//     ));  

//     res.send('<h1 style="color:white; background-color:blue; margin:180px; padding:20px; border-radius:2rem;">Your succesfully declined the request,Thank you...!!</h1>');  
//   } catch (error) {  
//     console.error('Error rejecting leave request:', error);  
//     res.status(500).send('Error rejecting request');  
//   }  
// });  

// -----------------------------------------------------------------------
// Fetch all leave requests (with accepted details)
// Fetch only accepted leave requests
// Fetch leave requests along with acceptedBy user details
// router.get('/', async (req, res) => {
//   try {
//     // Fetch all leave requests and populate the 'acceptedBy' field with user details from the 'registers' collection
//     const leaveRequests = await LeaveRequest.find()
//       .populate('acceptedBy')  // Populate the 'acceptedBy' field with full user details
//       .exec();

//     res.json(leaveRequests);
//   } catch (error) {
//     console.error('Error fetching leave requests:', error);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/accept', async (req, res) => {
//   try {
//     const { leaveRequestId, acceptedByEmail } = req.body;

//     // Find the user in the 'registers' collection by email
//     const acceptedUser = await Register.findOne({ email: acceptedByEmail });

//     if (!acceptedUser) {
//       return res.status(404).json({ message: 'User not found in registers collection' });
//     }

//     // Find the leave request and update it with the ObjectId of the accepted user
//     const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
//       leaveRequestId,
//       { 
//         status: 'Accepted',
//         acceptedBy: acceptedUser._id // Store ObjectId from 'registers'
//       },
//       { new: true }
//     );

//     if (!updatedLeaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }

//     res.json({ message: 'Leave request accepted', leaveRequest: updatedLeaveRequest });
//   } catch (error) {
//     console.error('Error accepting leave request:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// // Fetch leave requests along with accepted user details
// router.get('/api/leave', async (req, res) => {
//   try {
//     const leaveRequests = await LeaveRequest.find();

//     // Fetch accepted user details for each leave request
//     const leaveRequestsWithUserDetails = await Promise.all(leaveRequests.map(async (request) => {
//       if (request.acceptedBy) {
//         // Fetch the user details from the registers database using acceptedBy email
//         const user = await Register.findOne({ email: request.acceptedBy });
//         return {
//           ...request.toObject(),
//           acceptedUserDetails: user ? {
//             name: user.name,
           
//           } : null
//         };
//       }
//       console.log(name)
//       return {
        
//         ...request.toObject(),
//         acceptedUserDetails: null
//       };
//     }));

//     res.json(leaveRequestsWithUserDetails);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching leave requests with user details' });
//   }
// });

// ------------------------------------------------------------------------


// module.exports = router;