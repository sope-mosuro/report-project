const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/send-email', (req, res) => {
   
        const {
            employeeName, 
            weekEnding, 
           'clientName1': clientName1 = [], product1=[], currentTask1 = [], completedTask1 = [],outstandingTask1=[],
           'clientName2': clientName2 = [], product2=[], currentTask2 = [], completedTask2 = [],outstandingTask2=[],
           'clientName3': clientName3 = [], product3=[], currentTask3 = [], completedTask3 = [], outstandingTask3=[],
           recipients
        } = req.body;
    
  console.log("received request body",req.body)

    // Ensure that arrays are received properly
    const tasks1 = Array.isArray(clientName1) ? clientName1.length : 0;
    const tasks2 = Array.isArray(clientName2) ? clientName2.length : 0;
    const tasks3 = Array.isArray(clientName3) ? clientName3.length : 0;

   // Convert recipients to an array
   const recipientList = recipients.split(',').map(email => email.trim());
    
    let emailBody = `
    <h1>Weekly Report</h1>
    <p><strong>Employee Name:</strong> ${employeeName}</p>
    <p><strong>Week Ending:</strong> ${weekEnding}</p>
   
`;

// Function to append tasks as a table for each report
const appendTasksToEmailBody = (clientNames,product,currentTask,completedTask,outstandingTask,reportNumber,reportName='support') => {
    if (!clientNames || !product || !currentTask ||!completedTask ||!outstandingTask) return ''; // Ensure all fields are present
    
    let reportTable = `
    <h2>Report #${reportNumber} - ${reportName}</h2>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #000; padding: 8px;">Client Name</th>
                <th style="border: 1px solid #000; padding: 8px;">Product</th>
                <th style="border: 1px solid #000; padding: 8px;">current task</th>
                <th style="border: 1px solid #000; padding: 8px;">completed task</th>
                <th style="border: 1px solid #000; padding: 8px;">Outstanding</th>
            </tr>
        </thead>
        <tbody>
    `;
    
for (let i = 0; i < clientNames.length; i++) {
    reportTable += `
        <tr>
           <td style="border: 1px solid #000; padding: 8px;">${clientNames[i] || 'N/A'}</td>
           <td style="border: 1px solid #000; padding: 8px;">${product[i] || 'N/A'}</td>
           <td style="border: 1px solid #000; padding: 8px;">${currentTask[i] || 'N/A'}</td>
           <td style="border: 1px solid #000; padding: 8px;">${completedTask[i] || 'N/A'}</td>
           <td style="border: 1px solid #000; padding: 8px;">${outstandingTask[i] || 'N/A'}</td>
        </tr>
    `;
}
reportTable += '</tbody></table><br>';
return reportTable;
};

// Append tables for each of the 3 reports (if there are tasks)
  // Append tables for each of the 3 reports (if there are tasks)
  if (clientName1.length > 0) {
    emailBody += appendTasksToEmailBody(clientName1, product1, currentTask1, completedTask1, outstandingTask1, 1,"support");
}
if (clientName2.length > 0) {
    emailBody += appendTasksToEmailBody(clientName2, product2, currentTask2, completedTask2, outstandingTask2, 2,"Implementation");
}
if (clientName3.length > 0) {
    emailBody += appendTasksToEmailBody(clientName3, product3, currentTask3, completedTask3, outstandingTask3, 3,"Reimplementation");
}

    // Configure the Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASSWORD 
        },
       
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientList, 
        subject: 'Weekly Report Submission',
        html: emailBody, 
       
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
       
        if (error) {
            console.error('Error sending email:', error);
            res.send('Error sending email.');
        } else {
            console.log('Email sent:', info.response);
            res.send('Report submitted successfully.');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
