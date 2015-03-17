window.fbAsyncInit = function() {
    FB.init({
        appId      : '1586828871554467',
        xfbml      : true,
        version    : 'v2.1'
    });

};
function shareTheProject(){
    $("#content").fadeOut(300);
    FB.ui({
        method: 'share',
        href: 'http://www.google.com/'
    }, function(response){
        // The user posted successfully
        if(response.hasOwnProperty('post_id')){
            // lets increment his step to 4! he deserved it
            $.post('/phase1/shared/',
                   {msg: "shared"},
                   function(response){
                       $("#content-success").fadeIn(300);
                   });
        }
        // He didn't! we show the first message agin
        else {
            $("#content").fadeIn(300);
        }
    });
    $(".fb_dialog_close_icon").one("click", function(){
            $("#content").fadeIn(300);
    });
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));
