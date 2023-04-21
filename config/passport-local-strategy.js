const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');


//Authentication using passport
passport.use(new LocalStrategy({
        usernameField:'email',
        passReqToCallback:true //with this we can send req as the first argument of the callback function
    },function(req,email,password,done){
        //find a user and establish the identity
        User.findOne({email:email}).then(function(user){
            if(!user || user.password != password){
                req.flash('error','Invalid Username/Password')
                return done(null,false);
            }
            return done(null,user);
        }).catch(function(err){
            req.flash('error',err);
        });
    }

));

//Serializing the user to decide which key to be kept in the cookies(automatically enrcypts)
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//Deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id).then(function(user){ //err need to be find anyhow that is passed and add in the function arguments
        return done(null,user);
    });
});

//check if the user ia authenticated(acting as middleware)
passport.checkAuthentication=function(req,res,next){
    //if the user if signed in pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){ //deteccts user is signed in or not
        return next();
    }
    
    //if user is not signed in
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in from the session cookie and we are sending this to the locals for the views
        res.locals.user=req.user;
    }

    next();
}


module.exports=passport;