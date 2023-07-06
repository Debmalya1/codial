/*{
    //method to submit the comment data for new post using AJAX
    let createComment=function(){
        let newCommentForm=$('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();

           $.ajax({
                type:'post',
                url:'/comments/create',
                data:newCommentForm.serialize(),
                success:function(data){
                    let newComment=newCommentDom(data.data.comment);
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                    deleteComment($('.delete-comment-button',newComment));

                    new ToggleLike($('.toggle-like-button', newComment));
                    //addding flash message using Noty
                    new Noty({
                        theme:'relax',
                        text:'Comment Published!',
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


    //method to create a comment in DOM
    let newCommentDom=function(comment){
        return $(`<div id='comment-${comment._id}' class="post-comment-item">
        <div class="post-comment-header">
          <span class="post-comment-author">
          <a href="/users/profile/${comment.user._id}">
          <img
              class="rounded-circle comment-avtar"
              src="${comment.user.avatar}"
              alt="logo"
            />
            </a>&nbsp;&nbsp;</span>
            <span class="comment-author-name">
            ${comment.user.name}</span>
          <div class="post-actions">
            <button class="post-like no-btn">
            <a data-likes="0" class="toggle-like-button" href="/likes/toggle/?id=${comment._id}&type=Comment">
            <i class="fa-regular fa-heart"></i>
              <span class="post-comment-likes">
                ${comment.likes.length} likes</span>
                
            </a>
            </button>
          </div>
          <button class="delete-btn no-btn">
            <a
              class="delete-comment-btn "
              href="/comments/destroy/${comment._id}"
              ><i class="fas fa-times"></i
            ></a>
          </button>
        </div>
      
        <div class="post-comment-content">${comment.content}</div>
      </div>
      `);
    }

    //method to delete a post from DOM
    let deleteComment=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    //addding flash message using Noty
                    new Noty({
                        theme:'relax',
                        text:'Comment Deleted!',
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

    let convertCommentsToAjax = function(){
        //chnge made here it was  $('.delete-comment-button').each(function(){
        $(`post-comments-list>div`).each(function(){
            let self = $(this);
            let deleteButton = $('delete-comment-btn', self);
            deleteComment(deleteButton);

        });
    }


    createComment();
    convertCommentsToAjax();
}

*/


// //Comments added Via AJAX

// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
      this.postId = postId;
      this.postContainer = $(`#post-${postId}`);
      this.newCommentForm = $(`#post-${postId}-comments-form`);
      this.createComment(postId);
  
      let self = this;
      // call for all the existing comments
      $(" .delete-comment-btn", this.postContainer).each(function () {
        self.deleteComment($(this));
      });
    }
  
    createComment(postId) {
      let pSelf = this;
      this.newCommentForm.submit(function (e) {
        e.preventDefault();
        let self = this;
  
        $.ajax({
          type: "post",
          url: "/comments/create",
          data: $(self).serialize(),
          success: function (data) {
            let newComment = pSelf.newCommentDom(data.data.comment);
           // console.log($(`#post-comments-${postId}`));
            $(`#post-comments-${postId}`).prepend(newComment);
            pSelf.deleteComment($(" .delete-comment-btn", newComment));
            
            new ToggleLike($('.toggle-like-button', newComment));

            new Noty({
              theme: "relax",
              text: "Comment published!",
              type: "success",
              layout: "topRight",
              timeout: 1000,
            }).show();
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });
    }
  
    newCommentDom(comment) {
      // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<div id='comment-${comment._id}' class="post-comment-item">
        <div class="post-comment-header">
          <span class="post-comment-author">
          <a href="/users/profile/${comment.user._id}">
          <img
              class="rounded-circle comment-avtar"
              src="${comment.user.avatar}"
              alt="logo"
            />
            </a>&nbsp;&nbsp;</span>
            <span class="comment-author-name">
            ${comment.user.name}</span>
          <div class="post-actions">
            <button class="post-like no-btn">
            <a data-likes="0" class="toggle-like-button" href="/likes/toggle/?id=${comment._id}&type=Comment">
            <i class="fa-regular fa-heart"></i>
              <span class="post-comment-likes">
                ${comment.likes.length}</span>
                
            </a>
            </button>
          </div>
          <button class="delete-btn no-btn">
            <a
              class="delete-comment-btn "
              href="/comments/destroy/${comment._id}"
              ><i class="fas fa-times"></i
            ></a>
          </button>
        </div>
      
        <div class="post-comment-content">${comment.content}</div>
      </div>
      `);
    }
  
    deleteComment(deleteLink) {
      $(deleteLink).click(function (e) {
        e.preventDefault();
  
        $.ajax({
          type: "get",
          url: $(deleteLink).prop("href"),
          success: function (data) {
            $(`#comment-${data.data.comment_id}`).remove();
  
            new Noty({
              theme: "relax",
              text: "Comment Deleted",
              type: "success",
              layout: "topRight",
              timeout: 1500,
            }).show();
          },
          error: function (error) {
            console.log(error.responseText);
          },
        });
      });
    }
  }