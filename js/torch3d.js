var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 10, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});


var geometry = new THREE.Geometry();
var scale = 10;
// vertices = [
// 				[1,1,1], [1,-1,-1], [-1,1,-1], 
// 				[1,1,1], [-1,-1,1], [1,-1,-1],  
// 				[1,1,1], [-1,1,-1], [-1,-1,1],  
// 			[1,1,1]]
var h = Math.sqrt(3)/2
var c = 1/3
vertices = [
	[0, 0, 0], [1, 0, 0], [0.5, 0, h],
	[0, 0, 0], [0.5, h, c], [1, 0, 0],
	[0, 0, 0], [0.5, 0, h], [0.5, h, c],

	[0, 0, 0], [0.5, -h, c], [1, 0, 0],
	[0, 0, 0], [0.5, 0, h], [0.5, -h, c],
	[0, 0, 0]
]
vertices.forEach(function(v) { 
	geometry.vertices.push(new THREE.Vector3(v[0]*scale, v[1]*scale, v[2]*scale));
})
// geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
// geometry.vertices.push(new THREE.Vector3(0, 10, 0));
// geometry.vertices.push(new THREE.Vector3(10, 0, 0));

var line = new THREE.Line(geometry, material);
// line.position.x -= 0.5*scale;
// line.position.z += c*scale/2; 
scene.add(line);
//renderer.render(scene, camera);
var rotation_speed = 0.02;
document.setRotation = function() {
    if(rotation_speed == 0) {
        rotation_speed = 0.02; 
    } else {
        rotation_speed = 0;
    }
}
var render = function () {
	requestAnimationFrame( render );
	line.rotation.y += rotation_speed;

	renderer.render(scene, camera);
};
render();