const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"958109001911-48g7c0vjdgnfk57v0pu4v5i5dsd1sl6b.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8003/users/auth/google/callback",
},function(accessToken,refreshToken,profile,done){
    //find a user
    User.findOne({email:profile.emails[0].value}).then(function(user){ //user can have multiple emails only need to get the current email
        //console.log(accessToken,refreshToken);//we can use api of google using this access token and access different permission of the user
        //console.log(profile);
        if(user){
            //if found set this user as req.user
            return done(null,user)
        }else{
            //if not found create the user and set it as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex') //crypto will create a random passport of length 20 in hexadecimal format
            }).then(function(user){
                return done(null,user);
            });
        }
    });
}));

module.exports=passport;