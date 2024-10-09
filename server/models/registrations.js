const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  branch:String,
  year:String,
  sem:String, 
  section:String,
  email: String,
  name:String,
  subj: String

  
});
const Registers = mongoose.model('Registers', RegistrationSchema);
module.exports = Registers 


// await transporter.sendMail({
//   from: auth.EMAIL_USER,
//   to: leaveRequest.email, // Assuming leaveRequest has an email field
//   subject: 'Leave Request Accepted',
//   html: `<p>Your leave request has been accepted by ${userName}.</p>`,
// });

// res.send(`Accepted by ${userName}`);
// } catch (error) {
// console.error('Error updating leave request:', error);
// res.status(500).send('Error updating leave request');
// }
// });



// await transporter.sendMail({
//     from: auth.EMAIL_USER,
//     to: leaveRequest.email, // Assuming leaveRequest has an email field
//     subject: 'Leave Request Declined',
//     html: `<p>Your leave request has been declined by ${userName}.</p>`,
//   });
  
//   res.send(`Declined by ${userName}`);
//   } catch (error) {
//   console.error('Error updating leave request:', error);
//   res.status(500).send('Error updating leave request');
//   }
//   });