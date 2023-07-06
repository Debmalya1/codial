{
    //method to submit the form data for new post using AJAX
    let createPost=function(){
        let newPostForm=$('#post-form');

         newPostForm.submit(function(e){
            e.preventDefault();  //preventing the default action
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), //.serealize() convert the form data to json(content is the key and value filled in the form)
                success:function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container').prepend(newPost); //prepend is adding at the top(opposite of append)
                    deletePost($('.delete-post-btn',newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);
                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

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
    let newPostDom = function (post) {
        return $(`<div id="post-${post._id}" class="post-wrapper">
            <div class="post-header">
              <div class="post-avatar">
              <a href="/users/profile/${post.user._id}">
                <img class="rounded-circle post-avtar"
                src="${post.user.avatar}"
                alt="logo"
                >
              </a>
              <div>
                  <span class="post-author">${post.user.name}</span>
                </div>
                <button class="delete-btn no-btn">
                  <a class="delete-post-btn" href="/posts/destroy/${post._id}"
                    ><i class="fas fa-times"></i
                  ></a>
                </button>
              </div>
              <div class="post-content">${post.content}</div>
          
              <div class="post-actions">
                <button class="post-like no-btn">
                ${locals.user}{
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                
                <i class="fa-regular fa-heart"></i>
                  <span>${post.likes.length}</span>
                </button>
                </a>
          
                <div class="post-comments-icon">
                <i class="fa-regular fa-comment"></i>
                  <span>${post.comments.length}</span>
                </div>
              </div>
              <div class="post-comment-box">
                <form id="post-${post._id}-comments-form" class="comments-form" action="/comments/create" method="POST">
                  <input type="text" name="content" required />
                  <input type="hidden" name="post" value="${post._id}" />
                  <input type="submit" value="Add Comment" />
                </form>
              </div>
          
              <div id='post-comments-${post._id}' class="post-comments-list">
              </div>
            </div>
          </div>`);
      };
    
      

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
        $(`#posts-list-container>div`).each(function(){
            let self=$(this);
            let deleteButton=$('.delete-post-btn',self);
            deletePost(deleteButton);


             //get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            

            //TODO LATER For comment something(40)
            new PostComments(postId);

        });
    }

    createPost();
    convertPostsToAjax();
}

