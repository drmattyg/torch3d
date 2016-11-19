"use strict";

var FLAME_STATE = {
	OFF: 0,
	ON: 1
}

var DRIVE_DIRECTION = {
	FORWARD: 1,
	REVERSE: -1
}

var DRIVE_STATE = {
	ON: 1,
	OFF: 0
}

class Edge {

	constructor(reverse_vertex, forward_vertex, scale, speed, scene){
		this.reverse_vertex = reverse_vertex;
		this.forward_vertex = forward_vertex;
		this.speed = speed;
		this.scale = scale;
		this.scene = scene;
		this.relative_position = 0; // 0 = reverse_vertex, 1 = forward_vertex
		this.flame_state = FLAME_STATE.OFF;
		this.drive_dir = DRIVE_DIRECTION.FORWARD;
		this.drive_state = DRIVE_STATE.OFF;
		this.limit_callback = null;
		var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
		this.flame = new THREE.PointLight( 0xff0040, 2, 50 );
		this.flame.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

	}

	setLimitCallback(cb) {
		this.limit_callback = cb;
	}

	spatialPosition() {
		var p = (x0, x1, f) => { return x0 + (x1 - x0)*f; }
		var r = [0, 0, 0];
		var self = this;
		[0, 1, 2].forEach(function(n) {
			r[n] = 
			self.scale*(self.reverse_vertex[n] + 
				(self.forward_vertex[n] - 
					self.reverse_vertex[n])*(1.0*self.relative_position));
		})
		return r;
	}

	get limitReverse() {
		return (this.relative_position <= 0);
	}

	get limitForward() {
		return (this.relative_position >= 1);
	}

	renderFlame() {
		if(this.flame_state == FLAME_STATE.ON) {
			var pt = this.spatialPosition();
			this.flame.position.set(pt[0], pt[1], pt[2]);
			this.scene.add(this.flame);
		} else {
			this.scene.remove(this.flame);
		}
	}

	tick() {
		if((this.limitReverse && this.drive_dir == DRIVE_DIRECTION.REVERSE) || 
			(this.limitForward && this.drive_dir == DRIVE_DIRECTION.FORWARD)) { return; }
		if(this.drive_state == DRIVE_STATE.ON) {
			var new_position = this.relative_position + (this.drive_dir * this.speed);
			if(new_position <= 0 && this.drive_dir == DRIVE_DIRECTION.REVERSE) {
				this.relative_position = 0;
				this.speed = 0;
				if(this.limit_callback) {
					this.limit_callback(DRIVE_DIRECTION.REVERSE);
				}
				return;
			}

			if(new_position >= 1 && this.drive_dir == DRIVE_DIRECTION.FORWARD) {
				this.relative_position = 1;
				this.speed = 0;
				if(this.limit_callback) {
					this.limit_callback(DRIVE_DIRECTION.FORWARD);
				}
				return;
			}
			this.relative_position = new_position;
		}
		this.renderFlame()
	}


}

module.exports = {
	FLAME_STATE: FLAME_STATE,
	DRIVE_DIRECTION: DRIVE_DIRECTION,
	DRIVE_STATE: DRIVE_STATE,
	Edge
}