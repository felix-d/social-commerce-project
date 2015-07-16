$(function(){
    var $infoButton = $("#info-button"),
        $infoButton_i = $("#info-button i"),
        $collapse = $("#collapse"),
        closing = true,
        $overlay = $("#overlay"),
        $infoPopup = $("#info-popup"),
        $infoPopupButton = $("#info-popup-button");

    var dismissInfoPopup = function(){
        $infoPopup.addClass("animated bounceOut");
        $overlay.addClass("animated fadeOut");
        $infoPopup.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).remove();
            });
        $overlay.on(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).hide();
                $(this).removeClass();
                $(this).unbind();
            });
    };

    $infoPopupButton.click(dismissInfoPopup);

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
