"use strict";

var FLAME_STATE = {
	OFF: 0,
	ON: 1
}

var DRIVE_DIRECTION = {
	FORWARD: 1,
	REVERSE: -1
}
print = console.log;
// Fuck I've been writing Python for two long, now I have mixed camelCase and
// snake_case.  MY BRAIN CANNOT DEAL.
// TODO: Test more cases with more commands; fix edge labels; fix up website; add music; write a good demo; DOCUMENT
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
		this.limit_callback = null;
		var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
		this.flame = new THREE.PointLight( 0xff0040, 2, 50 );
		this.flame.add( new THREE.Mesh( sphere,
			new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		this.flame.name = this.flame.uuid;
		this.auto_speed = null;

	}

/* auto_speed automagically moves the flame such that it covers a set distance in
/* a set amount of time.  In the actual sculpture, we will calculate the max run
/* speed using a calibration run prior to running the playbook and set the PWM
/* accordingly.   Here we simply use the absolute time and distance to calculate
/* the distance to move the flame with each tick.  autoSpeed doesn't care
/* whether the specified distance is out of bounds; the limit switch callback
/* handles that, the same way it will in the physical sculpture. */


	setAutoSpeed(on, travel_time, distance, drive_dir) {
		if(!on) {
			this.auto_speed = false;
		} else {
			this.auto_speed = {
				travel_time: travel_time,
				start_position: this.relative_position,
				distance: distance == undefined ? 1 : distance,
				drive_dir: drive_dir,
				start_time: null,
				start_position: this.relative_position
			};
		}
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

	flameOn() {
		this.scene.add(this.flame);
	}

	renderFlame() {
		if(this.flame_state == FLAME_STATE.ON) {
			var pt = this.spatialPosition();
			this.flame.position.set(pt[0], pt[1], pt[2]);
			this.scene.add(this.flame);
		}
		else {
			this.scene.remove(this.flame);
		}
	}

	tick(time) {
		var new_position = null;
		if(this.auto_speed != null) {
			if(time == undefined) {
				throw new Error("Edge.tick requires a time argument if used with auto_speed")
			}
			if(this.auto_speed.start_time == null) {
				this.auto_speed.start_time = time;
			}
			var time_offset = time - this.auto_speed.start_time;
			this.drive_dir = this.auto_speed.drive_dir;
			new_position = this.auto_speed.start_position + this.auto_speed.distance * this.auto_speed.drive_dir *
				time_offset/this.auto_speed.travel_time;

			// shut it down when it hits the time point
			if(time_offset >= this.auto_speed.travel_time) {
				this.auto_speed = null;
			}

		}

		// legacy code for dealing with explicit speed settings
		// else if(this.speed > 0) {
		// 	new_position = this.relative_position + (this.drive_dir * this.speed/1000);
		// }

		// check for limit conditions
		if(new_position <= 0 && this.drive_dir == DRIVE_DIRECTION.REVERSE) {
			this.relative_position = 0;
			this.auto_speed = null;
			if(this.limit_callback) {
				this.limit_callback(DRIVE_DIRECTION.REVERSE);
			}
		}

		else if(new_position >= 1 && this.drive_dir == DRIVE_DIRECTION.FORWARD && this.speed > 0) {
			this.relative_position = 1;
			this.auto_speed = null;
			if(this.limit_callback) {
				this.limit_callback(DRIVE_DIRECTION.FORWARD);
			}
		} else {
			if(new_position) {
				this.relative_position = new_position;
			}
		}
		this.renderFlame()
	}

	// this doesn't work quite right, just moved over the unfinished example code from torch3d.js
	addEdgeLabel(scene, text, xyz) {
		var font_loader = new THREE.FontLoader();
		var font = null
		font_loader.load('fonts/droid_sans_bold.typeface.json', function(font) {
			var text_geo = new THREE.TextGeometry(text, {font: font, size: 1, height: 0.1})
			var text_mesh = new THREE.Mesh(text_geo, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) )
			var text_group = new THREE.Group();
			text_group.add(text_mesh);
			text_group.position.set(xyz[0]*scale, xyz[1]*scale, xyz[2]*scale);
			scene.add(text_group);
		});
	}



}

module.exports = {
	FLAME_STATE: FLAME_STATE,
	DRIVE_DIRECTION: DRIVE_DIRECTION,
	Edge
}
