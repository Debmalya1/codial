const express=require('express');

const router=express.Router();

const passport=require('passport');

const commentsController=require('../controllers/comments_controller');
//authentication checked if user not logged in then it will not be able to comment to post
router.post('/create',passport.checkAuthentication,commentsController.create); 

module.exports=router;