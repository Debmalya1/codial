const express=require('express');
const router=express.Router();
const passport=require('passport');

const usersController=require('../controllers/users_controller');
//This line can be of diff folder/file i have written by mistake/
//const { use } = require('./users'); 



router.get('/profile',passport.checkAuthentication,usersController.profile); //if authentication is checked(user logged in) then only show user-profile page

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);


router.post('/create',usersController.create);
<<<<<<< HEAD
//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local', //local authentication is used
    {failureRedirect:'/users/sign-in'}, // if failed
),usersController.createSession); //if sucess this action will be called
 
router.get('/sign-out',usersController.destroySession);
=======
router.post('/create-session',usersController.createSession);
>>>>>>> 2ceb0073666fe766ac93ec717187684b5de5c746

module.exports=router;
