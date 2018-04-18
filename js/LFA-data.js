/*
 * This file contains all the data required for this app/website.
 * In a real version, this data will be fetched from a web server via AJAX.
 */

var LFA = LFA || {};



LFA.data = {
		
		aboutText : "<P>We are Letters from Abroad (LFA).</P>" +
					"<P>LFA began as a project aiming to push the conventional boundaries of combining music and design.</P>" + 
					"<P>Throughout the past year LFA experimented with various musical genres, recorded it, and documented the entire creative process step by step. Our official EP is the result of our experiment. We created a web album that allows access not only to the final and polished versions of our music, it also shows what lead to the song's creation.</P>" +
					"<P>Roey - Musician and designer<BR />Anna - Contemporary composer and artist<BR />Vid - Sound engineer and producer</P>",

		// We will use the index to this list as a song-id
		songs : [ 
		         {
		        	 title : "And There She Goes",
		        	 artist : 'Letters From Abroad',
		        	 artwork : 'img/BG/bg1.jpg',
		        	 versions : [
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_1.mp3',
		        	            	 title : 'Untitled #01',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '28.12.2012',
		        	            	 notes : 'First draft for the song theme',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_2.mp3',
		        	            	 title : 'Untitled #02',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '03.01.2013',
		        	            	 notes : 'Third draft + Lyrics',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-2']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_3.mp3',
		        	            	 title : 'Home studio arrangement',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '09.01.2013',
		        	            	 notes : 'We learn by experiment. as soon as the song left the acoustic guitar, these were the first ideas for beats and sound.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-3', 'filter-2-2', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_4.mp3',
		        	            	 title : 'Piano improvisation',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '26.03.2013',
		        	            	 notes : 'Glad I had my phone with me to capture this beautiful melody.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_5.mp3',
		        	            	 title : 'Electro-Acoustic mix',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '13.05.2013',
		        	            	 notes : 'Minimal experiment with metronome manipulations.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-2', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_6.mp3',
		        	            	 title : 'Acoustic video clip',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.07.2013',
		        	            	 notes : 'Video will be released soon.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-3', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/ATSG/ATSG_7.mp3',
		        	            	 title : 'EP final version',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.07.2013',
		        	            	 notes : 'Official band selection',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_1.jpg',
		        	            	 filters : ['filter-1-3', 'filter-2-3', 'filter-3-3']
		        	             }

		        	             ]	
		         },


		         {
		        	 title : "Don't Tell Your Mother",
		        	 artist : 'Letters From Abroad',
		        	 artwork : 'img/BG/bg2.jpg',
		        	 versions : [
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_1.mp3',
		        	            	 title : 'Untitled #1',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.09.2012',
		        	            	 notes : 'Its funny to think this was the first melody I came up with. You can hear the clanky midi keyboard in the back, clicking and popping. ',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_2.mp3',
		        	            	 title : 'Untitled #2',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '16.10.2012',
		        	            	 notes : '',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_3.mp3',
		        	            	 title : 'Feat Leah Uiterlinde',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '19.10.2012',
		        	            	 notes : 'Early jam session with Lea ended up with a couple of beautiful melodies. Sorry for the low quality, didn' + "'" + 't have anything better to record with. ',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_4.mp3',
		        	            	 title : 'Acoustic piano',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '15.11.2012',
		        	            	 notes : 'Finlay, got a chance to play this on a real piano. I wish I' + "'" + 'd know how to play a piano though...',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-2']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_5.mp3',
		        	            	 title : 'Live video recording @ Murphy' + "'" + 's Law',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '26.11.2012',
		        	            	 notes : 'Thanks to the great people at Murphy' + "'" + 's Law, we had a full Sunday to record our first live video clip. Though we didn' + "'" + 't have a chance to edit it yet...',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-2', 'filter-2-2', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/DTYM/DTYM_6.mp3',
		        	            	 title : 'EP final version',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '29.01.2013',
		        	            	 notes : 'Official band selection',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_2.jpg',
		        	            	 filters : ['filter-1-3', 'filter-2-3', 'filter-3-3']
		        	             }            
		        	             ]	
		         },


		         {
		        	 title : "To Have It All",
		        	 artist : 'Letters From Abroad',
		        	 artwork : 'img/BG/bg3.jpg',
		        	 versions : [
		        	             {
		        	            	 audioUrl : 'music/THIA/THIA_1.mp3',
		        	            	 title : 'Untitled #1',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '10.04.2013',
		        	            	 notes : 'I can' + "'" + 't really imagine how we developed this song from this melody. But this is the actual first documentation of this song.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_3.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/THIA/THIA_2.mp3',
		        	            	 title : 'Untitled #2',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.05.2013',
		        	            	 notes : 'Acoustic guitar + Lyrics',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_3.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-2']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/THIA/THIA_3.mp3',
		        	            	 title : 'EP final version',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.07.2032',
		        	            	 notes : 'Official band selection',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_3.jpg',
		        	            	 filters : ['filter-1-3', 'filter-2-3', 'filter-3-3']
		        	             }
		        	             ]	
		         }
		         
		         /*
		         ,
		         {
		        	 title : "Chaos Will Rise",
		        	 artist : 'Letters From Abroad',
		        	 artwork : 'img/BG/bg4.jpg',
		        	 versions : [
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_1.mp3',
		        	            	 title : 'Untitled #1',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '05.04.2013',
		        	            	 notes : 'First melody and chord progression for the song’s theme.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_2.mp3',
		        	            	 title : 'Untitled #2',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.04.2013',
		        	            	 notes : 'Early instrumental on acoustic guitar. Trying to figure out the chords and arrangement.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-1']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_3.mp3',
		        	            	 title : 'Untitled #3',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '10.04.2013',
		        	            	 notes : 'Acoustic guitar + Lyrics',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-1', 'filter-3-2']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_4.mp3',
		        	            	 title : 'Electronic tryout',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '20.04.2013',
		        	            	 notes : 'Testing my new MS-2000 synth',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-2', 'filter-2-2', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_5.mp3',
		        	            	 title : 'Acoustic version',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.07.2013',
		        	            	 notes : 'We had a chance to record this song real quick before we went home. I had the honor to sing to a vintage U-47 mic.',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-1', 'filter-2-3', 'filter-3-3']
		        	             },
		        	             {
		        	            	 audioUrl : 'music/CWR/CWR_6.mp3',
		        	            	 title : 'EP final version',
		        	            	 location : 'The Hague, Netherlands',
		        	            	 time : '07.07.2013',
		        	            	 notes : 'Official band selection',
		        	            	 thumbnail : 'img/BG/thumbs/thumbs_4.jpg',
		        	            	 filters : ['filter-1-3', 'filter-2-3', 'filter-3-3']
		        	             }
		        	             ]	
		         }
             */

		         ],

		         mixtape : [
		                    {songId : 0, versionId : 0},
		                    {songId : 1, versionId : 0},
		                    {songId : 2, versionId : 0},
		                    {songId : 3, versionId : 0}
		                    ],

		                    filters : {
		                    	'filter-1-1' : { 
		                    		iconOn : 'img/png/filter1_1.png',
		                    		iconOff : 'img/png/filter1_1.png',
		                    		label : 'Minimal',
		                    		on : true
		                    	},
		                    	'filter-1-2' : { 
		                    		iconOn : 'img/png/filter1_2.png',
		                    		iconOff : 'img/png/filter1_2.png',
		                    		label : 'Moderate',
		                    		on : true
		                    	},'filter-1-3' : { 
		                    		iconOn : 'img/png/filter1_3.png',
		                    		iconOff : 'img/png/filter1_3.png',
		                    		label : 'Full',
		                    		on : true
		                    	},
		                    	'filter-2-1' : { 
		                    		iconOn : 'img/png/filter2_1.png',
		                    		iconOff : 'img/png/filter2_1.png',
		                    		label : 'Mobile',
		                    		on : true
		                    	},
		                    	'filter-2-2' : { 
		                    		iconOn : 'img/png/filter2_2.png',
		                    		iconOff : 'img/png/filter2_2.png',
		                    		label : 'Live',
		                    		on : true
		                    	},
		                    	'filter-2-3' : { 
		                    		iconOn : 'img/png/filter2_3.png',
		                    		iconOff : 'img/png/filter2_3.png',
		                    		label : 'Studio',
		                    		on : true
		                    	},
		                    	'filter-3-1' : { 
		                    		iconOn : 'img/png/filter3_1.png',
		                    		iconOff : 'img/png/filter3_1.png',
		                    		label : 'Foolin\' around',
		                    		on : true
		                    	},
		                    	'filter-3-2' : { 
		                    		iconOn : 'img/png/filter3_2.png',
		                    		iconOff : 'img/png/filter3_2.png',
		                    		label : 'New Song',
		                    		on : true
		                    	},
		                    	'filter-3-3' : { 
		                    		iconOn : 'img/png/filter3_3.png',
		                    		iconOff : 'img/png/filter3_3.png',
		                    		label : 'Standalone',
		                    		on : true
		                    	}
		                    },

};


// Initialize the mixtape ...
var _initMitape = [] ;
for (var songId = 0; songId < LFA.data.songs.length; songId++) {
	console.log('songId ' + songId, LFA.data.songs[songId].versions.length);
	_initMitape.push({'songId' : songId, 'versionId' : LFA.data.songs[songId].versions.length - 1});
}
LFA.data['mixtape'] = _initMitape; 
 

//TODO: This should probably be somewhere else
LFA.data.getMixtapeItemsData = function(){
	data = [];
	for (var i in LFA.data.mixtape) {
		var songId = LFA.data.mixtape[i].songId;
		var versionId = LFA.data.mixtape[i].versionId;
		data.push({
			title : LFA.data.songs[songId].title,
			subTitle : LFA.data.songs[songId].versions[versionId].title,
			location : LFA.data.songs[songId].versions[versionId].location,
			thumbnail : LFA.data.songs[songId].versions[versionId].thumbnail,
			id : songId + '_' + versionId,
			extraData : {'songId' : songId, 'versionId' : versionId}
		});
	}
	return data;
};


LFA.data.isInMixtape = function(songId, versionId){
	for (var i in LFA.data.mixtape) {
		if(songId == LFA.data.mixtape[i].songId && versionId == LFA.data.mixtape[i].versionId){
			return true;
		}
	}
	return false;
};


LFA.data.getMixtapeIndex = function(songId, versionId){
	for (var i in LFA.data.mixtape) {
		if(songId == LFA.data.mixtape[i].songId && versionId == LFA.data.mixtape[i].versionId){
			return i;
		}
	}
	return -1;
};


//Add if the item is missing, remove if it's there. So basically ... toggle.
LFA.data.addRemoveToFromMixtape = function(songId, versionId){
	for (var i in LFA.data.mixtape) {
		if(songId == LFA.data.mixtape[i].songId && versionId == LFA.data.mixtape[i].versionId){
			LFA.data.mixtape.splice(i, 1);
			return;
		}
	}

	LFA.data.mixtape.push({'songId' : songId, 'versionId' : versionId});
};


LFA.data.removeToFromMixtape = function(songId, versionId){
	for (var i in LFA.data.mixtape) {
		if(songId == LFA.data.mixtape[i].songId && versionId == LFA.data.mixtape[i].versionId){
			LFA.data.mixtape.splice(i, 1);
			return;
		}
	}
};


//Pre-load images ...
for (var i = 0; i < LFA.data.songs.length; i++) {
	var img = new Image();
	img.src = LFA.data.songs[i].artwork;
	console.log('Pre-loaded ' + LFA.data.songs[i].artwork);
}
