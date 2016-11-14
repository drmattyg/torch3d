"use strict";
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 10, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var scale = 10;
var torchModel = new TorchModel(scale);
var torchModelRender = torchModel.renderStructure()
scene.add(torchModelRender);


var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
var light1 = new THREE.PointLight( 0xff0040, 2, 50 );
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
light1.position.set(0, 0, 0);

var addEdgeLabel = function(scene, text, xyz) {
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

scene.add( light1 );
var rotation_speed = 0.0;

// eventeually replace this with camera rotation
// https://codepen.io/nireno/pen/cAoGI
document.setRotation = function() {
    if(rotation_speed == 0) {
        rotation_speed = 0.02; 
    } else {
        rotation_speed = 0;
    }
}
var render = function () {
	requestAnimationFrame( render );
	torchModelRender.rotation.y += rotation_speed;

	renderer.render(scene, camera);
};
render();

var totalTime = 5000; // 5 sec
var startTime = 0;

var anim = function(time) {
    if(startTime == 0) {
        startTime = time;
    } else {
        var dt = time - startTime;
        if(dt < totalTime) {
            light1.position.x = scale*1.0*(dt/totalTime);
        }
    }
    requestAnimationFrame(anim);
}
requestAnimationFrame(anim);