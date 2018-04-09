// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader


uniform sampler2D texture1;
varying vec2 texCoord;


void main() {

	// LOOK UP THE COLOR IN THE TEXTURE

    vec4 texColor=texture2D(texture1, texCoord);
  // Set final rendered color according to the surface normal
  gl_FragColor = texColor;
}
