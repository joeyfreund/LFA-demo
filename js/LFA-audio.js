
//=============================================================================
// Namespace declarations

var LFA = LFA || {};
LFA.audio = {};

//=============================================================================


/*
 * A wrapper-object for soundManager2 functionality.
 * options:
 * onReady - function(), called when the soundManager plugin is ready.
 * onTimeout - function(), called when the soundManager plugin encounters an error (e.g. When viewing from local file in some browsers).
 */
LFA.audio.Player = function(options){
	this._sound = null;
	options = options || {};

	//  Set things up, so that we can play some audio ...
	_this = this;
	soundManager.setup({
		url: 'swf/', //'soundmanager2_flash9.swf',
		//flashVersion: 9, // optional: shiny features (default = 8)
		preferFlash: false, // ignore Flash where possible, use 100% HTML5 mode
		debugMode: true,
		onready : function(){_this._onSoundManagerReady();},
		ontimeout: function() {_this._onSoundManagerTimeout();}
	});


	
	this._onSoundManagerReady = function(){
		console.log('SoundManager2 is ready.');
		if(options.onReady){options.onReady();}
	};
	
	this._onSoundManagerTimeout = function(){
		console.log('SoundManager2 timed out.');
		if(options.onTimeout){options.onTimeout();}
	};
	
	


	/*
	  Start playing the audio/mp3 file from the specified url.
	  options can contain the following information:
	  - extraData - Optional object that will be passed to all the callbacks
	  - onFinish - Calllback function(extra_data), called when a song finishes playing
	  - onProgress - Calllback function(bytesLoaded, bytesTotal, playPositionInMs, songDurationInMs, extraData), called repeatedly while the song is playing
	 */
	this.loadSong = function(url, options){
		options = options || {};
		
		this._currSongId = '' + Math.ceil(999999 * Math.random()); 

		this._sound = soundManager.createSound({
			id : this._currSongId,
			url : url,
			autoPlay : false,

			onfinish: function() {
				console.log('The sound ' + this.id + ' finished playing.');
				if(options.onFinish){options.onFinish(options.extraData || null);}
			},

			whileplaying : function() {
				if(options.onProgress){
					options.onProgress(this.bytesLoaded, this.bytesTotal, 
							this.position, this.bytesLoaded == this.bytesTotal ? this.duration : this.durationEstimate,
							options.extraData || null);
				}
			}
		});
	};

	
	this.play = function(url, options){
		if(url){
			this.loadSong(url, options);
		}
		soundManager.stopAll();
		this._sound.play();
	};
	

	this.togglePause = function(){
		if(this._sound){
			this._sound.togglePause();
		}
	};
	
	this.isPaused = function(){
		return this._sound && (this._sound.paused  || this._sound.playState == 0);
	};
	
	
	/*
	 * volumeLevel is an integer between 0 and 4
	 */
	this.setVolumeLevel = function(volumeLevel){
		if(volumeLevel >= 0 && volumeLevel <= 4){
			this._sound.setVolume(25 * volumeLevel);
		}
	};

};
