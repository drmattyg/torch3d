"use strict";

var FLAME_STATE = {
	OFF: 0,
	ON: 1
}

var DRIVE_DIRECTION = {
	FORWARD: 1,
	REVERSE: -1
}

class Edge {

	constructor(reverse_vertex, forward_vertex, scale, speed){
		this.reverse_vertex = reverse_vertex;
		this.forward_vertex = forward_vertex;
		this.speed = speed;
		this.scale = scale;
		this.relative_position = 0; // 0 = reverse_vertex, 1 = forward_vertex
		this.state = FLAME_STATE.OFF;
		this.drive_dir = DRIVE_DIRECTION.FORWARD;
	}

	get spatialPosition() {
		var r = [0, 0, 0];
		[0, 1, 2].forEach((n) => { r[n] = this.scale*(this.reverse_vertex[n] + this.forward_vertex[n])/2 } )
		return r;
	}

	get limitReverse() {
		return (this.relative_position <= 0);
	}

	get limitForward() {
		return (this.relative_position >= 1);
	}


}