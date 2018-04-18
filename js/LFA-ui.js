//=============================================================================


var LFA = LFA || {};
LFA.ui = {
		THROTTLE_RATE : 100,
		ANIMATION_DELAY : 500,
};

// Swipe sensitivity (default is 30) 
$.event.special.swipe.horizontalDistanceThreshold = 150; 
$.event.special.swipe.durationThreshold = 150; // Default 1000

/*
 * A convenient wrapper around SVG images with PNG fallbacks.
 * 
 * Options:
 * svgUrl (Optional)
 * pngUrl (Optional)
 * clazz (Optional)
 * svgUrlPressed (Optional)
 * pngUrlPressed (Optional)
 */
LFA.ui.SVGwithPNGfallback = function(selector, options){
	this.container = selector ? $(selector) : $('<div></div>');
	
	this._init = function(){
		if(options.clazz){
			this.container.addClass(options.clazz);
		}
		/*
		this.object = $('<object></object>').attr('type','image/svg+xml').appendTo(this.container);
		this.img = $('<img>').attr('alt', 'Browser fail').appendTo(this.object);
		this.setSrc(options.svgUrl || '', options.pngUrl || '', options.svgUrlPressed, options.pngUrlPressed);
		*/
		
		this.img = $('<img>').css({height : '100%', width : '100%'}).appendTo(this.container);
		this.setSrc(options.svgUrl || '', options.pngUrl || '', options.svgUrlPressed, options.pngUrlPressed);
	};
	
	
	this.setSrc = function(svgUrl, pngUrl, svgUrlPressed, pngUrlPressed){
		/*
		this.object.attr('data', svgUrl);
		this.img.attr('src', pngUrl);
		
		if(svgUrlPressed){
			this.container.mousedown($.proxy(function(){this.object.attr('data', svgUrlPressed);}, this));
			this.container.mouseup($.proxy(function(){this.object.attr('data', svgUrl);}, this));
		}
		if(pngUrlPressed){
			this.container.mousedown($.proxy(function(){this.img.attr('src', pngUrlPressed);}, this));
			this.container.mouseup($.proxy(function(){this.img.attr('src', pngUrl);}, this));
		}
		*/
		
		this.img.attr('src', pngUrl);
	};
	
	this.on = function(eventName, callback){
		//console.log('Attaching callback', callback, 'to', this.object.find("svg"));
		
		/*
		this.object.find("svg").on(eventName, callback);
		this.img.on(eventName, callback);
		*/
		
		this.container.on(eventName, callback);
	};
	
	this._init();
};



LFA.ui._createMenuBoxDivider = function(){
	return $('<img>').addClass('LFA-menu-box-divider').attr('src', 'img/png/divider.png');
};


//=============================================================================


/*
 * Options:
 * scrollAmount - function() return the position we should scroll to when hiding the background image.
 * beforeHideBackground - function()
 * afterHideBackground - function()
 * beforeShowBackground - function()
 * afterShowBackground - function()
 */
LFA.ui.ScrollBarManager = function(options){
	
	//BEGIN code borrowed from stackoverfow thread
	this.preventDefault = function(e) {
		e = e || window.event;
		if (e.preventDefault){e.preventDefault();}
		e.returnValue = false;  
	};

	this.wheel = $.proxy(function(e) {
		this.preventDefault(e);
	}, this);

	this.disable_scroll = function() {
		if (window.addEventListener) {window.addEventListener('DOMMouseScroll', this.wheel, false);}
		window.onmousewheel = document.onmousewheel = this.wheel;
	};

	this.enable_scroll = function() {
		if (window.removeEventListener) {window.removeEventListener('DOMMouseScroll', this.wheel, false);}
		window.onmousewheel = document.onmousewheel = null;  
	};
	//END code borrowed from stackoverfow thread
	

	this._smoothScroll = function(st, delay, onComplete){
		console.log('_smoothScroll to scrollTop ' + st);
		$('html, body').stop().animate({scrollTop: st}, delay || 400, 'easeInOutExpo', onComplete);
	};


	this.hideBackground = function(onComplete){
		this.disable_scroll();
		$(window).unbind('scroll', this.scrollHandlerBackgroundVisible);
		
		if(options.beforeHideBackground){
			options.beforeHideBackground();
		}
		
		this._smoothScroll(options.scrollAmount(), null, $.proxy(function(){
			this.enable_scroll();
			$(window).on('scroll', this.scrollHandlerBackgroundHidden);	
			if(options.afterHideBackground){options.afterHideBackground();};
			if(onComplete){onComplete();}
		}, this));
	};

	
	this.showBackground = function(onComplete){
		this.disable_scroll();
		$(window).unbind('scroll', this.scrollHandlerBackgroundHidden);
		
		if(options.beforeShowBackground){
			options.beforeShowBackground();
		}
		
		this._smoothScroll(0, null, $.proxy(function(){
			this.enable_scroll();
			$(window).on('scroll', this.scrollHandlerBackgroundVisible);
			if(options.afterShowBackground){options.afterShowBackground();};
			if(onComplete){onComplete();}	
		}, this));
	};
	
	
	this.scrollHandlerBackgroundHidden = $.throttle(LFA.ui.THROTTLE_RATE, 
			$.proxy(function(event){
				if($(window).scrollTop() < options.scrollAmount()){
					this.showBackground();
				}
			}, this));

	this.scrollHandlerBackgroundVisible = $.throttle(LFA.ui.THROTTLE_RATE, 
			$.proxy(function(event){
				if($(window).scrollTop() > 0){
					this.hideBackground();
				}
			}, this));
	
	
	// Attach the scroll handler
	$(window).scroll(this.scrollHandlerBackgroundVisible);
};


// TODO: We can probably replace that at the some point with a better detection
LFA.ui.isDesktop = function(){
	//return $(window).width() > 780;
	return !('ontouchstart' in document.documentElement);
};


//=============================================================================

/*
 * A UI PLayer class.
 * Options:
 * onTogglePause - function()
 * onVolumeClicked - function(volumeLevel), volumeLevel is an integer between 0 and 4.
 */
LFA.ui.Player = function(selector, options){
	
	this.container = $(selector);
	
	//-------------------------------------------------------------------------
	// Private methods
	
	this._init = function(){
		this.container.addClass(LFA.ui.isDesktop() ? 'transparent' : 'opaque');
		
		// Create and attach the DOM elements...
		
		var div = $.proxy(function(){return $('<div></div>').appendTo(this.container);}, this);
		
		this.isPaused = true;
		this.playBtn = new LFA.ui.SVGwithPNGfallback(null, {});
		this._setPlayBtn();
		this.playBtn.container.addClass('LFA-player-item').css({width : '42px', float : 'left'}).appendTo(this.container);
		
		this.title = div().addClass('LFA-player-item LFA-player-title').css({float : 'left'});
		this.subTitle = div().addClass('LFA-player-item').css({float : 'left', 'margin-left' : '4px'}); //.addClass('hide-on-mobile');
		
		this.vol = new LFA.ui.PlayerVolumeWidget(null, {onClick : options.onVolumeClicked || $.noop});
		this.vol.container.addClass('LFA-player-item').appendTo(this.container);
			
		this.time = div().addClass('LFA-player-item').css({float : 'right', 'margin-right' : '15px'}); //.html('00:00');
		
		
		this.progressBarLoaded = $('<div></div>').css({background: 'rgb(170,170,170)', width: 0, height: '100%', position: 'absolute', left: 0, top: 0});
		this.progressBarPlayed = $('<div></div>').css({background: 'rgb(0,220,220)', width: 0, height: '100%', position: 'absolute', left: 0, top: 0});
		this.progressBar = div().css({height : '1px', width:'100%', background : 'rgb(100,100,100)', clear : 'both', position:'absolute', bottom:'0'}).append(this.progressBarLoaded).append(this.progressBarPlayed);
		
		// Attach provided callback functions ...
		this.playBtn.container.click(jQuery.proxy(function(){
			this.isPaused = ! this.isPaused;
			this._setPlayBtn();
			
			if(options.onTogglePause){options.onTogglePause();}
		}, this));
	};
	
	
	this._setPlayBtn = function(){
		if(this.isPaused){
			this.playBtn.setSrc('img/png/play.png', 'img/png/play.png');
		} else {
			this.playBtn.setSrc('img/png/pause.png', 'img/png/pause.png');
		}
	};
	
	//-------------------------------------------------------------------------
	// Public methods

	// TODO: Get rid of it once we have it in a parent class
	this.layout = function(){};
	
	
	this.show = function(){
		this.container.show("slide", {direction: (LFA.ui.isDesktop() ? "up" : "down") }, LFA.ui.ANIMATION_DELAY);
		this.layout();
	};
	
	
	this.updateProgress = function(bytesLoaded, bytesTotal, playPositionInMs, songDurationInMs){
		// If someone else has started the audio player, let's make sure our UI is in sync 
		if(this.isPaused){
			this.isPaused = false;
			this._setPlayBtn();
		}
		
		var loadedPercent = Math.ceil(100 * bytesLoaded / bytesTotal);
		var playedPercent = Math.ceil(100 * playPositionInMs / songDurationInMs);

		this.progressBarLoaded.css('width', loadedPercent + '%');
		this.progressBarPlayed.css('width', playedPercent + '%');
		
		var m = Math.floor(Math.floor(playPositionInMs / 1000) / 60);
		var s = Math.floor(Math.floor(playPositionInMs / 1000) % 60);
		var t = (m < 10 ? "0" :"") + m + ":" + (s < 10 ? "0" :"") + s;
		this.time.html(t);
	};
	
	
	this.finishedPlaying = function(){
		this.progressBarPlayed.css('width', 0);
		this.time.html('00:00');
		this.isPaused = true;
		this._setPlayBtn();
	};

	
	this.play = function(){
		this.playBtn.container.click();
	};
	
	
	this.setTextFields = function(textFields){
		this.title.html(textFields.title);
		if(textFields.subTitle){
			 this.subTitle.html(' - ' + textFields.subTitle);
		}
	};
	
	//-------------------------------------------------------------------------
	// Initialize the object ...
	this._init();
};


/**
 * Options
 * volumeLevel - Integer between 0 and 4.
 * isMuted - Boolean.
 * onClick
 */
LFA.ui.PlayerVolumeWidget = function(selector, options){
	options = options || {};
	this.container = $(selector || '<div></div>');
	
	this._init = function(){
		this.container.addClass('LFA-vol-widget hide-on-mobile');
		this.volumeLevel = options.volumeLevel || 4; // By default, assume full volume
		this.isMuted = options.isMuted || false;
		
		this.icon = $('<div></div>').addClass('LFA-vol-widget-icon').appendTo(this.container);
		this.volumeLevels = [];
		this.volumeLevelWrappers = [];
		for (var i = 0; i < 4; i++) {
			var wrapper = $('<div></div>').addClass('LFA-vol-widget-level-wrapper').appendTo(this.container);
			this.volumeLevelWrappers.push(wrapper);
			this.volumeLevels.push($('<div></div>').addClass('LFA-vol-widget-level').appendTo(wrapper));
		}
		
		var clickHandlerFactory = function(volumeLevel){
			return function(){
				if(options.onClick){
					options.onClick(volumeLevel);
				}
				this.volumeLevel = volumeLevel;
				this.layout();
			};
		};
		
		this.icon.click($.proxy(clickHandlerFactory(0), this));
		for (var i = 0; i < this.volumeLevelWrappers.length; i++) {
			this.volumeLevelWrappers[i].click($.proxy(clickHandlerFactory(i+1), this));
		}
		
		this.layout();
	};
	
	
	this.layout = function(){
		if(this.volumeLevel == 0){
			this.icon.removeClass("on");
		} else {
			this.icon.addClass("on");
		}
		for (var i = 0; i < this.volumeLevels.length; i++) {
			if(i < this.volumeLevel){
				this.volumeLevels[i].addClass("on");
			} else {
				this.volumeLevels[i].removeClass("on");
			}
		}
	};
	
	
	
	this._init();
};

//=============================================================================

/*
 * Options:
 * image - (Required) String. The URL of an initial background image
 * artistName - (Optional) String.
 * songName - (Optional) String.
 * onRightSliderClicked - function()
 * onLeftSliderClicked - function()
 * DEPRECATED: onSwipeUp - function()
 */
LFA.ui.Background = function(selector, options){
	options = options || {};
	this.container = $(selector);
	
	//-------------------------------------------------------------------------
	// Private methods
	
	this._init = function(){
		if(LFA.ui.isDesktop()){
			this.container.addClass('fill-screen');
		}
		
		var div = $.proxy(function(){return $('<div></div>').addClass('fill-screen').appendTo(this.container);}, this);
		div().addClass('visible background-layer');
		div().addClass('invisible background-layer').hide();
		
		$('<div><h3></h3><h4></h4></div>').addClass('visible artwork-title').appendTo(this.container);
		$('<div><h3></h3><h4></h4></div>').addClass('invisible artwork-title').appendTo(this.container).hide();
		
		//.addClass('hide-on-mobile')
		this.rightSlider = $('<div id="LFA-right-slider"></div>').appendTo(this.container);
		this.leftSlider = $('<div id="LFA-left-slider"></div>').appendTo(this.container);
		
		if(options.onRightSliderClicked){
			this.rightSlider.click(options.onRightSliderClicked);
			//this.rightSlider.bind('tapone', options.onRightSliderClicked);
			this.container.on('swiperight', options.onRightSliderClicked);
			//this.container.bind('swiperight', options.onRightSliderClicked);
		}
		
		if(options.onLeftSliderClicked){
			this.leftSlider.click(options.onLeftSliderClicked);
			//this.leftSlider.bind('tapone', options.onLeftSliderClicked);
			//this.container.bind('swipeleft', options.onLeftSliderClicked);
			this.container.on('swipeleft', options.onLeftSliderClicked);
		}
		
		var visibleLayer = this.container.find('.visible.background-layer');
		visibleLayer.anystretch(options.image, {elPosition: (LFA.ui.isDesktop() ? 'fixed' : 'absolute'), speed: 10});
		this._setImageAndLabels(visibleLayer, options.image, options.artistName, options.songName);
	};
	
	
	// visibleLayer is a boolean
	this._setImageAndLabels = function(visibleLayer, image, artistName, songName){
		var layer = this.container.find((visibleLayer ? '.visible' : '.invisible') + '.background-layer');
		var artworkTitle = this.container.find((visibleLayer ? '.visible' : '.invisible') + '.artwork-title');
		
		layer.anystretch(image, {elPosition: (LFA.ui.isDesktop() ? 'fixed' : 'absolute'), speed: 10});
		artworkTitle.find('h3').html(artistName || '');
		artworkTitle.find('h4').html(songName || '');
	};
	
	//-------------------------------------------------------------------------
	// Public methods
	
	/*
	 * imageUrl - String.
	 * fromRight - Boolean.
	 */
	this.slideInImage = function(imageUrl, artistName, songName, fromRight){
		this._setImageAndLabels(false, imageUrl, artistName, songName);
		
		this.container.find('.invisible').show('slide', {direction : fromRight ? 'right' : 'left'}, LFA.ui.ANIMATION_DELAY * 1.5, function(){});
		this.container.find('.visible').hide('slide', {direction : fromRight ? 'left' : 'right'}, LFA.ui.ANIMATION_DELAY * 1.5, function(){});
		this.container.find('.visible,.invisible').toggleClass('visible').toggleClass('invisible');
	};

	
	this.showSlidersAndLabels = function(){
		this.leftSlider.show("fade", LFA.ui.ANIMATION_DELAY);
		this.rightSlider.show("fade", LFA.ui.ANIMATION_DELAY);
		this.container.find('.visible.artwork-title').show("fade", LFA.ui.ANIMATION_DELAY);
	};
	
	//-------------------------------------------------------------------------
	// Initialize the object ...
	this._init();
};


//=============================================================================

/*
 * A UI Toolbar class.
 * Options:
 * onAboutClicked - function()
 * onMixtapeClicked - function()
 * onFiltersClicked - function()
 * artist - String. The band/artist name.
 */
LFA.ui.Toolbar = function(selector, options){
	options = options || {};
	this.container = $(selector);
	
	// We will attach these id's to the corresponding menu item elements
	var ID_FILTERS = 'filters';
	var ID_MIXTAPE = 'mixtape';
	var ID_ABOUT   = 'about';
	
	//-------------------------------------------------------------------------
	// Private methods
	
	this._init = function(){
		
		this.artist = $('<div></div>').addClass('LFA-toolbar-item LFA-toolbar-artist').appendTo(this.container).html(options.artist || '');
		
		this.menuItems = $('<div></div>').css({'float' : 'right', 'display' : 'block'}).appendTo(this.container).addClass('toolbar-menu-items');
		var div = $.proxy(function(){return $('<div></div>').addClass('LFA-toolbar-item').css({'float' : 'left'}).appendTo(this.menuItems);}, this);
		
		//this.sep1 = div().addClass('toolbar-menu-separator hide-on-mobile');
		this.filters = div().addClass('toolbar-menu-item').html('Filters').data('id',ID_FILTERS);
		this.sep2 = div().addClass('toolbar-menu-separator');
		this.mixtape = div().addClass('toolbar-menu-item').html('Mixtape').data('id',ID_MIXTAPE);
		this.sep3 = div().addClass('toolbar-menu-separator');
		this.about = div().addClass('toolbar-menu-item').html('About').data('id',ID_ABOUT);
		
		
		// Attach the supplied callback functions
		this.filters.click($.proxy(function(){
			this._updateUIAfterClick(this.filters);
			if(options.onFiltersClicked){options.onFiltersClicked();}
		}, this));
		
		this.mixtape.click($.proxy(function(){
			this._updateUIAfterClick(this.mixtape);
			if(options.onMixtapeClicked){options.onMixtapeClicked();}
		}, this));
		this.about.click($.proxy(function(){
			this._updateUIAfterClick(this.about);
			if(options.onAboutClicked){options.onAboutClicked();}
		}, this));
		
	};
	
	
	this._updateUIAfterClick = function(itemClicked){
		itemClicked.toggleClass('selected', LFA.ui.ANIMATION_DELAY);
		
		var lst = [this.about, this.mixtape, this.filters];
		for (var i in lst) {
			if(lst[i] != itemClicked){
				lst[i].removeClass('selected');
			}
		}
	};
	
	
	/*
	 * itemName - String. One of {null, 'about', 'mixtape', 'filters'}.
	 */
	this.selectItem = function(itemName){
		var lst = [this.about, this.mixtape, this.filters];
		for (var i in lst) {
			if(lst[i].data('id') == itemName){
				lst[i].addClass('selected', LFA.ui.ANIMATION_DELAY);
			} else {
				lst[i].removeClass('selected');
			}
		}
	};
	
	//-------------------------------------------------------------------------
	// Public methods

	this.layout = function(){};
	
	this.show = function(){
		if(LFA.ui.isDesktop()){
			this.container.animate({'margin-top' : '-' + toolbarUI.container.height() + 'px'}, LFA.ui.ANIMATION_DELAY); // Slide in from the bottom
		} else {
			this.container.show("slide", {direction: "up"}, LFA.ui.ANIMATION_DELAY); 
		}
	};
	
	//-------------------------------------------------------------------------
	// Initialize the object ...
	this._init();
};


//=============================================================================

/*
 * selector - String or null. If null, then a new container element will be created.
 *            (it is the responsibility of the caller to attach it to the DOM).
 * options
 * extraData - (Optional) An arbitrary object that will be passed to the all callbacks as na argument.
 * icons - List of icon names (strings).
 * title - String
 * subTitle - String
 * location - String
 * clazz - (Optional) String. Class(es) to will be added to the container DOM.
 * index - (Optional) Integer. A number to display on the top left of the info box
 * 
 * isInMixtape - (Optional) Either a Boolean or a function(extraData) that returns a boolean. Defaults to false
 * isPlaying - (Optional) Either a Boolean or a function(extraData) that returns a boolean. Defaults to false
 * 
 * onPlayClicked - function(extraData). The context will be this TrackInfoBox
 * onMixtapeClicked - function(extraData). The context will be this TrackInfoBox
 */
LFA.ui.TrackInfoBox = function(selector, options){
	options = options || {};
	this.container = selector ? $(selector) : $('<div></div>');
	
	//-------------------------------------------------------------------------
	// Private methods
	
	this._init = function(){
		this.container.addClass('song-version-container' + (options.clazz ? (' ' + options.clazz) : ''));
		
		this.leftBox = $('<div></div>').addClass('song-version-container-left').appendTo(this.container);
		
		this.versionIndex = $('<div></div>').addClass('song-version-index').appendTo(this.leftBox);
		if(options.index){
			this.versionIndex.html((options.index < 10 ? '0' : '') + options.index);
		}
		if(options.onMixtapeClicked){
			this.versionIndex.on('click', function(){options.onMixtapeClicked.call(this, options.extraData || {});});
		}
		
		this.iconContainer = $('<div></div>').addClass('song-version-icon-container').appendTo(this.leftBox);
		
		
		this.icons = [];
		var img = $.proxy(function(filterType){return $('<img class="song-version-icon" alt="' + filterType + '" />').attr('src', LFA.data.filters[filterType].iconOff).appendTo(this.iconContainer);}, this);
		var iconNames = options.icons || [];
		for (var i in iconNames) {
			this.icons.push(img(iconNames[i]));
		}
		
		
		this.thumbnailContainer = $('<div></div>').addClass('song-version-container-middle').appendTo(this.container);
		
		this.thumbnail = new LFA.ui.SVGwithPNGfallback(null, {
			svgUrl: 'img/BG/version_large_thumb.png', 
			pngUrl : 'img/BG/version_large_thumb.png', 
			clazz : 'song-version-thumbnail'
		});
		this.thumbnail.container.appendTo(this.thumbnailContainer);
		
		
		this.playButton = new LFA.ui.SVGwithPNGfallback(null, {clazz : 'song-version-play-button'});
		if(options.onPlayClicked){
			this.playButton.on('click', function(){options.onPlayClicked.call(this, options.extraData || {});});
		}
		this.playButton.container.appendTo(this.thumbnailContainer);
		
		this.detailsContainer = $('<div></div>').addClass('song-version-container-right').appendTo(this.container);
		this.title = $('<h1></h1>').html(options.title).appendTo(this.detailsContainer);
		this.subTitle = $('<h2></h2>').html(options.subTitle || '').appendTo(this.detailsContainer);
		this.location = $('<h3></h3>').html(options.location || '').appendTo(this.detailsContainer);
		this.notes = $('<p></p>').html(options.notes || '').appendTo(this.detailsContainer);
		
		
		this.setIsInMixtape(options.isInMixtape);	
		this.setIsPlaying(options.isPlaying);
	};
	
	
	//-------------------------------------------------------------------------
	// Public methods
	
	this.layout = function(){
		//console.log('TrackInfoBox layout()', this.isInMixtape(), options.extraData);
		if(this.isInMixtape()){
			this.versionIndex.addClass('in-mixtape');
		} else {
			this.versionIndex.removeClass('in-mixtape');
		}
		
		if(this.isPlaying()){
			//this.playButton.hide("fade", LFA.ui.ANIMATION_DELAY);
			this.playButton.setSrc(
					'img/png/pause-w-bg.png',
					'img/png/pause-w-bg.png',
					'img/png/pause.png',
					'img/png/pause.png'
			);
		} else {
			//this.playButton.show("fade", LFA.ui.ANIMATION_DELAY);
			this.playButton.setSrc(
					'img/png/play-w-bg.png',
					'img/png/play-w-bg.png',
					'img/png/play.png',
					'img/png/play.png'
			);
		}
	};
	
	
	
	
	// TODO: Refactor !!!
	
	this.setIsInMixtape = function(funcBoolOrUndefined){
		this.isInMixtape = function(){
			// If it's a boolean ...
			if(typeof(funcBoolOrUndefined) == 'boolean'){return funcBoolOrUndefined;}
			// If it's anything else, assume it's function ...
			if(funcBoolOrUndefined){return funcBoolOrUndefined.call(this, options.extraData || {});}
			// If it's nothing, default to false
			return false;
		};
	};
	
	this.setIsPlaying = function(funcBoolOrUndefined){
		this.isPlaying = function(){
			// If it's a boolean ...
			if(typeof(funcBoolOrUndefined) == 'boolean'){return funcBoolOrUndefined;}
			// If it's anything else, assume it's function ...
			if(funcBoolOrUndefined){return funcBoolOrUndefined.call(this, options.extraData || {});}
			// If it's nothing, default to false
			return false;
		};
	};
	
	//-------------------------------------------------------------------------
	// Initialize the object ...
	this._init();
	this.layout();
};


//=============================================================================

/*
 * selector - String or null. If null, then a new container element will be created.
 *            (it is the responsibility of the caller to attach it to the DOM).
 */
LFA.ui.MenuInfoBox = function(selector, options){
	options = options || {};
	this.container = selector ? $(selector) : $('<div></div>');
	
	//-------------------------------------------------------------------------
	// Private methods
	
	this._init = function(){
		this.container.addClass('menu-info-box');
	};
	
	
	this._showHideHelper = function(func, delay){
		delay = Math.max(delay, 1); // Make sure that 0 is treated as (almost) no delay 
		func.call(this.container, 'fade', null, delay || LFA.ui.ANIMATION_DELAY);
		
		// Check if we need to enable/disable scrollling
		// NOTE: Because this.container has fixed positioning, we need to do the extra work (to enable scrolling we must specify a fixed 'bottom' value)
		if($(window).innerHeight() - this.container.innerHeight()-  this.container.position().top < 0){
			this.container.addClass('enable-scroll');
		} else {
			this.container.removeClass('enable-scroll');
		}
	};
	
	//-------------------------------------------------------------------------
	// Public methods
	
	this.toggleVisibility = function(delay){this._showHideHelper(this.container.toggle, delay);};
	
	this.show = function(delay){this._showHideHelper(this.container.show, delay);};

	this.hide = function(delay){this._showHideHelper(this.container.hide, delay);};
	
	//-------------------------------------------------------------------------
	// Initialize the object ...
	this._init();
};


LFA.ui.AboutMenuInfoBox = function(selector, options){
	options = options || {};
	
	this.init = function(){
		this.text = $('<p></p>').html(options.text || "About ...").appendTo(this.container);
		this.divider = $('<div></div>').addClass('LFA-about-box-divider').appendTo(this.container);
		this.iconContainer = $('<div></div>').addClass('LFA-about-box-icon-container').appendTo(this.container);
		
		this.fbLink = $('<a href="http://www.facebook.com/LettersFromAbroad" target="_blank"><img class="LFA-about-box-icon" src="img/png/social_facebook.png"/></a>').appendTo(this.iconContainer);
		this.twitterLink = $('<a href="https://twitter.com/B_side_Mixtapes" target="_blank"><img class="LFA-about-box-icon" src="img/png/social_twitter.png"/></a>').appendTo(this.iconContainer);
		this.mailLink = $('<a href="mailto:Twitto@Twitto.com" target="_blank"><img class="LFA-about-box-icon" src="img/png/social_mail.png"/></a>').appendTo(this.iconContainer);
		this.scLink = $('<a href="http://soundcloud.com/lettersfromabroad" target="_blank"><img class="LFA-about-box-icon" src="img/png/social_soundcloud.png"/></a>').appendTo(this.iconContainer);
		this.ytLink = $('<a href="http://www.youtube.com/user/lfachannel" target="_blank"><img class="LFA-about-box-icon" src="img/png/social_youtube.png"/></a>').appendTo(this.iconContainer);
		
	};
	
	
	this.init();
};
LFA.ui.AboutMenuInfoBox.prototype = new LFA.ui.MenuInfoBox();




/*
 * options:
 * itemsData - function() that returns a list of objects, each object will be passed 
 *         as the options argument to a MixtapeItem object. 
 * onTrash - function(extraData)
 * onPlay - function()
 */
LFA.ui.MixtapeMenuInfoBox = function(selector, options){
	options = options || {};
	this._items = [];
	
	this.init = function(){
		
		this.emptyMixtapeMessage = $('<div></div>').addClass('LFA-empty-mixtape').hide().appendTo(this.container);
		$('<h3>No songs were selected</h3>').appendTo(this.emptyMixtapeMessage);
		$('<p>Add songs to your mixtape by clicking their version number.</p>').appendTo(this.emptyMixtapeMessage);
		
		this.topBox = $('<div></div>').addClass('LFA-filters-top-box').appendTo(this.container);
		this.playButton = $('<img>').addClass('LFA-mixtape-play-button').attr('src', 'img/png/play-w-bg.png').appendTo(this.topBox);
		if(options.onPlay){
			this.playButton.click(options.onPlay);
		}
		
		
		$('<div></div>').addClass('LFA-filters-horizontal-line').appendTo(this.topBox);
		this.mixtapeLength = $('<div></div>').addClass('LFA-filters-mixtape-length').appendTo(this.topBox);
		this.mixtapeLength.html('12:34');
		
		this.refresh(options.itemsData);
		this.container.sortable({axis: 'y'});
		this.container.disableSelection();
	};
	
	
	this.refresh = function(){
		var itemsData = options.itemsData();
		
		if(itemsData.length == 0){
			this.emptyMixtapeMessage.show("fade", LFA.ui.ANIMATION_DELAY);
			this.topBox.hide(20);
		} else {
			this.emptyMixtapeMessage.hide(20);
			this.topBox.show("fade", LFA.ui.ANIMATION_DELAY);
		}

		var inItemsData = function(item){for (var i = 0; i < itemsData.length; i++) {if(itemsData[i].id == item.id){return true;}}return false;};
		var insert = function(item, array, index){array.push(null);for (var i = array.length - 1; i > index; i--) {array[i] = array[i-1];}array[index] = item;};
		
		// First of all, get rid of items that are displayed but are no longer in the mixtape
		for (var i = 0; i < this._items.length; i++) {
			if(! inItemsData(this._items[i])){
				var item = this._items.splice(i, 1)[0]; // Pop the item at index i
				item.container.hide("fade", null, LFA.ui.ANIMATION_DELAY, function(){this.remove();});
			}
		}
		
		// Then, go over the mixtape and add whatever is missing to the UI 
		for (var i = 0; i < itemsData.length; i++) {
			// If the i'th item is the same in the mixtape and UI ...
			if(i < this._items.length && this._items[i].id == itemsData[i].id){
				// NOTE: Should we call layout on the item?
				continue;
			}
			
			// If we got here, then the i'th item from the mixtape is not the i'th item in the UI.
			var newItemOptions = itemsData[i];
			if(options.onTrash){
				newItemOptions.onTrash = options.onTrash;
			}
			var newItem = new LFA.ui.MixtapeItem(null, newItemOptions);
			
			newItem.container.hide();
			if(i == 0){
				newItem.container.appendTo(this.container);
			} else {
				newItem.container.insertAfter(this._items[i-1].container);
				
			}
			newItem.container.show("fade", null, LFA.ui.ANIMATION_DELAY);
			
			insert(newItem, this._items, i);
		}
	};
	
		
	this.init();
};
LFA.ui.MixtapeMenuInfoBox.prototype = new LFA.ui.MenuInfoBox();




/*
 * Options
 * onClick - function(filterType)
 */
LFA.ui.FiltersMenuInfoBox = function(selector, options){
	
	this.init = function(){
		
		this.container.addClass('LFA-filters');
		this.topBox = $('<div></div>').addClass('LFA-filters-top-box').appendTo(this.container);
		$('<h4></h4>').html('Filter the recordings you want to see').appendTo(this.topBox);
		
		var titles = ['Music Density', 'Recording Quality', 'Song Development'];
		
		var clickHandlerFactory = function(element, filterType){
			return function(){
				element.toggleClass('on');
				if(options.onClick){
					options.onClick(filterType);
				}
			};
		};
		
		
		for (var i = 1; i < 4; i++) {
			//LFA.ui._createMenuBoxDivider().appendTo(this.container);
			$('<h5></h5>').html(titles[i-1]).appendTo(this.container);
			var iconContainer = $('<div></div>').addClass('LFA-filters-icon-container').appendTo(this.container);
			for (var j = 1; j < 4; j++) {
				var key = 'filter-' + i + '-' + j;
				var filter = LFA.data.filters[key];
				
				var wrapper = $('<div></div>').addClass('filters-icon-wrapper').appendTo(iconContainer);
				if(filter.on){
					wrapper.addClass('on');
				}
				
				//console.log(key, filter);
				$('<img>').addClass('filters-icon').attr('src', filter.on ? filter.iconOn : filter.iconOff).appendTo(wrapper);
				$('<div></div>').addClass('filters-icon-label').html(filter.label).appendTo(wrapper);
				wrapper.click($.proxy(clickHandlerFactory(wrapper, key), this));
				
//				if(filter.on){img.addClass('on');}
				// If a click handler was supplied ...
//				img.click($.proxy(clickHandlerFactory(img, key), this));
			}
		}
	};
	
	
	this.init();
	
};
LFA.ui.FiltersMenuInfoBox.prototype = new LFA.ui.MenuInfoBox();


//=============================================================================

/*
 * Options:
 * id - String (required)
 * 
 * title - String
 * subTitle - String
 * thumbnail - String
 * 
 * extraData - (Optional) object.
 * 
 * onPlay - function(extraData)
 * onTrash - function(extraData)
 */
LFA.ui.MixtapeItem = function(selector, options){
	this.id = options.id;
	
	options = options || {};
	this.container = selector ? $(selector) : $('<div></div>');
	
	this.init = function(){
		this.container.addClass('LFA-mixtape-item');
		
		//this.divider = LFA.ui._createMenuBoxDivider().appendTo(this.container);
		
		this.thumbnail = $('<img>').addClass('LFA-mixtape-item-thumbnail').attr('src', options.thumbnail).appendTo(this.container);
		this.details = $('<div></div>').addClass('LFA-mixtape-item-details').appendTo(this.container);
		$('<h4></h4>').html(options.title).appendTo(this.details);
		$('<h5></h5>').html(options.subTitle).appendTo(this.details);
		this.trash = $('<img>').addClass('LFA-mixtape-item-trash').attr('src', 'img/png/trash.png').appendTo(this.container);
		
		if(options.onTrash){
			this.trash.click(function(){options.onTrash(options.extraData || {});});
		}
		
	};
	
	this.init();
};

