// if login was canceled 
$(function() {
        var $agreement = $("#agreement"),
            $login = $("#login"),
            $loginError= $("#login-error");
    var param = window.location.search.replace("?", "");
    if(param=='cancel'){
        $agreement.remove();
        $login.removeClass();
        $loginError.show();
        $login.show();
    }

    else {
        $agreement.show();
    }
});
function agreement(){
    var $agreement = $("#agreement"),
        $login = $("#login"),
        $agreeCheckBox = $("#agree-checkbox"),
        $alertAgree = $("#alert-agree"),
        $logo = $("#logo");
    if($agreeCheckBox.is(":checked")){
        $agreement.addClass("animated bounceOutLeft");
        $agreement.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).remove();
            });
        $login.show();
        $login.addClass("animated bounceInRight");
    } else {
        $alertAgree.css({"display": "inline-block"});
        $alertAgree.addClass("animated flipInY")
    }
}
