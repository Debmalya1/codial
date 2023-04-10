const express=require('express');
const router=express.Router();

const usersController=require('../controllers/users_controller');
//This line can be of diff folder/file i have written by mistake/
//const { use } = require('./users'); 

router.get('/profile',usersController.profile);

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);


router.post('/create',usersController.create);
router.post('/create-session',usersController.createSession);

module.exports=router;
