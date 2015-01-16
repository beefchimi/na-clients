// document.addEventListener('DOMContentLoaded', function() {
docReady(function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elBody   = document.body,
		elMain   = document.getElementsByTagName('main')[0],
		elLoader = document.getElementById('loader');


	// Packery: Lay them bitches out
	// ----------------------------------------------------------------------------
	function layoutPackery() {

		var arrArticles = elMain.getElementsByTagName('article');

		// layout Packery after all images have loaded
		imagesLoaded(elMain, function(instance) {

			// initalize packery
			var elPackery = new Packery(elMain, {
				itemSelector: 'article',
				gutter: 'div.gutter-sizer',
				transitionDuration: '0.6s',
				visibleStyle: {
					opacity: 1,
					transform: 'scale(1)'
				},
				hiddenStyle: {
					opacity: 0,
					transform: 'scale(1)'
				}
			});

			// hide loader by removing 'visible' class
			classie.remove(elLoader, 'visible');

			// iterate through each article and add 'loaded' class once ready
			for (var i = 0; i < arrArticles.length; i++) {
				(function(i){
					setTimeout(function() {
						classie.add(arrArticles[i], 'loaded');
						console.log(200 * i);
					}, 200 * i);
				})(i)
			}


		});

	}


	// Gallery
	// ----------------------------------------------------------------------------
	function gallery() {

		var arrGalleryLinks         = document.querySelectorAll('.gallery_link'),
			numGalleryCount         = arrGalleryLinks.length,
			numGalleryCountAdjusted = numGalleryCount - 1,
			elGalleryOverlay        = document.getElementById('gallery'),
			elGalleryPrev           = document.getElementById('nav_prev'),
			elGalleryNext           = document.getElementById('nav_next'),
			elGalleryClose          = document.getElementById('nav_close'),
			elGalleryTitle          = document.getElementById('title_current'),
			elGalleryImage          = document.getElementById('gallery_image'),
			arrGallerySource        = [],
			arrGalleryTitle         = [],
			dataCurrent,
			dataSRC;

		for (var i = 0; i < numGalleryCount; i++) {
			launchGallery(arrGalleryLinks[i], i);
		}

		function launchGallery(thisGalleryLink, index) {

			arrGallerySource.push(thisGalleryLink.getAttribute('href'));
			arrGalleryTitle.push(thisGalleryLink.getAttribute('title'));

			thisGalleryLink.addEventListener('click', function(e) {

				dataCurrent = index;

				loadImage();

				elBody.setAttribute('data-gallery', 'active');

				e.preventDefault();

			});

		}

		function loadImage() {

			dataSRC = arrGallerySource[dataCurrent];

/*
			var newImg = new Image;

			newImg.onload = function() {
				elGalleryImage.src = this.src;
			}

			newImg.src = dataSRC;
*/

			elGalleryImage.src = dataSRC;

			// fadeIn();

			elGalleryTitle.innerHTML = arrGalleryTitle[dataCurrent];
			elGalleryOverlay.setAttribute('data-current', dataCurrent);

		}

		elGalleryPrev.addEventListener('click', function(e) {

			if (dataCurrent <= 0) {
				dataCurrent = numGalleryCountAdjusted;
			} else {
				dataCurrent--;
			}

			loadImage();
			// fadeOut();

			e.preventDefault();

		});

		elGalleryNext.addEventListener('click', function(e) {

			if (dataCurrent >= numGalleryCountAdjusted) {
				dataCurrent = 0;
			} else {
				dataCurrent++;
			}

			loadImage();
			// fadeOut();

			e.preventDefault();

		});

		elGalleryClose.addEventListener('click', function(e) {

			elBody.setAttribute('data-gallery', 'inactive');

			e.preventDefault();

		});

	}


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	layoutPackery();
	gallery();


/*

		function fadeOut() {

			elGalleryImage.style.opacity = 1;

			(function fade() {

				if ( (elGalleryImage.style.opacity -= .1) < 0 ) {
					loadImage(); // now loadImage
				} else {
					requestAnimationFrame(fade);
				}

			})();

		}

		function fadeIn() {

			elGalleryImage.style.opacity = 0;

			(function fade() {

				var val = parseFloat(elGalleryImage.style.opacity);

				if ( !((val += .1) > 1) ) {
					elGalleryImage.style.opacity = val;
					requestAnimationFrame(fade);
				}

			})();

		}
*/


});
// }, false);