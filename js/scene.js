"use strict"
// https://solutiondesign.com/blog/-/blogs/webgl-and-three-js-creating-a-real-scene


class TorchScene {
	constructor(scene) {
		this.scene = scene;
	}
	loadSkyBox()  {

		// Load the skybox images and create list of materials
		var materials = [
			this.createMaterial( 'images/skyX55+x.png' ), // right
			this.createMaterial( 'images/skyX55-x.png' ), // left
			this.createMaterial( 'images/skyX55+y.png' ), // top
			this.createMaterial( 'images/skyX55-y.png' ), // bottom
			this.createMaterial( 'images/skyX55+z.png' ), // back
			this.createMaterial( 'images/skyX55-z.png' )  // front
		];
		
		// Create a large cube
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
		
		// Set the x scale to be -1, this will turn the cube inside out
		mesh.scale.set(-1,1,1);
		this.scene.add( mesh );	
	}

	createMaterial( path ) {
		var texture = THREE.ImageUtils.loadTexture(path);
		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

		return material; 
	}
}

module.exports = TorchScene;