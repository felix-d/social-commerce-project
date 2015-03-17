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
var $agreement = $("#agreement"),
    $login = $("#login"),
    $agreeCheckBox = $("#agree-checkbox"),
    $alertAgree = $("#alert-agree");


function agreement(){
  if($agreeCheckBox.is(":checked")){
    $agreement.one(
      'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
      function(){
        $(this).remove();
      });
    $agreement.addClass("animated bounceOutLeft");
    $login.css({"display": "block"});
    $login.addClass("animated bounceInRight");
  } else {
    $alertAgree.css({"display": "inline-block"});
    $alertAgree.addClass("animated flipInY")
  }

}
var myCallback = function(){
  var svg = document.getElementById("logo").contentDocument.firstChild;
  var path = svg.firstChild.firstChild;
  path.setAttribute("style", "transition:all 0.5s;fill:white;stroke-opacity:0;");
  setTimeout(function(){
$("#content").css({display: "block"});
    $("#content").addClass("animated fadeIn");
    
  }, 700);
};
new Vivus('logo', {type: 'delayed', duration: 175}, myCallback);
