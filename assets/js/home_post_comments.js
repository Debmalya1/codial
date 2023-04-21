{
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
        return $(`<li id="comment-${ comment._id }">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
            </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
        </p>    
    </li>`)
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
        $('.delete-comment-button').each(function(){
            let self = $(this);
            let deleteButton = $('.delete-comment-button', self);
            deleteComment(deleteButton);

        });
    }


    createComment();
    convertCommentsToAjax();
}




