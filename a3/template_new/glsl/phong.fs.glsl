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


uniform vec3 lightDirection2;
uniform vec3 lightColor2;
uniform vec3 spotLightLocation;
uniform vec3 spotLightDirction;
uniform vec3 spotLightColor;
uniform float angle;
uniform int lightState;
uniform vec3 random;

varying vec4 targetPostion;


void main() {
    // COMPUTE LIGHTING HERE
    vec3 lightDirectionN = normalize(lightDirection);
    vec3 lightDirection2N= normalize(lightDirection2);
    
    // per pixel position
    vec3 pointInVCS_f = V_ViewPosition.xyz;
    pointInVCS_f = normalize(-pointInVCS_f);
    
    // per pixel normal
    vec3 normalInVCS = V_Normal_VCS.xyz;
    float x=sin(targetPostion.x);
    float y=cos(targetPostion.y);
    float z=0.4*x+1.3*y;
    vec3 bump=vec3 (x,y,z);
    
    normalInVCS=normalInVCS;
    if (lightState==3){
        normalInVCS=normalInVCS+bump;
    }
    normalInVCS = normalize(normalInVCS);
    
    ;
    
    
    
    vec3 vecter_r = reflect(-lightDirectionN,normalInVCS);
    vecter_r = normalize(vecter_r);
    
    vec3 vecter_r2=reflect(-lightDirection2N,normalInVCS);
    vecter_r2 = normalize(vecter_r2);
    
    vec3 vecter_rS=reflect(-spotLightDirction,normalInVCS);
    vecter_rS=normalize(vecter_rS);
    vec4 V_Color=vec4 (1.0,1.0,1.0,1.0);
    
    vec3 spotLightToTarget=normalize(spotLightLocation-targetPostion.xyz);
    
    if (lightState==2){
        V_Color = vec4((kAmbient * ambientColor*changeColor),1.0);
        V_Color = V_Color + vec4(lightColor * kDiffuse * changeColor * max(dot (normalInVCS, lightDirectionN),0.0),1.0);
        V_Color = V_Color + vec4(lightColor2 * kDiffuse * changeColor * max(dot (normalInVCS, lightDirection2N),0.0),1.0);
        if (dot(spotLightDirction,spotLightToTarget)<angle){
            V_Color=  V_Color+  vec4(spotLightColor* kDiffuse * changeColor * max(dot(normalInVCS,spotLightDirction),0.0),1.0);
            V_Color=  V_Color+  vec4(spotLightColor * kSpecular* pow(max(dot(vecter_rS, pointInVCS_f),0.0), shininess),1.0 );
        }
        V_Color = V_Color + vec4(lightColor * kSpecular * pow(max(dot(vecter_r, pointInVCS_f),0.0), shininess),1.0);
        V_Color = V_Color + vec4(lightColor2 * kSpecular * pow(max(dot(vecter_r2, pointInVCS_f),0.0), shininess),1.0);
        
    }

    else{
    
        V_Color = vec4((kAmbient * ambientColor*changeColor),1.0);
        V_Color = V_Color + vec4(lightColor * kDiffuse * changeColor * max(dot (normalInVCS, lightDirectionN),0.0),1.0);
        V_Color = V_Color + vec4(lightColor * kSpecular * pow(max(dot(vecter_r, pointInVCS_f),0.0), shininess),1.0);
    }
    
   
    gl_FragColor = V_Color;
}
