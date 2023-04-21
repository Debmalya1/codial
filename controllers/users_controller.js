const User=require('../models/user')


module.exports.profile = function(req, res){
    User.findById(req.params.id).then(function(user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        });
    });
}


//for updating profile info(email,name) from profile page
module.exports.update=function(req,res){
    if(req.user.id==req.params.id){ //if anyone chnged the html and tries updating others profile wont be able to do so.. because of this condition
        User.findByIdAndUpdate(req.params.id,req.body).then(function(user){
            req.flash('success','Profile Details Updated!')
            return res.redirect('/');
        });
    }
    else{
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