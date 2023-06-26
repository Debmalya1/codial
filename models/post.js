const mongoose=require('mongoose');


const postSchema= new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //mail of the post creater
    userMail: {
        type: String,
        ref:'UserMail'
    },
    //include the array of ids of all the comments in the post schema itself for faster fetching
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;