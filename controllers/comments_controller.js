const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req,res){
    Post.findById(req.body.post).then(function(post){
        if(post){
            Comment.create({content:req.body.content,
            post:req.body.post,
            user:req.user._id}).then(function(comment){
                post.comments.push(comment); //this comment is pushed to the post automatically fetch the post id and push it(updating comment)
                post.save(); //save the update by db

                res.redirect('/');
            });
        }
    });
}


module.exports.destroy=function(req,res){
    Comment.findById(req.params.id).then(function(comment){
        if(comment.user == req.user.id){
        //get the post_id of the commment and store in a variable then,delete the comment 
        //go to the post find the comment from the comment array of the post and delete it(comment deleted from  both location)
            let postId=comment.post;
            comment.deleteOne();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}}).then(function(post){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}