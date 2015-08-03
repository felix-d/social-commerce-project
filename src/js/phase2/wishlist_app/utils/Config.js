'use strict';

exports.widgetPopoverOptions = {
    trigger: 'hover',
    placement: 'left',
    container: '#product-widget',
    delay: {
        show: 400,
        hide: 100
    }
};

exports.productPopoverOptions = {
  trigger: 'hover',
  placement: 'auto',
  container: 'body'
};

exports.slickOptions = {
  dots: false,
  speed: 600,
  infinite: false,
  slidesToShow: 3,
  arrows: true,
  prevArrow: '<button type="button" class="btn btn-default slick-prev"><i class="fa fa-caret-left"></i></button>',
  nextArrow: '<button type="button" class="btn btn-default slick-next"><i class="fa fa-caret-right"></i></button>',
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    }
  ]
};
