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
    	$("#mp3-input").on("change", () => { 
    		var f = $("#mp3-input").get(0).files[0];
    		this.element.jPlayer("setMedia", 
	        {
	            title: f.name.substr(0, 20) + "...",
	            mp3: window.URL.createObjectURL(f)
	        });
    	});
		
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

    play(callback) {
    	this.element.bind($.jPlayer.event.play, () => { callback(); });
    	this.element.jPlayer("play", 0);
    }


}


module.exports = AudioPlayer;