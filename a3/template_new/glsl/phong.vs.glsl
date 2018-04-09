varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;
uniform vec3 spotLightLocation;
varying vec4 spotLightToTarget;
varying vec4 targetPostion;

void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
     V_ViewPosition = modelViewMatrix * vec4(position, 1.0);
     V_Normal_VCS = vec4(normalMatrix * normal,1.0);
     targetPostion=vec4(position,1.0);
    
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}
