postmanExecutorApp.service('dataProvider', dataProvider)
.service('postmanService',postmanService);


function postmanService(){
	var newman = require("newman"),
	fs = require("fs"),
	//people = require(__dirname+'/scripts/services/Email.js'),
	_ = require('lodash'),
	TS_SEP = '-';
	/*var postmanobject=require(__dirname+'/postman.json');
	var emailObject=require(__dirname+'/../email.json');*/



	//provide time stamp in date formate 
	timestamp = function (date, separator) {
	        // use the iso string to ensure left padding and other stuff is taken care of
	        return (date || new Date()).toISOString().replace(/[^\d]+/g, _.isString(separator) ? separator : TS_SEP);
	};

	this.run= function(postmanParam){
	
		var postmanProject=postmanParam.project;
		var collectionsArray=postmanParam.scripts;

		collectionsArray.forEach(function(collectionName){
			start(postmanProject,collectionName);
		})
	};

	start= function(project,collectionName){
		console.log('started')
		newman.run({
	    collection: require(__dirname+'/../postman/'+project+'/'+collectionName+'.postman_collection.json'),
		reporters: ['html','cli'],
	    reporter: { 
		html : { 
				export : __dirname+'/../postman/'+project+'/newman/'+collectionName+'-'+timestamp()+'0.html',
				template: __dirname+'/scripts/services/report-template.hbs'
				} 
			}	 
		}, function (err,summary) {
	    if (err) { throw err; }
	    console.log(collectionName+' collection run complete!');
	        reportEmailSummary={
	        request:summary.run.stats.requests,
	        assertions:summary.run.stats.assertions
	     }; 
	     console.log(reportEmailSummary); 
	     if(emailObject.emailDiv){
	     	//shootEmail(emailObject,project,reportEmailSummary);
	     }

		})
	}

	shootEmail = function(emailObj, path, summary){
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
	
}


function dataProvider(){
	
	var fs = require("fs"),
	path = require("path");
	//xmlBuilder=require('xmlbuilder');

	
	this.getProjects = function(){
		if(typeof projects != 'undefined' && projects != null){
			return projects;
		}
	}

	this.getProjectsById=function(projectId){
    return projects[projectId];
  	}

	getProjectList = function(){
		var projectList={
			projects : []
		};
		/*var srcpath;

		if(projectType==='selenium'){
			projectList['projectType']=projectType;
			projectList['package'] = 'Ituple.automationBed_Beta';
			srcpath=__dirname+'/selenium/automationBed-Beta/src/test/java/Ituple/automationBed_Beta/';
		}else if(projectType==='postman'){
			projectList['projectType']=projectType;
			projectList['package'] = projectType;
			srcpath=__dirname+'/postman/';
		}*/
		srcpath=__dirname+'/../postman/';
		

		getDirectories(srcpath)
		.forEach(function(proName){
			var project={};
			project['name']=proName;
			project['scripts']= [];
			getFiles(srcpath+proName+'/').forEach(function(script){
				var scr = script.split('.');
				if((scr[scr.length-1]).toUpperCase()=='JAVA' || (scr[scr.length-1]).toUpperCase()=='JSON'){
					project.scripts.push({'name' : scr[0]});
				}	
			});
			projectList.projects.push(project);
		});
		console.log(projectList);
		return projectList;
	}

	//return dir list should be moved to a common service module
	getDirectories = function(scrPath) {
	  return fs.readdirSync(scrPath)
	    .filter(file => fs.statSync(path.join(scrPath, file)).isDirectory())
	}
	//return file list should be moved to a common service module
	getFiles = function(scrPath) {
	  return fs.readdirSync(scrPath)
	    .filter(file => fs.statSync(path.join(scrPath, file)).isFile())
	}

	getFileAttr = function(scrPath,file){
		return fs.statSync(path.join(scrPath, file));
	}

	var projects=getProjectList().projects;
}







postmanExecutorApp.directive('siteHeader', function () {
    return {
        restrict: 'E',
        template: '<button class="btn">{{back}}</button>',
        scope: {
            back: '@back',
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
           element.on('click', function() {
                history.back();
                scope.$apply();
            });
           
        }
    };
});