const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8003;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

app.use(express.urlencoded({ extended: true })); //If extended is false, you can not post "nested object"

app.use(cookieParser());

app.use(express.static('./assets')); //app.use means middleware

app.use(expressLayouts);
//extract style and scripts from subpages into layout
app.set('layout extractStyles',true); //Ones any link tag is found it is taken to layout.ejs file style tag while rendering
//(mainly done to keep link tags in head section)
app.set('layout extractScripts',true); //Ones any script tag is found it is taken to layout.ejs file script tag while rendering

//use express router
app.use('/',require('./routes'));


//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server :${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

