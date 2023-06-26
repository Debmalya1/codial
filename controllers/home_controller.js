const Post=require('../models/post');
const User=require('../models/user');

module.exports.home= async function(req,res){  //async func
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

    try{    //try to run the run if any error go to catch section
        //populate the user of each post so that we can show name along with the posts
        let posts = await Post.find({})   //wait for this function to execute
        .sort('-createdAt') //for sorting with respect to time created(latest to be shown first)
        .populate('user')
        .populate
        ({
            path: 'comments',
            populate:
            {
                path: 'user'
            }
        })
            //for comments(likes)
            .populate
            ({
                path: 'comments',
                populate:
                {
                    path: 'likes'
                }
            })//.populate('comments')
        //for post(likes)
        .populate('likes');
    
        let users= await User.find({}) //then wait for this function to get exceute
        req.flash('success','Welcome to the Home Page!!!')
        return res.render('home',{  //then return this
            title:"Codial | Home",
            posts:posts,
            all_users: users
        });
    }catch(err){    //if error in any portion of the try it will go to the catch and show error
        req.flash('error','error in home page');
        return res.redirect('back');
    }
    
}

//module.exports.actionName=function(req,res){};
