window.fbAsyncInit = function() {
    FB.init({
        appId      : '1586828871554467',
        xfbml      : true,
        version    : 'v2.1'
    });

};
function shareTheProject(){
    FB.ui({
        method: 'share',
        href: 'http://www.google.com/'
    }, function(response){
        if(response){
            $.post('/phase1/shared/',
                   {msg: "shared"},
                   function(response){
                       $("#sharing").text("Thanks! You have increased your chance to win the ipad!");
                   });
        }
    });
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));

