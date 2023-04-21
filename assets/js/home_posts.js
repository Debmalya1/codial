{
    //method to submit the form data for new post using AJAX
    let createPost=function(){
        let newPostForm=$('#new-post-form');

         newPostForm.submit(function(e){
            e.preventDefault();  //preventing the default action
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), //.serealize() convert the form data to json(content is the key and value filled in the form)
                success:function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost); //prepend is adding at the top(opposite of append)
                    deletePost($('.delete-post-button',newPost));

                    // call the create comment class
                    //new PostComments(data.data.post._id);

                    //addding flash message using Noty
                    new Noty({
                        theme:'relax',
                        text:'Post Published!',
                        type:'success',
                        layout:'topRight',
                        timeout:1000
                    }).show();

                },error:function(error){
                    console.log(error.responseText);
                }
            });
         });
    }
    

    //method to create a post in DOM 
    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
                <p>
                    <small>
                        <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                    </small>
                    <small>
                    ${ post.user.name }
                    </small><br>
                    ${post.content}
                </p>
                <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to Add Comment..." required>
                    <input type="hidden" name="post" value="${post._id}" >    
                    <input type="submit" value="Add Comment">                        
                </form>
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                        
                    </ul>
                </div>
            </div>
        </li>`)
    }


    //method to delete a post from DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'), //get the href property of the <a> tag that is being called for delete
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    //addding flash message using Noty
                    new Noty({
                        theme:'relax',
                        text:'Post Deleted!',
                        type:'success',
                        layout:'topRight',
                        timeout:1000
                    }).show();

                },error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    //so that if we refresh the page we can delete the existing posts without refreshing the page 
    let convertPostsToAjax=function(){
        $(`#posts-list-container>ul>li`).each(function(){
            let self=$(this);
            let deleteButton=$('.delete-post-button',self);
            deletePost(deleteButton);


            // get the post's id by splitting the id attribute
            //let postId = self.prop('id').split("-")[1]
            

            //TODO LATER For comment something(40)
            //new PostComments(postId);

        });
    }

    createPost();
    convertPostsToAjax();
}

