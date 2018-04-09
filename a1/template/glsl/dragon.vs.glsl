// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;
uniform vec3 remotePosition;
varying float dis;
uniform vec3 dragonShift;
uniform int dragonPositionState;
uniform vec3 dragonDeform;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
    dis=distance(modelMatrix*vec4(7.0*position+vec3(0,1,0),1.0),vec4(remotePosition,1.0));
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    if (dragonPositionState==2){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(7.0*position+vec3(0,1,0)+dragonShift, 1.0);
        dis=distance(modelMatrix*vec4(7.0*position+vec3(0,1,0)+dragonShift,1.0),vec4(remotePosition,1.0));
    }
    else if (dragonPositionState==3){
        
        if (dis<=4.0){
            gl_Position=projectionMatrix * modelViewMatrix*(vec4(10.0*position+vec3(0,1,0)+dragonDeform, 1.0));
        }
        else {
            gl_Position=projectionMatrix * modelViewMatrix * vec4(7.0*position+vec3(0,1,0), 1.0);
        }
    }
    else if (dragonPositionState==4){
        if (dis>5.0){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(7.0*position+vec3(0,1,0)+dragonDeform, 1.0);
        }
        else {
             gl_Position=projectionMatrix * modelViewMatrix * vec4(7.0*position+vec3(0,1,0), 1.0);
        }
    }
    else{
        gl_Position=projectionMatrix * modelViewMatrix * vec4(7.0*position+vec3(0,1,0), 1.0);
        
    }
    
}
