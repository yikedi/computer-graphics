varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;
varying vec2 texCoord;
void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
	V_Normal_VCS = vec4(normalMatrix*normal, 1.0);
	V_ViewPosition = modelViewMatrix*vec4(position,1.0);
    texCoord=uv;
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}
