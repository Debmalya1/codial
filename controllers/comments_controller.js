const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req,res){

    try{
        let post= await Post.findById(req.body.post)

        if(post){
            let comment= await Comment.create({content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            post.comments.push(comment); //this comment is pushed to the post automatically fetch the post id and push it(updating comment)
            post.save(); //save the update by db

            
            if(req.xhr){
                //similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name');
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message:"Comment created!"
                });
            }


            req.flash('success','Comment added!');

            
            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
}



module.exports.destroy=async function(req,res){


    try{
        let comment=await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            //get the post_id of the commment and store in a variable then,delete the comment 
            //go to the post find the comment from the comment array of the post and delete it(comment deleted from  both location)
            let postId=comment.post;
            comment.deleteOne();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message:'Comment deleted'
                });
            }


            req.flash('success','Comment deleted!');
            return res.redirect('back');
            }else{
                req.flash('error','You cannot delete the comment');
                return res.redirect('back');
            }
        }catch(err){
        req.flash('error', err);
        return;
    }
    
}