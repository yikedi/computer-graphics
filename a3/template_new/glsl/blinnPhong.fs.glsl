
varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;

uniform vec3 changeColor;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightDirection;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform sampler2D texture1;
varying vec2 texCoord;


void main() {

	// COMPUTE LIGHTING HERE
    vec3 lightDirectionN = normalize(lightDirection);
    
    vec3 pointInVCS_f = V_ViewPosition.xyz;
    pointInVCS_f = normalize(-pointInVCS_f);
    
    vec4 texColor=texture2D(texture1,texCoord);
    vec3 bumpNormal=(2.0*texColor-1.0).xyz;
    
    vec3 normalInVCS = V_Normal_VCS.xyz;
    normalInVCS=normalInVCS+bumpNormal;
    normalInVCS = normalize(normalInVCS);
    
    vec3 vec_R = reflect(-lightDirectionN,normalInVCS);
    vec_R = normalize(vec_R);
    
    vec3 vec_H=normalize((lightDirectionN+pointInVCS_f)*0.5);
    
    vec4 V_Color = vec4((kAmbient * ambientColor * changeColor ),1.0);
    V_Color = V_Color + vec4(lightColor * kDiffuse * changeColor * max(dot (normalInVCS, lightDirectionN),0.0),1.0);
    V_Color=V_Color+vec4(lightColor * kSpecular * pow(max(dot(vec_H, normalInVCS),0.0), shininess),1.0);
	gl_FragColor = V_Color;
}
