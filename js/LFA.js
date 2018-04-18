/*
 * Main application code.
 */

//=============================================================================
//Globals

var LFA = LFA || {};

//=============================================================================
//UI-component managers


/**
 * A class that wraps up the common setup of the menu boxes
 */
LFA.MenuBoxesManager = function(){
	var thiz = this;
	this._boxes = {
			about : new LFA.ui.AboutMenuInfoBox(null, {
				text : LFA.data.aboutText
			}),

			mixtape : new LFA.ui.MixtapeMenuInfoBox(null, {
				itemsData : LFA.data.getMixtapeItemsData,
				onTrash : function(extraData){
					LFA.data.removeToFromMixtape(extraData.songId, extraData.versionId);
					thiz._boxes.mixtape.refresh();
					trackInfoBoxesUI.layout();
				},
				onPlay : playPlaylist
			}),

			filters : new LFA.ui.FiltersMenuInfoBox(null, {
				onClick : function(filterType){
					LFA.data.filters[filterType].on = ! LFA.data.filters[filterType].on;
					trackInfoBoxesUI.refresh(_SONG_ID);
				}
			})
	};

	for(var k in this._boxes){
		this._boxes[k].container.appendTo('#song-versions-container');
	}

	// Convenience method
	this._onClickHandlerFactory = function(boxUI){
		var boxes = this._boxes;
		return function(){
			// Hide all other boxes
			for (var k in boxes) {
				if(boxes[k] != boxUI){
					boxes[k].hide(5);
				}
			}

			if(LFA.ui.isDesktop() && $(window).scrollTop() == 0){
				scrollManager.hideBackground($.proxy(boxUI.show, boxUI));
			} else {
				boxUI.toggleVisibility();
			}
		}; 
	};

	this.hideAll = function(delay){
		for (var k in this._boxes) {
			this._boxes[k].hide(delay);
		}
	};


	/*
	 * boxName - String, one of {'about', 'mixtape', 'filters'}
	 */
	this.showBox = function(boxName, delay, onComplete){
		toolbarUI.selectItem(boxName);

		var onCompleteWrapper = $.proxy(function(){
			if(onComplete){onComplete();}
			this._boxes[boxName].refresh();
		}, this);

		for (var k in this._boxes) {
			if(k != boxName){
				this._boxes[k].hide(10);
			}
		}
		this._boxes[boxName].container.show("fade", delay || LFA.ui.ANIMATION_DELAY, onCompleteWrapper);
	};


	this.aboutClickHandler = this._onClickHandlerFactory(this._boxes.about);
	this.mixtapeClickHandler = this._onClickHandlerFactory(this._boxes.mixtape);
	this.filtersClickHandler = this._onClickHandlerFactory(this._boxes.filters);

};





LFA.trackInfoBoxesManager = function(selector){
	this.container =  $(selector);
	this._boxes = [];


	this.onPlayHandler = function(extraData){
		// If we clicked the currently loaded song, just trigger a click button on the player
		if(extraData.songId == _PLAYER_SONG_ID && extraData.versionId == _PLAYER_VERSION_ID){
			playerUI.play();
		} else {
			playSong(extraData.songId, extraData.versionId);
		}

		this.layout();
	};

	this.onMixtapeHandler = function(extraData){

		/*
		LFA.data.addRemoveToFromMixtape(extraData.songId, extraData.versionId);
		this.layout();
		 */

		// Also, need to (show and) refresh the mixtape box...
		/*
		menuBoxesUI.boxes.mixtape.container.show("fade", LFA.ui.ANIMATION_DELAY); // TODO: Make that nicer (i.e. trigger a click on the about box if it is not highlighted)
		menuBoxesUI.boxes.mixtape.refresh();
		 */

		var _songId = extraData.songId;
		var _versionId = extraData.versionId;
		var onComplete = $.proxy(function(){
			// Add if missing, or remove if is already there.
			LFA.data.addRemoveToFromMixtape(_songId, _versionId);
			this.layout();
		}, this);

		menuBoxesUI.showBox('mixtape', null, onComplete);
	};



	// Call layout on every box
	this.layout = function(){
		for (var i in this._boxes) {
			this._boxes[i].layout();
		}
	};


	// Remove all currently drawn boxes, and load new ones for the specified songId
	this.refresh = function(songId){
		// Remove existing boxes
		while(this._boxes.length > 0){
			var box = this._boxes.pop();
			box.container.remove();
		}

		//  Create new boxes ...

		var isInMixtapeHandler = function(extraData){
			for(var i in LFA.data.mixtape){
				if(LFA.data.mixtape[i].songId == extraData.songId && LFA.data.mixtape[i].versionId == extraData.versionId){
					return true;
				}
			}
			return false;
		};

		var isPlayingHandler = function(extraData){
			return extraData.songId == _PLAYER_SONG_ID && extraData.versionId == _PLAYER_VERSION_ID && (! _player.isPaused());
		};

		for (var i in LFA.data.songs[songId].versions) {
			var versionId = LFA.data.songs[songId].versions.length - 1 - i;
			var version = LFA.data.songs[songId].versions[versionId];

			// Check if we should filter this version or not
			var shouldShow = true;
			for(var i in version.filters){
				shouldShow = shouldShow && LFA.data.filters[version.filters[i]].on; 
			}
			if(! shouldShow){
				continue;
			}

			var trackInfoBox = new LFA.ui.TrackInfoBox(null, {
				extraData : {'songId' : songId, 'versionId' : versionId},
				icons : version.filters,
				title : LFA.data.songs[songId].title,
				subTitle : version.title,
				location : version.time + ', ' + version.location,
				notes : version.notes,
				index : versionId + 1,
				isInMixtape : isInMixtapeHandler,
				isPlaying : isPlayingHandler,
				onPlayClicked : $.proxy(this.onPlayHandler, this),
				onMixtapeClicked : $.proxy(this.onMixtapeHandler, this),
			});

			trackInfoBox.container.append($('<div class="song-version-spacer"></div>'));
			this.container.append(trackInfoBox.container);
			this._boxes.push(trackInfoBox);
		}
	};

};


//=============================================================================

/*
 * songId and versionId are indices to a specific song and version from our data.
 */
function loadSong(songId, versionId, onFinishedPlaying){
	var song = LFA.data.songs[songId];
	var version = song.versions[versionId];

	console.log('Need to loadSong from ' + version.audioUrl);

	// Act as an adapter between _player (the audio player) and playerUI.
	_player.loadSong(version.audioUrl, {
		onProgress : $.proxy(playerUI.updateProgress, playerUI), 
		onFinish : function(){
			playerUI.finishedPlaying.call(playerUI);
			trackInfoBoxesUI.refresh(_SONG_ID);
			if(onFinishedPlaying){onFinishedPlaying();};
		},
		extraData : {
			'songId' : songId,
			'versionId' : versionId
		}
	});

	playerUI.setTextFields({artist : song.artist, title : song.title, subTitle : version.title});

	// Keep track of which song is being played
	_PLAYER_SONG_ID = songId;
	_PLAYER_VERSION_ID = versionId;
}


function playSong(songId, versionId, onFinishedPlaying){
	loadSong(songId, versionId, onFinishedPlaying);
	_player.play();
}


function playPlaylist(){
	var _PlaylistPlayer = function(){
		this.index = 0;
		
		this.playSong = function(){
			console.log('Need to play mixtape item ' + this.index);
			if(this.index < LFA.data.mixtape.length){
				playSong(LFA.data.mixtape[this.index].songId, LFA.data.mixtape[this.index].versionId, $.proxy(this.playSong, this));
				this.index++;
			}
		};
	};
	
	p = new _PlaylistPlayer();
	p.playSong();
};



LFA.slideRight = function(){LFA.slide(false);};
LFA.slideLeft = function(){LFA.slide(true);};

LFA.slide = function(left){
	_SONG_ID = (left ? LFA.data.songs.length + _SONG_ID - 1 : _SONG_ID + 1) % LFA.data.songs.length;
	backgroundUI.slideInImage(LFA.data.songs[_SONG_ID].artwork, LFA.data.songs[_SONG_ID].artist, LFA.data.songs[_SONG_ID].title, left);
	trackInfoBoxesUI.container.hide("slide", {direction : (left ? "left" : "right")}, LFA.ui.ANIMATION_DELAY * 0.75);
	trackInfoBoxesUI.refresh(_SONG_ID);
	trackInfoBoxesUI.container.show("slide", {direction : (left ? "right" : "left")}, LFA.ui.ANIMATION_DELAY * 0.75);
};

//=============================================================================
//TODO: Make this a little cleaner

var _player = null;

var backgroundUI = null;
var playerUI = null;
var toolbarUI = null;
var menuBoxesUI = null;
var trackInfoBoxesUI = null;
var scrollManager = null;

var _SONG_ID = 0;
var _PLAYER_SONG_ID = _SONG_ID;
var _PLAYER_VERSION_ID = LFA.data.songs[_SONG_ID].versions.length - 1;


$(function() {

	// On click will show the player and content
	var _playerHasLoaded = false;
	var onFirstClick = function() {
		playerUI.show();

		var container = $('#song-versions-container');

		if(! LFA.ui.isDesktop()){
			container.on('swiperight', LFA.slideRight);
			container.on('swipeleft', LFA.slideLeft);
		}



		container.show();

		toolbarUI.show();
		backgroundUI.showSlidersAndLabels();

		// Reset scrollbar (prevent funny behaviour when a user refreshes the page when it is scrolled down)
		window.scrollTo(0, 0);

		if(_playerHasLoaded){
			loadSong(_PLAYER_SONG_ID, _PLAYER_VERSION_ID);
			playerUI.play();
		}
	};




	_player = new LFA.audio.Player({
		onReady : function(){
			_playerHasLoaded = true;
		},
		onTimeout : function(){
			alert("Could not load media player.\nIf you're viewing this page from a local file, try using a different browser.\nTODO: better behaviour in case of this error.");
			_PLAYER_SONG_ID = -1;
			_PLAYER_VERSION_ID = -1;
			// TODO: Relayout
		}
	});


	backgroundUI = new LFA.ui.Background('#LFA-background', {
		image : LFA.data.songs[_SONG_ID].artwork,
		artistName : LFA.data.songs[_SONG_ID].artist,
		songName : LFA.data.songs[_SONG_ID].title,
		onRightSliderClicked : LFA.slideRight,
		onLeftSliderClicked : LFA.slideLeft
	});


	playerUI = new LFA.ui.Player("#LFA-player", {
		//onTogglePause : $.proxy(_player.togglePause, _player)
		onTogglePause : function() {
			_player.togglePause.call(_player);
			trackInfoBoxesUI.layout();
		},

		onVolumeClicked : $.proxy(_player.setVolumeLevel, _player)
	});

	menuBoxesUI = new LFA.MenuBoxesManager(); 

	toolbarUI = new LFA.ui.Toolbar("#LFA-toolbar", {
		artist : LFA.data.songs[_SONG_ID].artist,
		onAboutClicked : menuBoxesUI.aboutClickHandler,
		onMixtapeClicked : menuBoxesUI.mixtapeClickHandler,
		onFiltersClicked : menuBoxesUI.filtersClickHandler
	});

	trackInfoBoxesUI = new LFA.trackInfoBoxesManager('#vertical-container');
	trackInfoBoxesUI.refresh(_SONG_ID);


	// Put a transparent full-screen div that will respond to a click/tap event by "launching the site".
	var tmpDiv = $('<div></div>').addClass('fill-screen').css('z-index','999').appendTo('body');
	var launchSite = function(){
		console.log("Launch ...");
		onFirstClick();
		tmpDiv.remove();
	};
	tmpDiv.click(launchSite);
	tmpDiv.bind('tapone', launchSite);


	// Create the scroll manager
	if(LFA.ui.isDesktop()){
		scrollManager = new LFA.ui.ScrollBarManager({
			scrollAmount : function() {return $(window).height() - playerUI.container.height() - toolbarUI.artist.height();},
			beforeHideBackground : function(){
			},
			afterHideBackground : function(){
				playerUI.container.addClass('opaque', LFA.ui.ANIMATION_DELAY).removeClass('transparent', LFA.ui.ANIMATION_DELAY);
				toolbarUI.container.css({position: 'fixed', top: playerUI.container.height(), 'border-bottom': '1px solid #f0f0f0', 'margin-top' : 0});
			},
			beforeShowBackground : function(){
				menuBoxesUI.hideAll(5);
				toolbarUI.selectItem(null);
				playerUI.container.addClass('transparent', LFA.ui.ANIMATION_DELAY).removeClass('opaque', LFA.ui.ANIMATION_DELAY);
				toolbarUI.container.css({position: 'absolute', top: '0', 'border-bottom': '', 'margin-top' : '-' + toolbarUI.container.height() + 'px'});
			},
			afterShowBackground : function(){
				//toolbarUI.container.css({position: 'absolute', top: '0', 'border-bottom': '', 'margin-top' : '-' + toolbarUI.container.height() + 'px'});
			},
		});
	} else {
		// Messing around with the scroll behaviour doesn't work so well on non-desktops.
		// That's why we have a dummy object, that have the same public interface as LFA.ui.ScrollBarManager,
		// and simply calls the supplied callback right away (without actually dealing with scrolling).
		var f = function(onComplete){if(onComplete){onComplete();}};
		scrollManager = {
				hideBackground : f,
				showBackground : f
		};
	}


	// TODO: We probably want to do some more work here ...
	$(window).resize(function() {

	});
	
	// Some CSS changes for non-desktops
	if(! LFA.ui.isDesktop()){
		$('#LFA-player').css('bottom', 0);
		$('#LFA-toolbar').css({'position' : 'fixed', 'left': 0, 'top': 0, 'margin-top': 0, 'display': 'none'}); 
		$('#LFA-background').css({'position':'absolute', 'top':0, 'left':0, 'width':'100%', 'height':'100%'});
	}

});