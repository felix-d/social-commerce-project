window.fbAsyncInit = () => {
  window.FB.init({
    appId: '1586828871554467',
    xfbml: true,
    version: 'v2.5',
  });
};

function shareTheProject() { // eslint-disable-line
  $('#content').fadeOut(300);
  window.FB.ui({
    method: 'share',
    href: 'http://www.google.com/',
  }, response => {
    // The user posted successfully
    if (response !== undefined) {
      // lets increment his step to 4! he deserved it
      $.post('/phase1/shared/',
             {msg: 'shared'},
             () => {
               $('#content-success').fadeIn(300);
             });
    } else {
      // Did not share.
      $('#content').fadeIn(300);
    }
  });
  $('.fb_dialog_close_icon').one('click', () => {
    $('#content').fadeIn(300);
  });
}


/* eslint-disable */
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));
