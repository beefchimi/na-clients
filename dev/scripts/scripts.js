document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elBody = document.body;


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
			elGalleryImage          = document.getElementById('gallery_image'),
			arrGalleryImages        = [],
			dataCurrent,
			dataSRC;

		for (var i = 0; i < numGalleryCount; i++) {
			launchGallery(arrGalleryLinks[i], i);
		}

		function launchGallery(thisGalleryLink, index) {

			arrGalleryImages.push(thisGalleryLink.getAttribute('href'));

			thisGalleryLink.addEventListener('click', function(e) {

				dataCurrent = index;

				loadImage();

				elBody.setAttribute('data-gallery', 'active');

				e.preventDefault();

			});

		}

		function loadImage() {

			dataSRC = arrGalleryImages[dataCurrent];

			console.log(dataCurrent);
			console.log(dataSRC);

			var newImg = new Image;

			newImg.onload = function() {
				elGalleryImage.src = this.src;
			}

			newImg.src = dataSRC;

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

			elBody.setAttribute('data-gallery', 'inactive');

			e.preventDefault();

		});

	}


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	gallery();


}, false);