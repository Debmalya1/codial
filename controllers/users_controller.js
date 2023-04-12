const User=require('../models/user')


module.exports.profile=function(req,res){
    return res.render('user_profile',{
        title:"Codial | UserProfile"
    });
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
    return res.redirect('/');
}


module.exports.destroySession=function(req,res){
    req.logout(function(err){ //req.logout() is now an asynchronous function and this function is given to req using passport.js
        if(err){
            console.log("Error in signing out",err);
        }
        return res.redirect('/');
    }); 
    
}