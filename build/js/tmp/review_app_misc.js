$(function(){

    var $infoButton = $("#info-button"),
        $infoButton_i = $("#info-button i"),
        $collapse = $("#collapse"),
        closing = true;

    //For the info box
    $infoButton.click(function(e){
        if(!closing){
            $infoButton_i.addClass("fa-times").removeClass("fa-question");
            closing = true;
        }
        else {
            $infoButton_i.addClass("fa-question").removeClass("fa-times");
            closing=false;
        }
    });
});
