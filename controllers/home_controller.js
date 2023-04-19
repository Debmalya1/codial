const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=function(req,res){
    //console.log(req.cookies);
    //res.cookie('user_id',25);
    //return res.end('<h1>Express is up for codium</h1>');

 
 //Used for post showing but we can only show user id
   /*post.find({}).then(function(posts){
        return res.render('home',{
            title:"Codial | Home",
            posts:posts
        });
    })*/


    //populate the user of each post so that we can show name along with the posts
    Post.find({}).populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .then(function(posts){
        User.find().then(function(users){
            return res.render('home',{
                title:"Codial | Home",
                posts:posts,
                all_users: users
            });
        });
    });
    
}

//module.exports.actionName=function(req,res){};
