window.siugo = (function($) {

	var breakpoint = 767;

	var $window = $(window);

	function init() {
		fixedHeight();
		fixedMaxHeight();
		buildMobileNavigation();
    buildFooterForm();
	}

	function fixedHeight() {
    var $fixedHeight = $('.fixed-height');
    $fixedHeight.height($window.height());

    $window.on('resize', function() {
        $fixedHeight.height($(this).height());
    });
  }

  function fixedMaxHeight() {
    var $fixedHeight = $('.fixed-max-height');
    $fixedHeight.css('maxHeight', $window.height());

    $window.on('resize', function() {
      $fixedHeight.css('maxHeight', $(this).height());
    });
  }

  function buildMobileNavigation() {
	  var $mobileBtn = $('#btn-mobile-menu'),
	      $closeBtn = $('#btn-mobile-menu-close'),
	      $mainNavigation = $('#main-navigation'),
	      $bgOverlay = $('.bg-overlay', '.main-header');

	  $mobileBtn.on('click', function(e) {
      e.preventDefault();
      console.log('test');
      $mainNavigation.addClass('active');
      $bgOverlay.addClass('active');
	  });

	  $closeBtn.on('click', function(e) {
      e.preventDefault();
      $mainNavigation.removeClass('active');
      $bgOverlay.removeClass('active');
	  });

	  $bgOverlay.on('click', function(e) {
      e.preventDefault();
      $mainNavigation.removeClass('active');
      $bgOverlay.removeClass('active');
	  });

	  $window.on('resize', function() {
      if ($(this).width() >= breakpoint) {
          $mainNavigation.removeClass('active');
          $bgOverlay.removeClass('active');
      }
	  });
	}

  function buildFooterForm() {
    var $alert = $('#form-alert'),
        $form = $('#main-footer-form');

    var clearForm = function() {
      $alert.addClass('hide');
      $alert.find('.text').html('');
      $alert.removeClass('alert-danger alert-success');
    };

    $form.on('submit', function(e) {
      e.preventDefault();
      clearForm();

      $.ajax('/contact', {
        type: $(this).attr('method'),
        data: $(this).serialize(),
        error: function(data) {
          $alert.addClass('alert-danger').removeClass('hide');
          $alert.find('.text').html(data);
        },
        success: function(data) {
          $alert.addClass('alert-success').removeClass('hide');
          $alert.find('.text').html(data);
        }
      });
    });
  }

	return {
		init: init
	}

})(jQuery);


$(function() {
	window.siugo.init();
});