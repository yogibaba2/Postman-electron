module.exports ={

shootEmail : function(emailObj, path, summary){
console.log('email started');
var f = getNewestFile(__dirname+'/'+path+'/newman', new RegExp('.*\.html'));
console.log(f.toString());
var  nodemailer = require('nodemailer');

//var smtpTransport = require('nodemailer-smtp-transport');


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'ankit.asthana974@gmail.com',
//         pass: 'Kapil@123'
//     }
// });


var transporter = nodemailer.createTransport({
        host: 'email-smtp.us-west-2.amazonaws.com', 
        port: 25,       // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
           user: 'AKIAJQ6PJ4T66JGQMPSQ',
           pass: 'AomZ11YcGG4+PmbHKcmFpvXYaYuN8GjT6ewvBcvommLt'
        }
    }); 

console.log(emailObj);

var  mailOptions = {
    from: 'QA@ituple.com', 
    to: emailObj.toEmail+'',
    cc:emailObj.ccEmail+'', 
    subject: 'WebServices EWS-Galaxy Integration Automation Report', 
    attachments:[{
            path: f }],
    text: 'This is an automated generated mail',
    html :  "<html><head><style>, th, td {border: 1px solid #888;border-collapse: collapse; padding: 10px;}th{background-color: #dcdcdc;font-weight: bold;}"
    +"</style></head><body><p> Hi,</p><p>PFB Report for EWS-Galaxy Integration:-</p><table width='400'>"+
    "<th colspan='3'>EWS-Galaxy Integration Report</th>"+
    "<tr><td>#</td><td>Total</td><td>Failed</td></tr>"+
    "<tr><td>Test Script</td><td>"+summary.request.total+"</td><td style='color:red;font-weight: bold;'>"+summary.request.failed+"</td></tr>"+
   "<tr><td>Assertions</td><td>"+summary.assertions.total+"</td><td style='color:red;font-weight: bold;'>"+summary.assertions.failed+"</td></tr>"+
   "</table><p>Please review the test results and reach out in case of any questions.</p><p>This is an auto generated mail. Please do not reply.</p></body></html>"

    
            };
transporter.sendMail(mailOptions, (error, info)=>{
  if (error) {

        return console.log(error);
    };
    console.log('mail shoot successfully...');
})

}
}

var fs = require('fs');


function getNewestFile(dir, regexp) {
    newest = '';
    files = fs.readdirSync(dir);
    one_matched = 0;
    for (i = 0; i < files.length; i++) {
        
        if (regexp.test(files[i]) == false)
            continue;
        else if (one_matched == 0) {
            newest = dir+'/'+files[i]
            one_matched = 1
            continue
        }
        //console.log(files[i]);
        f1_time = fs.statSync(dir+'/'+files[i]).mtime.getTime()
        f2_time = fs.statSync(newest).mtime.getTime()
        if (f1_time > f2_time)
            newest= dir+'/'+files[i]  
    };

         
   
    if (newest != null){
        return String(newest);
    }
        
    return null;
}
