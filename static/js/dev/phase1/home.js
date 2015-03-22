$(function(){
    var $agreement = $("#agreement"),
        $login = $("#login"),
        $agreeCheckBox = $("#agree-checkbox"),
        $alertAgree = $("#alert-agree"),
        $logo = $("#logo");
    $logo.show();
    $agreement.show();
    $logo.addClass("animated fadeIn");
    $agreement.addClass("animated fadeIn");
    $agreement.one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function(){
            $(this).removeClass();
        });

    
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
