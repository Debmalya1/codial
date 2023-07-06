//communicating with the client side(frontend-part)
//us on the browser
class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        //userEmail is actually the name of the user that we have send from home.ejs file
        this.userEmail=userEmail;


        this.socket=io.connect('http://localhost:5000');


        if(this.userEmail){
            this.connectionHandler();
        }
    }

    //this connectionHndler will have to and fro interaction between the server(observer) and the subecriber(user)
    connectionHandler(){
        let self=this;

        //Requesting for connecting socket to the chat server
        this.socket.on('connect',function(){
            console.log('connection established using sockets....');    

            //Emitting function for joining the chat toom
            self.socket.emit('join_room',{
                //change user_email
                userEmail:self.userEmail,
                chatroom:'codial'
            });

            //Giving messages to all in that chat room that new user joined
            self.socket.on('user_joined',function(data){
                console.log('A user joined',data);
            });
        });

        //Sending message on click event
        $("#send-message").click(function(){
            let msg = $("#chat-message-input").val();

            if(msg != ""){
                self.socket.emit("send_message" ,{
                    message : msg,
                    userEmail : self.userEmail,
                    chatRoom : "codial"
                })
            }
            
        });

        self.socket.on('receive_message',function(data){
            console.log('message received',data.message);

            let newMessage=$('<li>');

            let messageType = "self-message";

            if(data.userEmail != self.userEmail){
                messageType = "other-message";
            }

           /* newMessage.append($('<span>',{
                'html':data.message
            }));*/
            newMessage.html(`<span>${data.message}</span>`)
            //newMessage.html(`<sub>${data.userEmail}</sub>`)
            newMessage.append((`<sub>${data.userEmail}</sub>`));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}