var VSHADER_SOURCE = `
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;

    uniform mat4 u_NormalMatrix;
    attribute vec4 a_Normal;
    varying vec3 v_Normal;

    attribute vec4 a_Position;
    varying vec3 v_Position;

    attribute vec2 a_UV;
    varying vec2 v_UV;

    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Position = vec3(u_ModelMatrix * a_Position);
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
}`;

var FSHADER_SOURCE = `
    precision highp float;
    varying vec2 v_UV;
    varying vec3 v_Normal;

    uniform vec4 u_FragColor;
    uniform vec3 u_LightColor;

    uniform vec3 u_LightPos;
    varying vec3 v_Position;

    uniform vec3 u_CameraPos;
    uniform float u_SpecularExponent;

    uniform int u_RenderingMode;
    uniform int u_LightType;
    uniform float u_SpotlightAngleThreshold;
    uniform float u_SpotlightFalloffExponent;

    void main() {
        vec3 L = normalize(u_LightPos - v_Position);
        vec3 N = normalize(v_Normal);
        vec3 R = normalize(2.0 * dot(L, N) * N - L);
        vec3 V = normalize(u_CameraPos - v_Position);

        vec3 k_d = vec3(0.5, 0.5, 0.5);
        vec3 k_a = vec3(0.25, 0.25, 0.25);
        vec3 k_s = vec3(0.5, 0.5, 0.5);

        if (u_RenderingMode == 0) {
            gl_FragColor = vec4(N, 1.0);
        } else if (u_RenderingMode == 1) {
            gl_FragColor = u_FragColor;
        } else {

            vec3 diffuse = k_d * max(dot(L, N), 0.0) * vec3(u_FragColor);
            vec3 ambient = k_a * (vec3(u_FragColor) + u_LightColor);
            vec3 specular = k_s * pow(max(dot(R, V), 0.0), u_SpecularExponent) * u_LightColor;
            
            vec3 spotDir = vec3(0, -1, 0);
            float angle = dot(-L, spotDir);
            float spotFactor = 0.0;
            if (angle > u_SpotlightAngleThreshold)
                spotFactor = pow(angle, u_SpotlightFalloffExponent);

            if (u_LightType == 1) 
                spotFactor = 1.0;

            gl_FragColor = vec4((diffuse + ambient + specular) * spotFactor, 1.0);
            
            float r = length(u_LightPos - v_Position);
            if (r < 1.0)
                gl_FragColor = vec4(u_LightColor, 1.0);
        }
}`;