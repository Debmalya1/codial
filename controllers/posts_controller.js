const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id
    }).then(function(post){
        return res.redirect('back');
    });
}


module.exports.destroy=function(req,res){
    Post.findById(req.params.id).then(function(post){
        //.id means converting the object id to string
        if(post.user == req.user.id){ //(id is string version of __id provided by mongoose)
            post.deleteOne({post}); //for deleting the post if the id matches

            Comment.deleteMany({post:req.params.id}).then(function(){
                return res.redirect('back'); //success
            });
        }else{
            return res.redirect('back');
        }
    });
}