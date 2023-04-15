const express=require('express');

const router=express.Router();

const passport=require('passport');

const postsController=require('../controllers/posts_controller');
//authentication checked if user not logged in then it will not be able to post
router.post('/create',passport.checkAuthentication,postsController.create); 

module.exports=router;