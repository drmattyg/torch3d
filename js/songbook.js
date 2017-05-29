"use strict"
var jsyaml = require('js-yaml')
var _ = require('lodash')
var MIN_TIME = 1000; // min travel time
var print = console.log;

var BLANK_SONGBOOK_YAML = "version: 1.0\nsongbook:\n - start at: 0\n   time: 1\n   edges: []\n"

class Songbook {
	constructor(yml, torchModel, callback) {
		try {
			var parsed = jsyaml.safeLoad(yml);
			if(!parsed.version == 1.0) {
				throw new Error("Only version 1.0 songbooks supported")
			}
			this.songbook = parsed.songbook.sort(function(m1, m2){
				if(m1.start_at < m2.start_at) {
					return -1;
				}
				if(m1.start_at > m2.start_at) {
					return 1;
				}
				return 0;
			});
		} catch(e) {
			console.log(e)
		}
		this.torchModel = torchModel
		this.startTime = null;
		this.run_animation = false;
		this.pause = false;
		self = this;
		['author', 'title', 'mp3', 'version'].forEach((k) => {
			self[k] = parsed[k];
		});
		if(callback != undefined) {
			callback(this);
		}
	}

	setCallbacks(measure) {
		var wf = [];
		var self = this
		_.forEach(measure, (cmd) => {
			var waitForObj;

			if(!cmd.speed) {
				waitForObj = {done: true, callback: null};
			} else {
				waitForObj = {done: false, callback: null};
				var limitCallback = (x) => { waitForObj.done = true; }
				waitForObj.callback = limitCallback;
				self.torchModel.edges[cmd.edge].setLimitCallback(limitCallback);
			}

			wf.push(waitForObj);
		})
		return wf;
	}

	togglePause() {
		this.pause = !this.pause;
		return this.pause;
	}

	setEdges(command) {
		var self = this;
		_.forEach(command.edges, (e) => {
			var edge = self.torchModel.edges["e" + e.edge];
			edge.flame_state = e.flame;
			var distance = e.distance ? e.distance : 1.0;
			var drive_dir = e.dir != null ? e.dir : 1;
			edge.setAutoSpeed(true, command.time, distance, drive_dir);
		});

	}

	allDone(wf) {
		var states = _.map(wf, function(w) { return !w.done; })
		return !_.find(states)
	}

	run(timerCallback) {
		var self = this;
		self.run_animation = true;
		var cmd_num = 0;
		var cumulativePauseTime = 0;
		var lastPauseStart = null;
		var _animate = function(time) {
			if(self.pause) {
				if(lastPauseStart === null) {
					lastPauseStart = time;
				}
			}
			if(!self.pause) {
				if(lastPauseStart != null)  {
					cumulativePauseTime += time - lastPauseStart;
					lastPauseStart = null;
				}
				
				var renderer = window.renderer;
				var width = $("#torch").width()
				var height = $("#torch").height()
	 
				// check if the canvas is the same size
				if (renderer.domElement.width !== width ||
				    renderer.domElement.height !== height) {
					camera.aspect = width/height;
	    			camera.updateProjectionMatrix();
			    	renderer.setSize( width, height, true );
				}
				if(self.run_animation) {
					if(self.startTime == null) {
						self.startTime = time;
					}
					var currTime = time - self.startTime - cumulativePauseTime;
					if(timerCallback) {
						timerCallback(currTime);
					}
					while(cmd_num <= self.songbook.length - 1 && currTime >= self.songbook[cmd_num].start_at) {
						var current_command = self.songbook[cmd_num++];
						self.setEdges(current_command);
					}
					self.torchModel.tick(currTime);
				}
				window.render();
				
			}
			requestAnimationFrame(_animate);

    	};
    	requestAnimationFrame(_animate);
	}

    stop() { 
    	this.torchModel.delete();
    	this.run_animation = false; 
    }



}

Songbook.BLANK_SONGBOOK = (torchModel) => new Songbook(BLANK_SONGBOOK_YAML, torchModel);
module.exports = Songbook;
