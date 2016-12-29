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
var	loadSample = function(name, callback) {
	getSample(name, (resp) => {
		window.editor.setValue(resp, 1);
		window.editor.scrollToLine(0, false, false, () => {});
		callback();
	});
}


module.exports = { getSample: getSample, loadSample: loadSample}