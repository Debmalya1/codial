const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLike=async function(req,res){
    try{

        //likes/toggle/id=abcdef&type=Post
        let likeable;
        let type='';
        let deleted=false; //for increment or decrement the no of likes displayed on the page
        if(req.query.type=='Post'){
            //getting the id and populating likes array(if likes already present else empty array)
            likeable= await Post.findById(req.query.id).populate('likes');
            type='Posts'
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
            type='Comments'
        }

        //check if a like already exists
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });

        //if a like already exists delete it(toggle functiob)
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne({existingLike});
            deleted=true;
        }else{
            //else make a new like(if like doesnot exist)
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.status(200).json({
            message:"Request Successful",
            data:{
                deleted:deleted,
                type:type,
                likeable:likeable,
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

