const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8003;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

//for socket.io chat implementation
//setup the chat server to be used with socket.io
//http is an inbuild module
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000");

app.use(express.urlencoded({ extended: true })); //If extended is false, you can not post "nested object"

app.use(cookieParser());

app.use(express.static('./assets')); //app.use means middleware

//uploads is available on this path(directory of index is joined with uploads)
app.use('/uploads',express.static(__dirname + '/uploads'));//make the uploads available to the browser

app.use(expressLayouts);
//extract style and scripts from subpages into layout
app.set('layout extractStyles',true); //Ones any link tag is found it is taken to layout.ejs file style tag while rendering
//(mainly done to keep link tags in head section)
app.set('layout extractScripts',true); //Ones any script tag is found it is taken to layout.ejs file script tag while rendering



//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codial',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething', //used to encrypt
    saveUninitialized:false, //when session is not initialized(user not logged in) no extra data is saved in the session cookie
    resave:false, //when some data present in session cookie wee dont want it to resave again and again(rewrite again and again even when no chnages are there)
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : MongoStore.create( //to store the session information even when the server restarts it remains in the memory,so logged in users dont have to log in again if the server restarts
        {
            mongoUrl:'mongodb://127.0.0.1:27017/codeial_development',
            mongooseConnection : db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok')
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser); //this func is called and user is accessibale to views using locals

//for flash messages(uses session cookies so initialized after it)
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server :${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});

