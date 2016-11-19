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
		_.forEach(measure, (cmd) => {
			var waitForObj = {done: false, callback: null}
			var limitCallback = (x) => { wait_for_obj.done = true; }
			waitForObj.callback = limitCallback;
			torchModel.edges[cmd.edge].setLimitCallback(limitCallback);
		})
		this.wait_for = _.map(measure, function(cmd) { 
			return {edge: cmd.edge, done: false, callback: null}
		})
		torchModel.edges[cmd.edge].setLimitCallback((dir) => { })
	}

	allDone() {
		var states = _.map(this.wait_for, function(w) { return !w.done; })
		return !_.find(states)
	}


	_animate(time) {
	    torchModel.tick(time);
	    requestAnimationFrame(this._animate);
	}


	run() {
		_.forEach(self.songbook, function(m) {
			var measure = m.measure;
			setCallbacks(measure);
			_.forEach(measure, (cmd) => {
				var edge = torchModel.edges[cmd.edge];
				edge.speed = cmd.speed;
				edge.flame_state = cmd.flame_state;
				if(cmd.dir) { edge.drive_dir = cmd.dir; }
			});
			while(!allDone()) { }
		});
	}


}
module.exports = Songbook;