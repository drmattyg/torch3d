"use strict"
var jsyaml = require('js-yaml')
var _ = require('lodash')
var MIN_TIME = 1000; // min travel time
var print = console.log;

class Songbook {
	constructor(yml, torchModel) {
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

	setEdges(command) {
		var self = this;
		_.forEach(command.edges, (e) => {
			var edge = self.torchModel.edges["e" + e.edge];
			edge.flame_state = e.flame;
			var distance = e.distance ? e.distance : 1.0;
			var drive_dir = e.dir ? e.dir : 1;
			edge.setAutoSpeed(true, command.time, distance, drive_dir);
		});

	}

	clearEdges() {
		self = this;
		_.forEach()
	}

	allDone(wf) {
		var states = _.map(wf, function(w) { return !w.done; })
		return !_.find(states)
	}

	run() {
		var self = this;
		var cmd_num = 0;
		var _animate = function(time) {
			if(self.startTime == null) {
				self.startTime = time;
			}
			var currTime = time - self.startTime;
			while(cmd_num <= self.songbook.length - 1 && currTime >= self.songbook[cmd_num].start_at) {
				var current_command = self.songbook[cmd_num++];
				self.setEdges(current_command);
			}
			self.torchModel.tick(currTime);
			window.render();
			requestAnimationFrame(_animate);
    	};
    	requestAnimationFrame(_animate);

	}



}
module.exports = Songbook;
