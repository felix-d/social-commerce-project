var $overlay = $("#overlay"),
    $infoPopup = $("#info-popup");

function dismissInfoPopup(){
    $infoPopup.addClass("animated bounceOut");
    $overlay.addClass("animated fadeOut");
    $infoPopup.one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function(){
            $(this).remove();
        });
    $overlay.one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function(){
            $(this).hide();
            $(this).removeClass();
        });
}

$(function(){
    var $infoButton = $("#info-button"),
        $infoButton_i = $("#info-button i"),
        $collapse = $("#collapse"),
        closing = true,
        $overlay = $("#base-overlay"),
        $infoPopup = $("#info-popup");

    $infoButton.popover({
        placement: 'left'
    });
    //For the info box
    $infoButton.click(function(e){
        if(!closing){
            $infoButton_i.addClass("fa-question").removeClass("fa-times");
            closing = true;
        }
        else {
            $infoButton_i.addClass("fa-times").removeClass("fa-question");
            closing=false;
        }
    });
});
