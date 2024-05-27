let canvas, gl;
let a_Position;
let a_UV;
let textureID;
let u_FragColor;
let a_Normal;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_NormalMatrix;
let u_LightPos;
let u_CameraPos;
let u_LightColor;
let u_SpecularExponent;
let u_RenderingMode;
let u_LightType;
let u_SpotlightAngleThreshold;
let u_SpotlightFalloffExponent;

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;            
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (!a_UV) {
        console.log('Failed to get storage location of a_UV');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('failed to get storage location of u_ProjectionMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('failed to get storage location of u_ViewMatrix');
        return;
    }

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('failed to get storage location of u_NormalMatrix');
        return;
    }   
    
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (!a_Normal) {
        console.log('Failed to get storage location of a_Normal');
        return;
    }

    u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
    if (!u_LightPos) {
        console.log('failed to get storage location of u_LightPos');
        return;
    }

    u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');
    if (!u_CameraPos) {
        console.log('failed to get storage location of u_CameraPos');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('failed to get storage location of u_FragColor');
        return;
    }

    u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    if (!u_LightColor) {
        console.log('failed to get storage location of u_LightColor');
        return;
    }

    u_SpecularExponent = gl.getUniformLocation(gl.program, 'u_SpecularExponent');
    if (!u_SpecularExponent) {
        console.log('failed to get storage location of u_SpecularExponent');
        return;
    }

    u_RenderingMode = gl.getUniformLocation(gl.program, 'u_RenderingMode');
    if (!u_SpecularExponent) {
        console.log('failed to get storage location of u_RenderingMode');
        return;
    }

    u_LightType = gl.getUniformLocation(gl.program, 'u_LightType');
    if (!u_LightType) {
        console.log('failed to get storage location of u_LightType');
        return;
    }

    u_SpotlightAngleThreshold = gl.getUniformLocation(gl.program, 'u_SpotlightAngleThreshold');
    if (!u_SpotlightAngleThreshold) {
        console.log('failed to get storage location of u_SpotlightAngleThreshold');
        return;
    }

    u_SpotlightFalloffExponent = gl.getUniformLocation(gl.program, 'u_SpotlightFalloffExponent');
    if (!u_SpotlightFalloffExponent) {
        console.log('failed to get storage location of u_SpotlightFalloffExponent');
        return;
    }
}