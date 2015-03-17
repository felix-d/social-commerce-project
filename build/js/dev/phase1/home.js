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
