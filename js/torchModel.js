"use strict";
var EdgeModel = require("./edge.js")
var Edge = EdgeModel.Edge
class TorchModel {
    constructor(scale, scene) {
        this.scale = scale;
        this.speed = scale/10;
        this.scene = scene;
        var h = Math.sqrt(3)/2
        var c = 1/3
        this.vertices = {v0: [0.5, h, c], v1: [0, 0, 0], v2: [1, 0, 0], v3: [0.5, 0, h], v4: [0.5, -h, c]} ;
        this.edges = {
        	e0: new Edge(this.vertices.v1, this.vertices.v0, scale, this.speed, this.scene),
        	e1: new Edge(this.vertices.v2, this.vertices.v0, scale, this.speed, this.scene),
        	e3: new Edge(this.vertices.v3, this.vertices.v0, scale, this.speed, this.scene),
        	e4: new Edge(this.vertices.v1, this.vertices.v2, scale, this.speed, this.scene),
        	e5: new Edge(this.vertices.v2, this.vertices.v3, scale, this.speed, this.scene),
        	e6: new Edge(this.vertices.v3, this.vertices.v1, scale, this.speed, this.scene),
        	e7: new Edge(this.vertices.v4, this.vertices.v1, scale, this.speed, this.scene),
        	e8: new Edge(this.vertices.v4, this.vertices.v2, scale, this.speed, this.scene),
        	e9: new Edge(this.vertices.v4, this.vertices.v3, scale, this.speed, this.scene)
        }

    }

    renderStructure() { 
		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff, linewidth: 3
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

}

module.exports = TorchModel