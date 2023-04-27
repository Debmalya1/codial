const express=require('express');
const router=express.Router();
const passport=require('passport');

const usersController=require('../controllers/users_controller');
//This line can be of diff folder/file i have written by mistake/
//const { use } = require('./users'); 



router.get('/profile/:id',passport.checkAuthentication,usersController.profile); //if authentication is checked(user logged in) then only show user-profile page
router.post('/update/:id',passport.checkAuthentication,usersController.update); //update route

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);


router.post('/create',usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local', //local authentication is used
    {failureRedirect:'/users/sign-in'}, // if failed
),usersController.createSession); //if sucess this action will be called
 
router.get('/sign-out',usersController.destroySession);
//router.post('/create-session',usersController.createSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);




module.exports=router;
