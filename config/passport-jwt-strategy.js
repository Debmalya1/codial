const passport=require('passport');
//1st we are importing the strategy and 2nd we are importing a module which will help us extract jwt from the header
const JWTStrategy=require('passport-jwt').Strategy; 
const ExtractJWT=require('passport-jwt').ExtractJwt;

const User=require('../models/user');


let opts={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() ,//header is a list of keys and it has a key of authorization that is also a list of key and can have a key bearer that will be having the jwt token
    secretOrKey : 'codeial' //this is my encryption and decryption string,codeial is the key
}

//ones the users jwt has been generated it is used after it to authenticate the jwt
passport.use(new JWTStrategy(opts, function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id).then(function(user){ //fetching the id from payload and checking if the user is present or not
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    });
}));

module.exports=passport;