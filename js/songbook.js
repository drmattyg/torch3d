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
		this.current = -1
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
		var _animate = function(time) {
			self.torchModel.tick(time);
			window.render();
    		if(!self.allDone()) {
    			requestAnimationFrame(_animate);
    		}
		};

		_.forEach(self.songbook, function(m) {
			var measure = m.measure;
			self.torchModel.clearCallbacks();
			self.setCallbacks(measure);
			_.forEach(measure, (cmd) => {
				var edge = self.torchModel.edges[cmd.edge];
				edge.speed = cmd.speed;
				edge.flame_state = cmd.flame;
				if(cmd.dir) { edge.drive_dir = cmd.dir; }
				requestAnimationFrame(_animate);

			});

		});
	}


}
module.exports = Songbook;