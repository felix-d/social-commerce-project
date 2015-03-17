particlesJS('particles-js', {
  particles: {
    color: '#5bc0de',
    color_random: false,
    shape: 'circle', // "circle", "edge" or "triangle"
    opacity: {
      opacity: 1,
      anim: {
        enable: true,
        speed: 1.2,
        opacity_min: 0,
        sync: false
      }
    },
    size: 6,
    size_random: true,
    nb: 70,
    line_linked: {
      enable_auto: true,
      distance: 200,
      color: '#5bc0de',
      opacity: 1,
      width: 1,
      condensed_mode: {
        enable: false,
        rotateX: 600,
        rotateY: 600
      }
    },
    anim: {
      enable: true,
      speed: 1
    }
  },
  interactivity: {
    enable: true,
    mouse: {
      distance: 400
    },
    detect_on: 'canvas', // "canvas" or "window"
    mode: 'grab', // "grab" of false
    line_linked: {
      opacity: .4
    },
    events: {
      onclick: {
        enable: true,
        mode: 'push', // "push" or "remove"
        nb: 4
      },
      onresize: {
        enable: true,
        mode: 'out', // "out" or "bounce"
        density_auto: false,
        density_area: 800 // nb_particles = particles.nb * (canvas width *  canvas height / 1000) / density_area
      }
    }
  },
  /* Retina Display Support */
  retina_detect: true
});

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
        if(response){
            $.post('/phase1/shared/',
                   {msg: "shared"},
                   function(response){
                       $("#content-success").fadeIn(300);
                   });
        }
        else {
            $("#content").fadeIn(300);
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
