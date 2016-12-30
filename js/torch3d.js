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
var torchModel = null;

window.render = function() {
    renderer.render(scene, camera);
}

function runEditorSongbook() {
    torchModel = new TorchModel(scale, scene);

    var torchModelRender = torchModel.getRenderStructure()
    scene.add(torchModelRender);
    var text = editor.getValue();
    try {
        var yml = jsyaml.safeLoad(text);
//            torchModel = new TorchModel(scale, scene);
        window.current_songbook = new Songbook(text, torchModel);
        window.current_songbook.run();
        resetSettings();
    } catch(e) {
        $('#error-modal-text pre').text(e.message);
        $('#error-modal').modal();
    }
}

function resetSettings() {
    $("[name='show-edge-labels']").bootstrapSwitch("state", true, true);
}

var examples = ['song_for_diana', 'chaser'];

$(document).ready(function(){
    $("[name='show-edge-labels']").bootstrapSwitch();
    $("[name='show-edge-labels']").on('switchChange.bootstrapSwitch', (event, state) => {
        torchModel.showEdgeLabels(state);
    });
    editorControl.loadSample('song_for_diana', runEditorSongbook);
    $("#run-button").click(function() {
        window.current_songbook.stop();
        runEditorSongbook();
    });
    $("#clear-button").click(function() {
        window.current_songbook.stop();      
        window.current_songbook = Songbook.BLANK_SONGBOOK(torchModel);
        window.current_songbook.run();
        window.editor.setValue("", 1);
    });
    $('#documentation-link').click((e) => { $("#documentation-modal").modal();})
    examples.forEach((example)=> {
        $("#" + example).click((event) => {
            window.current_songbook.stop();
            torchModel.delete();
            editorControl.loadSample(example, runEditorSongbook);
            
        })
    });
    // load the documenation
    $.get({
        url: "build/torch_doc.html",
        success: (resp) => {
            $("#documentation-modal-text").append(resp);
        }
    })
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

