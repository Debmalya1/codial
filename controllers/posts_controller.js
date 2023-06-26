const Post=require('../models/post');
const Comment=require('../models/comment');
//const User = require('../models/user');
const Like=require('../models/like');

/*module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id
    }).populate('user').then(function(post){

        if(req.xhr){
            //post = post.populate('user', 'name');
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created!"
            });
        }
        req.flash('success','Post Published!');
        return res.redirect('back');
    });
}
*/


module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
            //added for email
            userMail:req.user.email
        });
        
        post = await post.populate('user', 'name email')
        //console.log(req.user.email);
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
           

            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post created!"
            });
        }
        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}



module.exports.destroy= async function(req,res){


    try{
        let post = await Post.findById(req.params.id)
        //.id means converting the object id to string
        if(post.user == req.user.id){ //(id is string version of __id provided by mongoose)
            //delete the associated likes for the post and all its comment's likes too
            await Like.deleteMany({likeable:post._id,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});


            post.deleteOne({post}); //for deleting the post if the id matches

            await Comment.deleteMany({post:req.params.id})


            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:'Post deleted successfully'
                });
            }
            req.flash('success','Post and associated comments deleted!');
            
            return res.redirect('back'); //success
        }else{
            req.flash('error','You cannot delete the post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
    
}