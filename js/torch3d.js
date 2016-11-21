"use strict";
var TorchModel = require('./torchModel.js')
var EdgeModel = require('./edge.js')
var Songbook = require('./songbook.js')
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 10, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var scale = 10;
var torchModel = new TorchModel(scale, scene);
var torchModelRender = torchModel.renderStructure()
scene.add(torchModelRender);


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
window.render = function() {
    renderer.render(scene, camera);
}
window.render()
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var sb = new Songbook(this.responseText, torchModel);
        sb.run();
    }
};
xhttp.open("GET", "songbooks/test.yaml", true);
xhttp.send();

