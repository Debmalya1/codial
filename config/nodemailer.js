const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');

//transporter is a object which is assigned or attached to nodemailer
//this is the part which sends the email
let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    //establish identity to track the activity of mailing from and to
    auth:{
        user:'debmalya1508@gmail.com',
        pass:'kaccnzvsdigtqmrx'
    }
});

//whenever we are sending html email (to make it look good) when the file will be present in views(mailers folder)
let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        //relativePath the place from where the function is called
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("error in rendering template",err);
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}


module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}