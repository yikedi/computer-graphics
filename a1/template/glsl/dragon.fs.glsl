// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec3 interpolatedNormal;
varying float dis;
uniform vec3 dragonColor;
uniform int dragonState;
//uniform int rcState;
/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
  // Set final rendered color according to the surface normal
    if (dis<=4.0){
        gl_FragColor=vec4(0.5,0.3,0.8,1);
    }
    else{
        if (dragonState!=1){
            gl_FragColor=vec4(dragonColor,1.0);
        }
        else{
        gl_FragColor=vec4(normalize(interpolatedNormal),1.0);
        }
    }// REPLACE ME
}
