var mDelta = new Vector3();
var g_camera;

let g_keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false
}

let lTime;
let dTime;
let fps;
var g_startTime = performance.now()/1000.0;
var g_global_seconds = performance.now()/1000.0 - g_startTime;

let lightCube = new Cube();
lightCube.spec = 10;
lightCube.color = [1.0, 0.7, 0.0, 1.0];
lightCube.matrix.setTranslate(0, 5, 0);

var g_current_mode = 1;

var g_LightColor = [1.0, 1.0, 1.0, 1.0];
var g_LightSlider = [];

// var g_SpecularToggle = false;
var g_NormalVisualization = false;
var g_LightingToggle = false;
var g_Spotlight = false;
var g_lightRotation = false;
var g_spotlightAngle = 13;
var g_spotLightFalloff = 40;

let g_sphere;
var g_skybox = [];

function addActionsForHtmlUI() {
    document.getElementById('colorSlider').onchange = function() {
        var l_LightColor = document.getElementById('colorSlider').value;
        g_LightColor[0] = parseInt(l_LightColor.substring(1,3), 16) / 255.0;
        g_LightColor[1] = parseInt(l_LightColor.substring(3,5), 16) / 255.0;
        g_LightColor[2] = parseInt(l_LightColor.substring(5,7), 16) / 255.0;
        g_LightColor[3] = 1.0;
        console.log(g_LightColor);
    }

    g_LightSlider[0] = document.getElementById('lightSliderX');
    g_LightSlider[1] = document.getElementById('lightSliderY');
    g_LightSlider[2] = document.getElementById('lightSliderZ');
    
    // Light switch
    document.getElementById('toggle-lights').onclick = function() {
        var isChecked = document.getElementById("toggle-lights").checked;
        if (isChecked) { // Lights On
            g_LightingToggle = true;
            g_current_mode = 3;
            gl.uniform1i(u_RenderingMode, g_current_mode);
            console.log("Light Toggle = " + isChecked);
        } else { // Lights Off
            g_LightingToggle = false;
            g_current_mode = 1;
            gl.uniform1i(u_RenderingMode, g_current_mode);
            console.log("Light Toggle = " + isChecked);
        }
    }

    // Normal toggle
    document.getElementById('toggle-normal').onclick = function() {
        var isChecked = document.getElementById("toggle-normal").checked;
        if (isChecked) { // Normal On
            g_NormalVisualization = true;
            document.getElementById("toggle-lights").disabled = true;
            gl.uniform1i(u_RenderingMode, 0);
            console.log("Normal Visualization Toggle = " + isChecked);
        } else { // Normal Off
            g_NormalVisualization = false;
            document.getElementById("toggle-lights").disabled = false;
            gl.uniform1i(u_RenderingMode, g_current_mode);
            console.log("Normal Visualization Toggle = " + isChecked);
        }
    }

    // Spotlight toggle
    document.getElementById('toggle-spotlight').onclick = function() {
        var isChecked = document.getElementById("toggle-spotlight").checked;
        if (isChecked) { // Spotlight On
            g_Spotlight = true;
            console.log("Spotlight Toggle = " + isChecked);
        } else { // Spotlight Off
            g_Spotlight = false;
            console.log("Spotlight Toggle = " + isChecked);
        }
    }

    // Light Rotation toggle
    document.getElementById('toggle-rotation').onclick = function() {
        var isChecked = document.getElementById("toggle-rotation").checked;
        if (isChecked) { // Light Rotation On
            g_lightRotation = true;
            console.log("Rotation Toggle = " + isChecked);
        } else { // Light Rotation Off
            g_lightRotation = false;
            console.log("Rotation Toggle = " + isChecked);
        }
    }
    
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function keydown(ev) {
    if (ev.keyCode == 87) { // w
        g_keys.w = true;
    } else if (ev.keyCode == 83) { // s
        g_keys.s = true;
    } else if (ev.keyCode == 65) { // a
        g_keys.a = true;
    } else if (ev.keyCode == 68) { // d
        g_keys.d = true;
    } else if (ev.keyCode == 82) { // q
        g_keys.q = true;
    } else if (ev.keyCode == 70) { // e
        g_keys.e = true;
    }
}

function keyup(ev) {
    if (ev.keyCode == 87) { // w
        g_keys.w = false;
    } else if (ev.keyCode == 83) { // s
        g_keys.s = false;
    } else if (ev.keyCode == 65) { // a
        g_keys.a = false;
    } else if (ev.keyCode == 68) { // d
        g_keys.d = false;
    } else if (ev.keyCode == 82) { // x
        g_keys.q = false;
    } else if (ev.keyCode == 70) { // c
        g_keys.e = false;
    }
}

function rotateView(ev) {
    let x = ev.movementX;
    let y = ev.movementY;

    mDelta = new Vector3([x, y, 1]).normalize();
}

function tick(time) {
    if (document.pointerLockElement === canvas) {
        if (g_keys.w) {
            g_camera.moveForward(35 * dTime);
        } else if (g_keys.s) {
            g_camera.moveBackward(35 * dTime);
        } else if (g_keys.a) {
            g_camera.moveLeft(35 * dTime);
        } else if (g_keys.d) {
            g_camera.moveRight(35 * dTime);
        } else if (g_keys.q) {
            g_camera.moveUp(35 * dTime);
        } else if (g_keys.e) {
            g_camera.moveDown(35 * dTime);
        }
    }

    dTime = (Date.now() - lTime) / 1000;
    lTime = Date.now();

    g_global_seconds = performance.now()/1000.0 - g_startTime;
    var startTime = performance.now();

    renderAllShapes(time);

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1/dTime), "numdot");

    requestAnimationFrame(tick);
}

function renderAllShapes (time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (mDelta && document.pointerLockElement === canvas) {
        //Left and right
        let m = new Matrix4();
        m.setRotate(mDelta.x * -200 * dTime, g_camera.up.x, g_camera.up.y, g_camera.up.z);
        let f = m.multiplyVector3(g_camera.forward).normalize();

        //Up and down
        m.setRotate(mDelta.y * -200 * dTime, g_camera.right.x, g_camera.right.y, g_camera.right.z);
        let g = m.multiplyVector3(g_camera.forward).normalize();

        g_camera.at = g_camera.eye.add(f).add(g);
        g_camera.viewMatrix.setLookAt(g_camera.eye.x, g_camera.eye.y, g_camera.eye.z, g_camera.at.x, g_camera.at.y, g_camera.at.z, g_camera.up.x, g_camera.up.y, g_camera.up.z);
        gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
        g_camera.viewMatrix.setLookAt(g_camera.eye.x, g_camera.eye.y, g_camera.eye.z, g_camera.at.x, g_camera.at.y, g_camera.at.z, g_camera.up.x, g_camera.up.y, g_camera.up.z);
        gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

        mDelta.x = 0;
        mDelta.y = 0;
    } 

    let lightPos;
    if (g_lightRotation) {
        const slowdown = 0.0005;
        const radius = 12;
        lightPos = new Vector3([Math.cos(time * slowdown) * radius, g_LightSlider[1].value, Math.sin(time * slowdown) * radius]);
    } else {
        lightPos = new Vector3([g_LightSlider[0].value, g_LightSlider[1].value, g_LightSlider[2].value]);
    }

    gl.uniform3fv(u_LightPos, new Float32Array(lightPos.elements));
    gl.uniform3fv(u_CameraPos, g_camera.eye.elements);
    if (!g_Spotlight) {
        gl.uniform1i(u_LightType, 1);
    } else {
        gl.uniform1i(u_LightType, 0);
    }
    gl.uniform1f(u_SpotlightAngleThreshold,  1 - (g_spotlightAngle / 100));
    gl.uniform1f(u_SpotlightFalloffExponent, g_spotLightFalloff / 10);

    let lightColor = new Vector3(g_LightColor);
    gl.uniform3fv(u_LightColor, new Float32Array(lightColor.elements)); 
    lightCube.color = g_LightColor; 
    lightCube.matrix.setTranslate(lightPos.x, lightPos.y, lightPos.z);

    renderSkybox();

    lightCube.render();
    g_sphere.render();

    renderWorld();
}

function renderSkybox() {
    g_skybox[0].matrix.setTranslate(0, 35, 0);
    g_skybox[0].matrix.scale(70, 0.2, 70);
    g_skybox[0].matrix.rotate(180, 1, 0, 0);

    g_skybox[1].matrix.setTranslate(0, -35, 0);
    g_skybox[1].matrix.scale(70, 0.2, 70);
    g_skybox[1].matrix.rotate(180, 1, 0, 0);

    g_skybox[2].matrix.setTranslate(35, 0, 0);
    g_skybox[2].matrix.scale(0.2, 70, 70);
    g_skybox[2].matrix.rotate(180, 0, 1, 0);

    g_skybox[3].matrix.setTranslate(-35, 0, 0);
    g_skybox[3].matrix.scale(0.2, 70, 70);
    g_skybox[3].matrix.rotate(180, 0, 1, 0);

    g_skybox[4].matrix.setTranslate(0, 0, 35);
    g_skybox[4].matrix.scale(70, 70, 0.2);

    g_skybox[5].matrix.setTranslate(0, 0, -35);
    g_skybox[5].matrix.scale(70, 70, 0.2);

    for (let i = 0; i <= 5; i++) {
        g_skybox[i].render();
    }
}

function main() {
    // Set up canvas and gl variables
    setupWebGL();

    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    g_camera = new Camera();

    addActionsForHtmlUI();
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1.0);


    document.addEventListener('keydown', function(ev) {keydown(ev)});
    document.addEventListener('keyup', function(ev) {keyup(ev)});

    document.addEventListener('mousemove', function(ev) {rotateView(ev)});

    canvas.addEventListener('mousedown', function() {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
    });

    g_sphere = new Sphere();
    g_sphere.matrix.setTranslate(0, 5, 0);
    g_sphere.color = [1.0, 0, 1.0, 1.0];

    drawMap();

    for (let i = 0; i <= 5; i++){
        g_skybox[i] = new Cube();
        g_skybox[i].spec = 9999999999;
    }

    gl.uniform1i(u_RenderingMode, g_current_mode);
    tick();
}

