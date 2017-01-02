"use strict"
class AudioPlayer {

	constructor(id, mp3InputId, getCurrentSongbookCallback) {
		this.id = id;
		this.element = $(id);
		this.getCurrentSongbookCallback = getCurrentSongbookCallback;

		this.init();
    	//this.localAudio = false;
    	var self = this;
    	console.log(mp3InputId);
    	$(mp3InputId).on("change", () => { 
    		var f = $(mp3InputId).get(0).files[0];
    		var url = window.URL.createObjectURL(f);
    		var songbook = getCurrentSongbookCallback();
    		if(!songbook.title) {
    			songbook.title = f.name.substr(0, 20) + "...";
    		}
    		songbook.mp3 = url;
    		console.log(self);
    		self.setMusicPlayerOptions(songbook);
	        self.isPaused = false;
    	});
		
	}

	init() {
		this.element.jPlayer("stop");

		this.element.jPlayer({
	        size: {
	            width: "0px",
	            height: "0px"
	        },
	        supplied: "mp3",
	        wmode: "window",
	        useStateClassSkin: true,
	        autoBlur: false,
	        smoothPlayBar: true,
	        keyEnabled: true,
	        remainingDuration: true,
	        toggleDuration: true
    	});
    	if(this.getCurrentSongbookCallback()) {
    		this.setMusicPlayerOptions(this.getCurrentSongbookCallback());
    	}

	}

	setMusicPlayerOptions(songbook) {
	    if(songbook.mp3) {
	    	//this.localAudio = false;
	        this.element.jPlayer("setMedia", 
	        {
	            title: songbook.title,
	            mp3: songbook.mp3
	        });
	    }
	}

    play(callback) {
    	this.element.bind($.jPlayer.event.play, () => { callback(); });
    	this.element.jPlayer("play", 0);
    }

    togglePause() {
    	if(!this.isPaused) {
    		this.element.jPlayer("pause");
    	} else {
    		this.element.jPlayer("play");
    	}
    	this.isPaused = !this.isPaused;
    }

}


module.exports = AudioPlayer;