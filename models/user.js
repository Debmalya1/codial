const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String //contains the path of the file(as db doesnot store image(File))
    },
    //from_user,to_user of friendship schema if present in any column username then its respective frnd id should be added here
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendship'
        }
    ]
},{
    timestamps:true
});


//storing in local device(using multer)
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix); //fieldname is avatar for every file we upload will be stored as avatar-(valye of data.now())
    }
});


//static functions for the user
userSchema.statics.uploadedAvatar= multer({storage:storage}).single('avatar');//attaches the disk storage on multer in the storage property
// .single('avatar') means only 1 instance or 1 file will be uploaded for the fieldname avatar not multiple files
userSchema.statics.avatarPath=AVATAR_PATH;
//we want AVATARPATH to be available publicly on the user model


const User=mongoose.model('User',userSchema);

module.exports=User;