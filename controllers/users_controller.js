const User=require('../models/user')


module.exports.profile=function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id).then(function(user){
            if(user){
                return res.render('user_profile', {
                    title:"Codial | UserProfile",
                    user:user
                });
            }
            return res.redirect('/users/sign-in');
        });
    }
    else{
        return res.redirect('/users/sign-in')
    }
}

//render the signup page
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title:"Codial | Sign Up"
    });
}

//render the sign in page
module.exports.signIn=function(req,res){
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

    //Steps to authenticate
    //find the user
    User.findOne({email:req.body.email}).then(function(user){
        //handle user found
        if(user){
            //handle password which doesn't match
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }else{
            //handle user not found
            return res.redirect('back');
        }
    });
}

