"use strict"

var	getSample = function(name, callback) {
	if(!name.endsWith(".yaml")) {
		name = name + ".yaml";
	}
	$.get({
		url: "songbooks/" + name,
		success: (resp) => {
			callback(resp);
		}
	})
}
var	loadSample = function(name) {
	getSample(name, (resp) => window.editor.setValue(resp, 1) );
}


module.exports = { getSample: getSample, loadSample: loadSample}