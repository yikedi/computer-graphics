// The uniform variable is set up in the javascript code and the same for all vertices

uniform vec3 remotePosition;
varying vec3 ballPosition;

void main() {
	/* HINT: WORK WITH remotePosition HERE! */
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position


    gl_Position = projectionMatrix *viewMatrix* (modelMatrix * vec4(position, 1.0)+vec4(remotePosition,0.0));
}
