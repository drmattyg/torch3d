"use strict"
class AudioPlayer {

	constructor(id, mp3InputId) {
		this.id = id;
		this.element = $(id);
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
			this.mediaTitle = ""
			this.mediaTitle = "";
			if(songbook.title) {
				this.mediaTitle = songbook.title;
			}
			this.setMusicPlayerOptions();
		}
	}

	setLocalInput() {
		var f = $(mp3InputId).get(0).files[0];
		var url = window.URL.createObjectURL(f);
		if(!songbook.title) {
			this.mediaTitle = f.name.substr(0, 20) + "...";
    	} else {
    		this.mediaTitle = mediaTitle = f.name.substr(0, 20) + "...";
    	}
    	this.setMusicPlayerOptions();

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

	init(songbook) {
		// this.getMediaSettings();
		this.element.jPlayer("stop");
		this.mediaUrl = null;
		this.mediaTitle = null;

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
    	if(songbook) {
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