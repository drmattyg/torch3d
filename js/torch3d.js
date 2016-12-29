"use strict";
var TorchModel = require('./torchModel.js')
var EdgeModel = require('./edge.js')
var Songbook = require('./songbook.js')
var TorchScene = require('./scene.js')
var renderer = new THREE.WebGLRenderer();
var container = document.getElementById('torch');
var jsyaml = require('js-yaml');
var fs = require('fs');
var editorControl = require('./editor.js');
//document.body.appendChild( container );

renderer.setSize(300, 600);
//document.body.appendChild(renderer.domElement);
container.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera(45, 0.5, 1, 500);
// camera.position.set(5, 20, 50);
camera.position.set(5, 20, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var ts = new TorchScene(scene);
ts.loadSkyBox();
ts.loadGround();

var editor = ace.edit("editor");
window.editor = editor;
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/yaml");

var scale = 10;
var torchModel = new TorchModel(scale, scene);
var torchModelRender = torchModel.renderStructure()
scene.add(torchModelRender);

window.render = function() {
    renderer.render(scene, camera);
}

$(document).ready(function(){
    editorControl.loadSample('test2');
    $("#run-button").click(function() {
        torchModel.clear();

        var text = editor.getValue();
        try {
            var yml = jsyaml.safeLoad(text);
//            torchModel = new TorchModel(scale, scene);
            scene.add(torchModel.renderStructure());
            var sb = new Songbook(text, torchModel);
            sb.run();
        } catch(e) {
            $('#error-modal-text pre').text(e.message);
            $('#error-modal').modal();
        }
    });
});
// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         var sb = new Songbook(this.responseText, torchModel);
//         sb.run();
//     }
// };
// xhttp.open("GET", "songbooks/test.yaml", true);
// xhttp.send();

