"use strict";
var EdgeModel = require("./edge.js")
var Edge = EdgeModel.Edge
class TorchModel {
    constructor(scale, scene) {
    	var offset = [-0.4, 0, 1];
        this.scale = scale;
        this.speed = scale/10;
        this.scene = scene;
        var h = Math.sqrt(3)/2
        var c = 1/3
        var DEFAULT_VERTICES = {v0: [0.5, 2*h, c], v1: [0, h, 0], v2: [1, h, 0], v3: [0.5, h, h], v4: [0.5, 0, c]} ;
        this.vertices = {}
        self = this;
        Object.keys(DEFAULT_VERTICES).forEach(function(k) {
        	var xyz = DEFAULT_VERTICES[k];
        	[0, 1, 2].forEach(function(ix) {
        		xyz[ix] += offset[ix];
        	})
        	self.vertices[k] = xyz;
        })
        this.edges = {
        	e0: new Edge(this.vertices.v1, this.vertices.v0, scale, this.speed, this.scene),
        	e1: new Edge(this.vertices.v2, this.vertices.v0, scale, this.speed, this.scene),
        	e2: new Edge(this.vertices.v3, this.vertices.v0, scale, this.speed, this.scene),
        	e3: new Edge(this.vertices.v1, this.vertices.v2, scale, this.speed, this.scene),
        	e4: new Edge(this.vertices.v2, this.vertices.v3, scale, this.speed, this.scene),
        	e5: new Edge(this.vertices.v3, this.vertices.v1, scale, this.speed, this.scene),
        	e6: new Edge(this.vertices.v4, this.vertices.v1, scale, this.speed, this.scene),
        	e7: new Edge(this.vertices.v4, this.vertices.v2, scale, this.speed, this.scene),
        	e8: new Edge(this.vertices.v4, this.vertices.v3, scale, this.speed, this.scene)
        }

    }

    stopAll() {
    	var self = this
    	this.edges.forEach((edge) => { edge.speed = 0; })
    }

    renderStructure() { 
		var material = new THREE.LineBasicMaterial({
			color: 0x00ffff, linewidth: 3
		});
		var geometry = new THREE.Geometry();
		var draw_order = [
		    this.vertices.v1, this.vertices.v2, this.vertices.v3, // X-Z plane triangle
		    this.vertices.v1, this.vertices.v0, this.vertices.v2, // top tetrahedron side 1
		    this.vertices.v3, this.vertices.v0, // top tetrahedron side 2

		    this.vertices.v1, this.vertices.v4, this.vertices.v2, // bottom tetrahedron side 2
		    this.vertices.v4, this.vertices.v3 // bottom tetrahedron side 2
		]
		draw_order.forEach((v) => { geometry.vertices.push(new THREE.Vector3(v[0]*this.scale, v[1]*this.scale, v[2]*this.scale)); });
		return new THREE.Line(geometry, material);
    }

    edgeList() { 
    	var self = this;
    	return Object.keys(self.edges).map((k) => self.edges[k])

    }

    clearCallbacks() {
    	var self = this;
    	self.edgeList().forEach((edge) => { 
    		edge.setLimitCallback(null);
    	})
    }

    tick(time) {
    	this.edgeList().forEach((edge) => edge.tick());
    }

}

module.exports = TorchModel