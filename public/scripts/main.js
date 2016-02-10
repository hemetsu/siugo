$(function() {

	// $('.logo-wrapper').fitText(1.2, { minFontSize: '10px', maxFontSize: '14px' });

	// $('body').flowtype({
	//    minFont : 10,
	//    maxFont : 14
	// });

	/*
	 * Replace all SVG images with inline SVG
	 */
  $('img.svg').each(function(){
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find('svg');

          // Add replaced image's ID to the new SVG
          if(typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if(typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass+' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Replace image with new SVG
          $img.replaceWith($svg);

      }, 'xml');

  });


  var $mainContainer = $('#main-container.home');

  var updateMainContainerHeight = function() {
  	var height = $mainContainer.height() / 2;
  	$mainContainer.css({
  		marginTop: -height + 'px'
  	});
  	$mainContainer.addClass('center');
  };

  $(window).on('resize', updateMainContainerHeight);
  updateMainContainerHeight();

  $('[data-toggle="tab"]','#home-tabs').on('click', function(e) {
  	$mainContainer.addClass('section-active');
  	console.log($(this).attr('href'));
  	if ($(this).attr('href') == '#gallery') {
			// Mixitup
			if (!$('#gallery-images').hasClass('activated')) {
				setTimeout(function() {
					$('#gallery-images').addClass('activated').mixItUp();
				}, 200);
			}
  	}
  });

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

	flickr.getSets(function(sets) {
		$.each(sets, function(i, set) {
			flickr.getPhotos(set.id, function(photos) {
				$.each(photos.photoset.photo, function(i, photo) {
					var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id +'_' + photo.secret + '.jpg';

					var filter = photos.photoset.title.toLowerCase().replace(/ /g, '').replace(/&/,'-');

					var template = '<div class="mix ' + filter + '" style="background-image:url(' + url + ')" alt="' + photo.title + '">' +
													'<div><i class="fa fa-search-plus"></i><div class="album">' + photos.photoset.title + '</div></div>' +
													'</div>';
					$('#gallery-images').append(template);
				});

			});
		});
	});

});
