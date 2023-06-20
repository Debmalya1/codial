const Queue=require('../config/keu');

const commentsMailer=require('../mailers/comments_mailer');

//job consist of calling the comment mailer with each new comment and the data(Commment itself)
Queue.process('emails',function(job,done){
    console.log('emails worker is processing a job',job.data);
    commentsMailer.newComment(job.data);
    done();
});
    
