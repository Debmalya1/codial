// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();

    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                //console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                let newLike;
                console.log(data.data.type);
                if(data.data.type == 'Posts')
                {
                    if(data.data.deleted == true){
                        newUnLikeDomPost(likesCount , data.data.likeable);
                    }else{
                        newLikeDomPost(likesCount , data.data.likeable);
                    }
                }
                if(data.type == 'Comments'){
                    if(data.deleted == true){
                        newLike = newUnLikeDomComment(likesCount , data.likeableType);
                    }else{
                        newLike = newLikeDomComment(likesCount , data.likeableType);
                    }
                }
                $(self).html(`${likesCount} Likes`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
    let newLikeDomPost=function(likesCount,post){
        return $(` <a data-likes=${likesCount} class="toggle-btn" href="/likes/toggle?id=${post._id}&type=Posts">
        <i class="fa-solid fa-heart"></i>
      </a>

        <span>${likesCount}</span>`);
    };

   let newUnLikeDomPost=function(likesCount,post){
        return $(` <a data-likes=${likesCount} class="toggle-btn" href="/likes/toggle?id=${post._id}&type=Posts">
        <i class="fa-regular fa-heart"></i>
      </a>

        <span>${likesCount}`); 
    }; 
    let newLikeDomComment = function (likesCount , comment) {
        return $(` <a data-likes=${likesCount} class="toggle-btn" href="/likes/toggle?id=${comment._id}&type=Comments">
        <i class="fa-solid fa-heart"></i>
      </a>

        <span>${likesCount}</span>`);
      };

      let newUnLikeDomComment = function (likesCount , comment) {
        return $(` <a data-likes=${likesCount} class="toggle-btn" href="/likes/toggle?id=${comment._id}&type=Comments">
        <i class="fa-regular fa-heart"></i>
      </a>

        <span>${likesCount}</span>`);
      };