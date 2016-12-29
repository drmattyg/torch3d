"use strict"
module.exports = {
	loadSample: function(name) {
		if(!name.endsWith(".yaml")) {
			name = name + ".yaml";
		}
		$.get({
			url: "songbooks/" + name,
			success: (resp) => {
				window.editor.setValue(resp, 1);
			}
		})
	}
}