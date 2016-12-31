"use strict"
class AudioPlayer {

	constructor(id) {
		this.id = id;
		this.element = $(id);
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
		this.element.bind($.jPlayer.event.play, () => { console.log("foo") ;});
	}

	setMusicPlayerOptions(songbook) {
	    if(songbook.mp3) {
	        this.element.jPlayer("setMedia", 
	        {
	            title: songbook.title,
	            mp3: songbook.mp3
	        });
	    }
	}

    play() {
    	this.element.jPlayer("play", 0);
    }
}


module.exports = AudioPlayer;