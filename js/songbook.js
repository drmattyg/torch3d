"use strict"
var jsyaml = require('js-yaml')
var _ = require('lodash')

class Songbook {
	constructor(yml, torchModel) {
		try {
			this.songbook = jsyaml.safeLoad(yml)
		} catch(e) {
			console.log(e)
		}
		this.torchModel = torchModel
	}

	setCallbacks(measure) {
		this.wait_for = {}
		var self = this
		_.forEach(measure, (cmd) => {
			var waitForObj = {done: false, callback: null}
			var limitCallback = (x) => { waitForObj.done = true; }
			waitForObj.callback = limitCallback;
			self.torchModel.edges[cmd.edge].setLimitCallback(limitCallback);
		})
		this.wait_for = _.map(measure, function(cmd) { 
			return {edge: cmd.edge, done: false, callback: null}
		})
	}

	allDone() {
		var states = _.map(this.wait_for, function(w) { return !w.done; })
		return !_.find(states)
	}

	run() {
		var self = this;
		var m_start = true;
		var cmd_start = true;
		var cmd_num = 0;
		var measure_num = 0;
		var measure = null;
		var _animate = function(time) {

			if(m_start) {
				console.log("Start measure")
				measure = self.songbook[measure_num].measure
				self.torchModel.clearCallbacks();
				self.setCallbacks(measure);
				_.forEach(measure, (cmd) => {
					var edge = self.torchModel.edges[cmd.edge];
					edge.speed = cmd.speed;
					edge.flame_state = cmd.flame;
					if(cmd.dir) { edge.drive_dir = cmd.dir; }				
				});
				m_start = false;

			}
			self.torchModel.tick(time);
			window.render();
			console.log(self.allDone())
			if(self.allDone()) {
				console.log("Next measure");
				measure_num++;
				m_start = true;
			}
			if(measure_num > self.songbook.length) {
				console.log("Done")
				return;
			}
    		requestAnimationFrame(_animate);
    	};
    	requestAnimationFrame(_animate);

	}

		// _.forEach(self.songbook, function(m) {
		// 	var measure = m.measure;
		// 	self.torchModel.clearCallbacks();
		// 	self.setCallbacks(measure);
		// 	_.forEach(measure, (cmd) => {
		// 		var edge = self.torchModel.edges[cmd.edge];
		// 		edge.speed = cmd.speed;
		// 		edge.flame_state = cmd.flame;
		// 		if(cmd.dir) { edge.drive_dir = cmd.dir; }
		// 		requestAnimationFrame(_animate);
		// 		while(!self.allDone()) {
		// 			console.log("Not done")
		// 		}

		// 	});

		// });


}
module.exports = Songbook;