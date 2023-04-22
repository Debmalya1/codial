const User=require('../models/user');
const fs=require('fs');
const path=require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id).then(function(user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        });
    });
}


//for updating profile info(email,name) from profile page
/*module.exports.update=function(req,res){
    if(req.user.id==req.params.id){ //if anyone chnged the html and tries updating others profile wont be able to do so.. because of this condition
        User.findByIdAndUpdate(req.params.id,req.body).then(function(user){
            req.flash('success','Profile Details Updated!')
            return res.redirect('/');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}*/
//bodyparser wont be able to parse due to form has multipart(thats why using multer)
module.exports.update= async function(req,res){


    if(req.user.id==req.params.id){
        try{
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('*********Multer ERROR: ',err);
                }
                //console.log(req.file);
                user.name=req.body.name; //possible bcz of multer
                user.email=req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar= User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','unauthorized');
        return res.status(401).send('Unauthorized');
    }
    
    
}

//render the signup page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up',{
        title:"Codial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_in',{
        title:"Codial | Sign In"
    });
}

//get the signup data
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back'); //pw and confirm pw doesnt match
    }
    User.findOne({email:req.body.email}).then(function(user){
        if(!user){
            User.create(req.body); //.then function(err,user) not given only err cond. was checking
            return res.redirect('/users/sign-in'); //creating the user
        }else{
            return res.redirect('back'); //Users already exist condition
        }
    });
}


//Sign in and create a session for the user
module.exports.createSession=function(req,res){
    req.flash('success','Logged in Sucessfully')
    return res.redirect('/');
}


module.exports.destroySession=function(req,res){
    req.logout(function(err){ //req.logout() is now an asynchronous function and this function is given to req using passport.js
        if(err){
            console.log("Error in signing out",err);
        }
        req.flash('success','Logged out Sucessfully')
        return res.redirect('/');
    }); 
    
}