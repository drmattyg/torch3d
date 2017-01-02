"use strict"
class AudioPlayer {

	constructor(id, mp3InputId) {
		this.id = id;
		this.element = $(id);
		this.mp3InputId = mp3InputId;
		console.log("a");
		this.init(null);
		console.log("b");
    	//this.localAudio = false;
    	var self = this;
    	$(mp3InputId).on("change", () => { 
    		self.setLocalInput();
	        self.isPaused = false;
    	});
		
	}

	setSongbook(songbook) {
		if(songbook.mp3) {
			this.mediaUrl = songbook.mp3;
			this.mediaTitle = "";
			if(songbook.title) {
				this.mediaTitle = songbook.title;
			}
			this.setMusicPlayerOptions();
		}
	}

	setLocalInput() {
		console.log(this.mp3InputId);
		var f = $(this.mp3InputId).get(0).files[0];
		if(!f) {
			return false;
		}
		this.mediaUrl = window.URL.createObjectURL(f);
		if(!this.mediaTitle) {
			this.mediaTitle = f.name.substr(0, 20) + "...";
    	}
    	this.setMusicPlayerOptions();
    	return true;

	}

	// getMediaSettings() {
	// 	var songbook = this.getCurrentSongbookCallback();
	// 	console.log(1);
	// 	if(songbook)  {
	// 		console.log(2);
	// 		this.mediaUrl = songbook.mp3;
	// 		this.mediaTitle = "";
	// 		if(songbook.title) {
	// 			this.mediaTitle = songbook.title;
	// 		}
	// 		console.log(this.mediaUrl);
	// 		return;
	// 	}
	// }

	reset() {
		this.mediaUrl = null;
		this.mediaTitle = null;
	}

	init(songbook) {
		// this.getMediaSettings();
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
    	this.mediaUrl = null;
    	if(!this.setLocalInput() && songbook != null) {
//    	if(songbook) {
    		this.setSongbook(songbook);
    	}

	}

	setMusicPlayerOptions() {
		console.log("setting");
		console.log(this.mediaUrl);
		var url = this.mediaUrl;
		var title = this.mediaTitle;
        this.element.jPlayer("setMedia", 
        {
            title: title,
            mp3: url
        });
	}

    play(callback) {
    	console.log("blah")
    	console.log(this.mediaUrl);
    	console.log(this.mediaTitle);
    	this.element.bind($.jPlayer.event.play, () => { 
    		callback(); 
    	});
    	this.element.jPlayer("play", 0);
    	console.log("asdf")
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