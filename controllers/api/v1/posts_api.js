const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index= async function(req,res){
    /*return res.json(200,{
        message:"List of posts",
        posts:[]
    });*/
    //for getting all our posts in our api
    let posts = await Post.find({}).populate('user')   //wait for this function to execute
        .sort('-createdAt') //for sorting with respect to time created(latest to be shown first)
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
    return res.status(200).json({
        message:"List of posts",
        posts:posts //fetching the posts in our api
    });
}


module.exports.destroy= async function(req,res){


    try{
        let post = await Post.findById(req.params.id)
        // .id means converting the object id to string
        if(post.user == req.user.id){ //(id is string version of __id provided by mongoose)
            post.deleteOne({post}); //for deleting the post if the id matches

            await Comment.deleteMany({post:req.params.id})  //delete the comments associated with the post


            return res.status(200).json({
                message:"Post and associated Comments deleted successfully!"
            });
        }
        else{
            return res.status(401).json({
                message:"You cannot delete the post"
            });
        }
    }catch(err){
        console.log("****",err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
    
}