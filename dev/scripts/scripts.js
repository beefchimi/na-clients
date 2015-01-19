docReady(function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML   = document.documentElement,
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
					}, 200 * i);
				})(i)
			}

			// once our images have loaded, it is safe to initialize gallery()
			gallery();

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

				classie.add(elHTML, 'overlay_active');

				e.preventDefault();

			});

		}

		function loadImage() {

			// scroll the <aside> to 0 so we don't end up opening a new image that is scrolled half way down
			elGalleryOverlay.scrollTop = 0;

			// get the iamge source from our array
			dataSRC = arrGallerySource[dataCurrent];

			// set the new image source
			elGalleryImage.src = dataSRC;

			// set the new image title
			elGalleryTitle.innerHTML = arrGalleryTitle[dataCurrent];

			// current not used for anything... set data-current on <aside>
			elGalleryOverlay.setAttribute('data-current', dataCurrent);

		}

		elGalleryPrev.addEventListener('click', function(e) {

			if (dataCurrent <= 0) {
				dataCurrent = numGalleryCountAdjusted;
			} else {
				dataCurrent--;
			}

			loadImage();

			e.preventDefault();

		});

		elGalleryNext.addEventListener('click', function(e) {

			if (dataCurrent >= numGalleryCountAdjusted) {
				dataCurrent = 0;
			} else {
				dataCurrent++;
			}

			loadImage();

			e.preventDefault();

		});

		elGalleryClose.addEventListener('click', function(e) {

			classie.remove(elHTML, 'overlay_active');

			e.preventDefault();

		});

	}


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	layoutPackery();


});