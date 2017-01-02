"use strict"
class AudioPlayer {

	constructor(id, mp3InputId) {
		this.id = id;
		this.element = $(id);
		this.mp3InputId = mp3InputId;
		this.init(null);
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

	reset() {
		this.element.jPlayer("stop");
		this.mediaUrl = null;
		this.mediaTitle = null;
	}



	init(songbook) {
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
    		this.setSongbook(songbook);
    	}

	}

	setMusicPlayerOptions() {
		var url = this.mediaUrl;
		var title = this.mediaTitle;
        this.element.jPlayer("setMedia", 
        {
            title: title,
            mp3: url
        });
	}

    play(callback) {
    	this.element.unbind($.jPlayer.event.play);
    	this.element.bind($.jPlayer.event.play, () => { 
    		callback(); 
    	});
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