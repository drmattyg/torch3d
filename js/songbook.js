"use strict"
var jsyaml = require('js-yaml')
var _ = require('lodash')
var MIN_TIME = 1000; // min travel time

class Songbook {
	constructor(yml, torchModel) {
		try {
			this.songbook = jsyaml.safeLoad(yml).sort(function(m1, m2){
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
		/* TODO: need to rewrite this to use autospeed */
		var self = this;
		var command_time = command.time;
		_.forEach(command.edges, (edge) => {
			var edge = self.torchModel.edges[cmd.edge];
			edge.speed = cmd.speed;
			edge.flame_state = cmd.flame;
			if(cmd.dir) { edge.drive_dir = cmd.dir; }
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
		// var m_start = true;
		// var cmd_start = true;
		var cmd_num = 0;
		// var measure_num = 0;
		// var measure = null;
		// var wf = null;
		var _animate = function(time) {
			if(time >= self.songbook[cmd_num].start_at) {
				var current_command = self.songbook[cmd_num];
				var current_run_time = self.current_command.time
				self.setEdges(current_command);
			}
			if(m_start) {

				wf = [];
				measure = self.songbook[measure_num].measure
				self.torchModel.clearCallbacks();
				wf = self.setCallbacks(measure);
				self.setEdges(measure);
				m_start = false;

			}
			self.torchModel.tick(time);
			window.render();
			if(self.allDone(wf)) {
				measure_num++;
				m_start = true;
			}
			if(!(measure_num >= self.songbook.length)) {
				requestAnimationFrame(_animate);
			}

    	};
    	requestAnimationFrame(_animate);

	}



}
module.exports = Songbook;
