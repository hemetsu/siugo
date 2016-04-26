window.siugo = (function($) {

	var breakpoint = 767;

	var $window = $(window);

	function init() {
		fixedHeight();
		fixedMaxHeight();
    enableSmoothScroll();
		buildMobileNavigation();
    buildFooterForm();
    buildCarousel();
    buildPortfolio();
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
        $form = $('#main-footer-form'),
        formValidated = true;

    var clearForm = function() {
      formValidated = true;
      $form.find('input').removeClass('error');
      $form.find('textarea').removeClass('error');
      $alert.addClass('hide');
      $alert.find('.text').html('');
      $alert.removeClass('alert-danger alert-success');
    };

    var addError = function(input, msg) {
      formValidated = false;
      $(input).addClass('error');
      // $(input).val(msg);
      $alert.find('.text').html(msg);
    };

    $form.on('submit', function(e) {
      e.preventDefault();
      clearForm();

      // Required check
      $(this).find('input, textarea').each(function() {
          var val = $(this).val();
          if (val == '') {
            addError(this, 'Please fill out all fields');
          }
      });

      if (!formValidated) {
        $alert.addClass('alert-danger').removeClass('hide');
        return false;
      }

      // Email check
      $(this).find('[type="email"]').each(function() {
          var val = $(this).val(),
              regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

          if (!regex.test(val)) {
            addError(this, 'Please enter a valid email');
            $alert.addClass('alert-danger').removeClass('hide');
            return false;
          }
      });

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

  function buildCarousel() {
    $('.carousel').slick({
      dots: false,
      arrows: false,
      autoplay: true,
      fade: true,
      pauseOnHover: false
    });
  }

  function buildPortfolio() {
    /* Flickr API */
    var flickr = {
      url: 'https://api.flickr.com/services/rest/',
      format: 'json',
      key: '924da085423f538b79de8be7ac96a73c',
      user_id: '136975320@N02',
      getSets: function(callback) {
        $.ajax({
          dataType: 'json',
          url: flickr.url + '?method=flickr.photosets.getList&api_key=' + flickr.key + '&format=' + flickr.format + '&user_id=' + flickr.user_id + '&nojsoncallback=1',
          success: function(data) {
            if (callback && typeof(callback) == 'function') {
              callback(data.photosets.photoset);
            }
          }
        });
      },
      getPhotos: function(photoset_id, callback) {
        $.ajax({
          dataType: 'json',
          url: flickr.url + '?method=flickr.photosets.getPhotos&api_key=' + flickr.key + '&format=' + flickr.format + '&user_id=' + flickr.user_id + '&photoset_id=' + photoset_id + '&nojsoncallback=1',
          success: function(data) {
            if (callback && typeof(callback) == 'function') {
              callback(data);
            }
          }
        });
      }
    };

    /* Flickr calls */
    var filters = [];
    flickr.getSets(function(sets) {
      $.each(sets, function(i, set) {
        flickr.getPhotos(set.id, function(photos) {
          $.each(photos.photoset.photo, function(i, photo) {
            var smallPhoto = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id +'_' + photo.secret + '.jpg';
            var largePhoto = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id +'_' + photo.secret + '_h.jpg';

            var filter = photos.photoset.title.toLowerCase().replace(/ /g, '').replace(/&/,'-');
            
            // Add new filter
            if (filters.indexOf(photos.photoset.title) == -1) { 
              filters.push(photos.photoset.title); 
              $('#portfolio-filters').append('<button type="button" class="btn filter" data-filter=".' + filter + '">' + photos.photoset.title + '</button>');
            }

            var template = '<div class="mix ' + filter + ' portfolio-item"><a href="' + largePhoto + '" data-lightbox="' + photo.title + '" data-title="' + photo.title + '">' +
                            '<div class="portfolio-img"><img data-original="' + smallPhoto + '" alt="' + photo.title + '" /></div>' + 
                            '<div class="portfolio-label"><i class="fa fa-search-plus"></i><div class="album">' + photos.photoset.title + '</div></div>' +
                            '</a></div>';
            $('#gallery-images').append(template);

            // Lazy load
            $('.portfolio-img > img').lazyload();

          });

          /* Init Mix it up */
          setTimeout(function() {
            $('#gallery-images').on('mixEnd', function(e, state) {
              $(window).scroll();
            }).mixItUp();
          }, 200);
        });
      });
    });

  }

  function enableSmoothScroll() {
    var $mainNavigation = $('#main-navigation'),
        $bgOverlay = $('.bg-overlay', '.main-header');

    $('.smooth-scroll').on('click', function(){
      $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
      }, 500);

      if ($(this).parents('#main-navigation').length > 0) {
        $mainNavigation.removeClass('active');
        $bgOverlay.removeClass('active');
      }

      return false;
    });
  }

	return {
		init: init
	}

})(jQuery);


$(function() {
	window.siugo.init();
});