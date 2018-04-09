varying vec4 V_Color;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightDirection;
uniform vec3 changeColor;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;



void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE
	
	//V_Color = vec4(1.0, 0.0, 0.0, 1.0);

    vec4 pointInVCS = modelViewMatrix * vec4(position, 1.0);
    vec3 normalInVCS = normalMatrix * normal;
    
    pointInVCS=normalize(-pointInVCS);
    normalInVCS=normalize(normalInVCS);
    vec3 lightDirectionN=normalize(lightDirection);
	// Position
    V_Color=vec4(kAmbient*ambientColor*changeColor,1.0);
    V_Color=V_Color+vec4(lightColor*kDiffuse*changeColor*dot(normalInVCS,lightDirectionN),1.0);
    V_Color=V_Color+vec4(lightColor*kSpecular*pow(max(dot(pointInVCS,vec4(reflect(-lightDirectionN,normalInVCS),1.0)),0.0),shininess),1.0);
    //V_Color=V_Color+vec4(lightColor*kSpecular*dot(pointInVCS,vec4(reflect(-lightDirectionN,normalInVCS),1.0)),1.0);
    
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
    
}
