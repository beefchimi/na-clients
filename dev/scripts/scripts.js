document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var transitionEvent = whichTransitionEvent(),
		animationEvent  = whichAnimationEvent(),
		elHTML          = document.documentElement,
		elBody          = document.body,
		elOverlay,
		elPackery;

	// window measurement variables
	var numWindowWidth    = window.innerWidth,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWindowWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;


	// Helper: Check when a CSS transition or animation has ended
	// ----------------------------------------------------------------------------
	function whichTransitionEvent() {

		var trans,
			element     = document.createElement('fakeelement'),
			transitions = {
				'transition'       : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'MozTransition'    : 'transitionend',
				'WebkitTransition' : 'webkitTransitionEnd'
			}

		for (trans in transitions) {
			if (element.style[trans] !== undefined) {
				return transitions[trans];
			}
		}

	}

	function whichAnimationEvent() {

		var anim,
			element    = document.createElement('fakeelement'),
			animations = {
				'animation'       : 'animationend',
				'OAnimation'      : 'oAnimationEnd',
				'MozAnimation'    : 'animationend',
				'WebkitAnimation' : 'webkitAnimationEnd'
			}

		for (anim in animations) {
			if (element.style[anim] !== undefined) {
				return animations[anim];
			}
		}

	}


	// Helper: Fire Window Resize Event Upon Finish
	// ----------------------------------------------------------------------------
	var waitForFinalEvent = (function() {

		var timers = {};

		return function(callback, ms, uniqueId) {

			if (!uniqueId) {
				uniqueId = 'beefchimi'; // Don't call this twice without a uniqueId
			}

			if (timers[uniqueId]) {
				clearTimeout(timers[uniqueId]);
			}

			timers[uniqueId] = setTimeout(callback, ms);

		};

	})();


	// Helper: CSS Fade In / Out
	// ----------------------------------------------------------------------------
	function fadeIn(thisElement) {

		// make the element fully transparent
		// (don't rely on a predefined CSS style... declare this with JS to getComputedStyle)
		thisElement.style.opacity = 0;

		// make sure the initial state is applied
		window.getComputedStyle(thisElement).opacity;

		// set opacity to 1 (CSS transition will handle the fade)
		thisElement.style.opacity = 1;

	}

	function fadeOut(thisElement) {

		// set opacity to 0 (CSS transition will handle the fade)
		thisElement.style.opacity = 0;

	}


	// Helper: Create loading animation
	// ----------------------------------------------------------------------------
	function createLoader() {

		// create loader elements
		var elLoader     = document.createElement('div'),
			elLoaderWrap = document.createElement('div'),
			elLoaderSVG  = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			elLoaderUse  = document.createElementNS('http://www.w3.org/2000/svg', 'use');

		// define loader attributes
		elLoader.setAttribute('class', 'loader_overlay');
		elLoaderWrap.setAttribute('class', 'wrap_svg');
		elLoaderUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#ui_loader');

		// append loader elements
		elLoaderSVG.appendChild(elLoaderUse);
		elLoaderWrap.appendChild(elLoaderSVG);
		elLoader.appendChild(elLoaderWrap);

		return elLoader;

	}


	// Helper: Lock / Unlock Body Scrolling
	// ----------------------------------------------------------------------------
	function lockBody() {

		classie.add(elHTML, 'overlay_active');

		// if necessary, accomodate for scrollbar width
		if (hasScrollbar) {
			elBody.style.paddingRight = numScrollbarWidth + 'px';
		}

	}

	function unlockBody() {

		classie.remove(elHTML, 'overlay_active');

		// if necessary, remove scrollbar width styles
		// should be expanded to restore original padding if needed
		if (hasScrollbar) {
			elBody.style.paddingRight = '0px';
		}

	}


	// Helper: Create and Destroy [data-overlay] element
	// ----------------------------------------------------------------------------
	function createOverlay(childElement, strLabel) {

		// create document fragment
		var docFrag = document.createDocumentFragment();

		// lockBody();

		// create empty overlay <div>
		elOverlay = document.createElement('div');

		// set data-overlay attribute as passed strLabel value
		elOverlay.setAttribute('data-overlay', strLabel);

		// append passed child elements
		elOverlay.appendChild(childElement);

		// append the [data-overlay] to the document fragement
		docFrag.appendChild(elOverlay);

		// empty document fragment into <body>
		elBody.appendChild(docFrag);

		fadeIn(elOverlay);

	}

	function destroyOverlay() {

		fadeOut(elOverlay);

		// listen for CSS transitionEnd before removing the element
		elOverlay.addEventListener(transitionEvent, removeOverlay);

		// maybe expand this to be passed an ID, and it can destroy / remove any element?
		function removeOverlay(e) {

			// only listen for the opacity property
			if (e.propertyName == "opacity") {

				// unlockBody();

				// remove elOverlay from <body>
				elBody.removeChild(elOverlay);

				// must remove event listener!
				elOverlay.removeEventListener(transitionEvent, removeOverlay);

			}

		}

	}


	// pageLoaded: Execute once the page has loaded and the FOUT animation has ended
	// ----------------------------------------------------------------------------
	function pageLoaded() {

		var elHeader = document.getElementsByTagName('header')[0];

		elHeader.addEventListener(animationEvent, removeFOUT);

		function removeFOUT() {

			classie.add(elHTML, 'ready');
			elHeader.removeEventListener(animationEvent, removeFOUT);

			layoutPackery();

		}

	}


	// layoutPackery: Wait until images are loaded then layout with packery.js
	// ----------------------------------------------------------------------------
	function layoutPackery() {

		var elPackeryContainer = document.getElementById('packery'),
			arrArticles        = document.getElementsByTagName('article');

		// layout Packery after all images have loaded
		imagesLoaded(elPackeryContainer, function(instance) {

			// initalize packery
			elPackery = new Packery(elPackeryContainer, {
				itemSelector: 'article',
				gutter: 'div.gutter-sizer'
			});

			// hide loader?

			// iterate through each article and add 'loaded' class once ready
			for (var i = 0; i < arrArticles.length; i++) {
				(function(i){
					setTimeout(function() {
						classie.add(arrArticles[i], 'loaded');
					}, 200 * i);
				})(i);
			}

		});

	}


	// photoGallery: Photo section modal gallery
	// ----------------------------------------------------------------------------
	function photoGallery() {

		// get all <a.gallery_link>s in document (ignore <div>s with same class)
		var arrGalleryLinks = document.querySelectorAll('a.gallery_link'),
			numGalleryCount = arrGalleryLinks.length;

		// check if arrGalleryLinks is not empty
		if (numGalleryCount === 0) {
			return; // array is empty... exit function
		}

		// define & scope variables for child functions
		var numGalleryCountAdjusted = numGalleryCount - 1,
			arrGallerySource        = [],
			arrGalleryTitle         = [],
			boolFirstRun            = true,
			elGalleryModal,
			elGalleryNav,
			elGalleryPrev,
			elGalleryNext,
			elGalleryClose,
			elGalleryTitle,
			elGalleryImage,
			elGalleryLoader,
			dataCurrent;

		for (var i = 0; i < numGalleryCount; i++) {

			// push a.gallery_link href to arrGallerySource array
			arrGallerySource.push(arrGalleryLinks[i].getAttribute('href'));
			arrGalleryTitle.push(arrGalleryLinks[i].getAttribute('title'));

			// attach this a.gallery_link click event
			arrGalleryLinks[i].addEventListener('click', launchGallery);

		}

		// create <aside data-modal> element and children
		function createGalleryModal() {

			// create and define modal variables as new elements
			elGalleryModal  = document.createElement('aside');
			elGalleryNav    = document.createElement('nav');
			elGalleryLoader = createLoader();

			// create new modal variables
			// var elGalleryNavWrap = document.createElement('div');

			// define <aside> attributes
			elGalleryModal.setAttribute('data-modal', 'gallery');

			// hide scroll bar if necessary (don't worry about removing this, as the element will get destroyed)
			if (hasScrollbar) {
				elGalleryModal.style.right = -numScrollbarWidth + 'px';
				elGalleryModal.style.width = 'calc(100% + ' + numScrollbarWidth + 'px)';
			}

			// define contents of nav links
			var arrNavLinks = [
					{ id: 'prev',  xlink: '#ui_arrow', title: 'Previous Image' },
					{ id: 'next',  xlink: '#ui_arrow', title: 'Next Image'     }
					// { id: 'close', xlink: '#ui_close', title: 'Close Image'    }
				];

			// define <nav> attributes
			elGalleryNav.setAttribute('class', 'nav_gallery');
			// elGalleryNavWrap.setAttribute('data-container', 'width_1200');

			// iterate through each nav link
			for (var i = 0; i < arrNavLinks.length; i++) {

				// create nav links (svg & use require a namespace)
				var thisNavLink = document.createElement('a'),
					thisSVG     = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
					thisUse     = document.createElementNS('http://www.w3.org/2000/svg', 'use');

				// define nav link attributes
				thisNavLink.setAttribute('href', '#');
				thisNavLink.setAttribute('title', arrNavLinks[i].title);
				thisNavLink.setAttribute('class', 'wrap_svg nav_' + arrNavLinks[i].id);

				// define namespaced element attributes
				thisUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', arrNavLinks[i].xlink);

				// append nav link elements
				thisSVG.appendChild(thisUse);
				thisNavLink.appendChild(thisSVG);
				// elGalleryNavWrap.appendChild(thisNavLink);
				elGalleryNav.appendChild(thisNavLink);

			}

			// build close link
			elGalleryClose = document.createElement('a');
			elGalleryClose.title = 'Close Image';
			elGalleryClose.setAttribute('href', '#');
			elGalleryClose.setAttribute('class', 'nav_close');
			elGalleryClose.innerHTML = 'Back';

			// built title
			elGalleryTitle = document.createElement('h4');

			// elGalleryNavWrap.appendChild(elGalleryClose);
			elGalleryNav.appendChild(elGalleryClose);
			elGalleryNav.appendChild(elGalleryTitle);

			// append nav, image, and loader
			// elGalleryNav.appendChild(elGalleryNavWrap);
			elGalleryModal.appendChild(elGalleryNav);

			// elGalleryModal.appendChild(elGalleryImage);

			elGalleryModal.appendChild(elGalleryLoader);

			// create overlay and append gallery modal, pass 'gallery' as data-overlay value
			createOverlay(elGalleryModal, 'gallery');

			// get reference to nav links
			elGalleryPrev  = document.getElementsByClassName('nav_prev')[0];
			elGalleryNext  = document.getElementsByClassName('nav_next')[0];
			// elGalleryClose = document.getElementsByClassName('nav_close')[0];

		}

		// a.gallery_link click event
		function launchGallery(e) {

			// retreive this <a.gallery_link>s data-gallery value
			dataCurrent = parseInt( this.getAttribute('data-gallery') );

			createGalleryModal();
			loadImage();

			elGalleryPrev.addEventListener('click', galleryPrevious);
			elGalleryNext.addEventListener('click', galleryNext);
			elGalleryClose.addEventListener('click', clickClose);
			elGalleryModal.addEventListener('click', clickModal);

			e.preventDefault();

		}

		// load the next image
		function loadImage() {

			if (boolFirstRun) {

				// add loading classes
				classie.add(elGalleryLoader, 'visible');

				updateImageSrc();
				boolFirstRun = false;

			} else {

				// add loading classes
				classie.add(elGalleryLoader, 'visible');

				// remove 'img_loaded' class - return to opacity: 0;
				classie.remove(elGalleryModal, 'img_loaded');

				// listen for CSS transitionEnd before setting new image src
				elGalleryImage.addEventListener(transitionEvent, galleryTransitionEnd);

			}

		}

		function updateImageSrc() {

			// scroll the <aside> to 0 so we don't end up opening a new image that is scrolled half way down
			elGalleryModal.scrollTop = 0;

			// build new image
			elGalleryImage = document.createElement('img');
			elGalleryImage.setAttribute('src', arrGallerySource[dataCurrent]);
			elGalleryModal.appendChild(elGalleryImage);

			elGalleryTitle.innerHTML = arrGalleryTitle[dataCurrent];

			// use imagesLoaded to check image progress
			var imgLoad = imagesLoaded(elGalleryModal);

			imgLoad.on('always', onAlways);

		}

		// require that the opacity of the previous image has reached 0 before continuing
		function galleryTransitionEnd(e) {

			// once opacity has reached 0
			if (e.propertyName == "opacity") {

				// remove previous image
				elGalleryModal.removeChild(elGalleryImage);

				updateImageSrc();

			}

		}

		// hide status when done
		function onAlways() {

			classie.remove(elGalleryLoader, 'visible');
			classie.add(elGalleryModal, 'img_loaded');

		}

		// #nav_prev click event
		function galleryPrevious(e) {

			// do not allow click is the image has not loaded
			if ( classie.has(elGalleryModal, 'img_loaded') ) {

				// if we are on the very first image (0),
				// clicking 'prev' should take us to the last image,
				// otherwise, increment down
				if (dataCurrent <= 0) {
					dataCurrent = numGalleryCountAdjusted;
				} else {
					dataCurrent--;
				}

				loadImage();

			}

			e.preventDefault();

		}

		// #nav_next click event
		function galleryNext(e) {

			// do not allow click is the image has not loaded
			if ( classie.has(elGalleryModal, 'img_loaded') ) {

				// if we are on the very last image,
				// clicking 'next' should take us to the first image (0),
				// otherwise, increment up
				if (dataCurrent >= numGalleryCountAdjusted) {
					dataCurrent = 0;
				} else {
					dataCurrent++;
				}

				loadImage();

			}

			e.preventDefault();

		}

		// destroy the modal + overlay
		function galleryClose() {

			boolFirstRun = true;

			// destroy [data-overlay], including <aside> child
			destroyOverlay();

			// remove click event from nav links (does this matter?)
			elGalleryPrev.removeEventListener('click', galleryPrevious);
			elGalleryNext.removeEventListener('click', galleryNext);
			elGalleryClose.removeEventListener('click', clickClose);
			elGalleryModal.removeEventListener('click', clickModal);

		}

		// #nav_close click event
		function clickClose(e) {

			galleryClose();

			e.preventDefault();

		}

		// gallery modal click event (ignore image or nav)
		function clickModal(e) {

			if (e.target === elGalleryModal) {

				// ignore this event if preventDefault has been called
				if (e.defaultPrevented) {
					return;
				}

				galleryClose();

			}

		}

	}


/*
	// Window Events: Resize
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// re-measure window width and height on resize
		numWindowWidth  = window.innerWidth;

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			// required to fire layout a second time...
			// packery seems to layout too quickly and sometimes miscalculates
			elPackery.layout();

		}, 500, 'unique string');

	});
*/


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	pageLoaded();
	photoGallery();


});