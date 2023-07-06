//observer or the server which will receive the incoming connections from all the users which are the subscribers
//the chatserver or socketServer is passed as an argument
module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer,{
        cors: {
          origin: "*",
          //methods: ["GET", "POST"]
        }
    });


    io.sockets.on('connection',function(socket){
        console.log('New connection received',socket.id);

        socket.on('disconnect',function(){
            console.log("Socket Disconnected");
        });
        //.on detects an event that is send by the client(user joining the chatroom)
        socket.on('join_room',function(data){
            console.log("Joining request received",data);

            //if a chatroom with the name data.chatroom(codial exists) user will enter that chatroom else it will create the chatroom and let the user into it 
            socket.join(data.chatRoom);

            //while emitting in a particular chatroom we use io.in else only emit is enough(emit to all the user about new user joined)
            io.in(data.chatRoom).emit('user_joined',data);

            //after receiving send_message it will send emit receive_message function on the same chatroom
            //emit is send and on is receive
            socket.on('send_message',function(data){
                io.in(data.chatroom).emit('receive_message',data)
            });
        });
    });
}