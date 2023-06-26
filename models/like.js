const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        //types not on video probably can be error
        type: mongoose.Schema.ObjectId
    },
    //this defines the object id of the liked object
    likeable:{
        type: mongoose.Schema.ObjectId,
        required:true,
        //we are going to place a path to some other field and that field will define on which type of object like has been placed 
        refPath:'onModel'
    },
    //this field is used for defining the type of the liked object since this is a dynamic reference
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},  {
        timestamps:true
    });

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;