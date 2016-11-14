var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 10, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var material = new THREE.LineBasicMaterial({
	color: 0x0000ff, linewidth: 3
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
var vertices = {v0: [0.5, h, c], v1: [0, 0, 0], v2: [1, 0, 0], v3: [0.5, 0, h], v4: [0.5, -h, c]} ;

var draw_vertices = [
    vertices.v1, vertices.v2, vertices.v3, // X-Z plane triangle
    vertices.v1, vertices.v0, vertices.v2, // top tetrahedron side 1
    vertices.v3, vertices.v0, // top tetrahedron side 2

    vertices.v1, vertices.v4, vertices.v2, // bottom tetrahedron side 2
    vertices.v4, vertices.v3 // bottom tetrahedron side 2


]

draw_vertices.forEach(function(v) { 
	geometry.vertices.push(new THREE.Vector3(v[0]*scale, v[1]*scale, v[2]*scale));
})
// geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
// geometry.vertices.push(new THREE.Vector3(0, 10, 0));
// geometry.vertices.push(new THREE.Vector3(10, 0, 0));

var line = new THREE.Line(geometry, material);

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
scene.add(line);
addEdgeLabel(scene, "1", [(vertices.v0[0] + vertices.v1[0])/2, (vertices.v0[1] + vertices.v1[1])/2, (vertices.v0[2] + vertices.v1[2])/2]);

// scene.add(sphere);
//renderer.render(scene, camera);
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
	line.rotation.y += rotation_speed;

	renderer.render(scene, camera);
};
render();

var totalTime = 5000; // 5 sec
var startTime = 0;

anim = function(time) {
    if(startTime == 0) {
        startTime = time;
    } else {
        dt = time - startTime;
        if(dt < totalTime) {
            light1.position.x = scale*1.0*(dt/totalTime);
        }
    }
    requestAnimationFrame(anim);
}
requestAnimationFrame(anim);