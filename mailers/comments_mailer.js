const nodemailer=require('../config/nodemailer');

//this is another way of exporting a method direcctly
exports.newComment=(comment)=>{
    //console.log("Inside new comment mailer",comment);
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    //console.log(comment.postUser);

    nodemailer.transporter.sendMail({
        from:'debmalya1508@gmail.com',
        //the person who has commented
        //in case of post it will be comment.post.user.email 
        to:comment.postUser,
        subject:"New Comment Published on your post",
        html:htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        //console.log('Message sent', info);
        return;
    });
}