/**
 * UBC CPSC 314 (2016_W1)
 * Assignment 3
 */

// CREATE SCENE
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(25.0,(window.innerWidth/window.innerHeight), 0.1, 10000);
camera.position.set(0.0,15.0,40.0);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4,4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(30.0, 30.0), floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

//ROCKS TEXTURE 
var rocksTexture =  new THREE.ImageUtils.loadTexture('images/lava-texture.jpg');
var bumptexture =  new THREE.ImageUtils.loadTexture('images/stone_wall_normal_map.bmp');

//LIGHTING PROPERTIES
var lightColor = {type: "c", value: new THREE.Color(1.0,1.0,1.0)};
var ambientColor = {type: "c", value: new THREE.Color(0.4,0.4,0.4)};
var lightDirection = {type: "v3", value: new THREE.Vector3(0.49,0.79,0.49)};
var changeColor={type: "c", value: new THREE.Color(1.0,1.0,1.0)};

var lightDirection2={type: "v3", value: new THREE.Vector3(0.0,1.0,0.0)};
var spotLightLocation={type: "v3", value: new THREE.Vector3(0.0,1.0,0.0)};
var spotLightDirction={type: "v3", value: new THREE.Vector3(0.0,1.0,0.0)};
var angle={type: "f", value: 0.5};
var lightState = {type: 'i', value: 1};
var lightColor2 = {type: "c", value: new THREE.Color(0.0,1.0,0.0)};
var spotLightColor={type: "c", value: new THREE.Color(1.0,0.0,0.0)};

//MATERIAL PROPERTIES 
var kAmbient = {type: "f", value: 0.4 };
var kDiffuse = {type: "f", value: 0.8 };
var kSpecular = {type: "f", value: 0.8 };
var shininess = {type: "f", value: 10.0 };

// SHADER MATERIALS (Remember to change this, in order to use uniform variables.)
var gouraudMaterial = new THREE.ShaderMaterial({
uniforms: {
                                               lightColor: lightColor,
                                               ambientColor: ambientColor,
                                               lightDirection: lightDirection,
                                               kAmbient: kAmbient,
                                               kDiffuse: kDiffuse,
                                               kSpecular: kSpecular,
                                               shininess: shininess,
                                               changeColor: changeColor,
                                               
                                               
                                               lightDirection2: lightDirection2,
                                               spotLightLocation: spotLightLocation,
                                               spotLightDirction: spotLightDirction,
                                               angle: angle,
                                               lightState: lightState,
                                               
                                               },


});
var phongMaterial = new THREE.ShaderMaterial({

                                             uniforms: {
                                             lightColor: lightColor,
                                             ambientColor: ambientColor,
                                             lightDirection: lightDirection,
                                             kAmbient: kAmbient,
                                             kDiffuse: kDiffuse,
                                             kSpecular: kSpecular,
                                             shininess: shininess,
                                             changeColor: changeColor,
                                             
                                             lightDirection2: lightDirection2,
                                             lightColor2: lightColor2,
                                             spotLightLocation: spotLightLocation,
                                             spotLightDirction: spotLightDirction,
                                             spotLightColor: spotLightColor,
                                             angle: angle,
                                             lightState: lightState,
                                             
                                             },
                                             
                                             
                                             });
var blinnPhongMaterial = new THREE.ShaderMaterial(
                                                  {
                                                  
                                                  uniforms: {
                                                  lightColor: lightColor,
                                                  ambientColor: ambientColor,
                                                  lightDirection: lightDirection,
                                                  kAmbient: kAmbient,
                                                  kDiffuse: kDiffuse,
                                                  kSpecular: kSpecular,
                                                  shininess: shininess,
                                                  changeColor: changeColor,
                                                  
                                                  texture1: { type: "t", value: bumptexture }
                                                  },
                                                  
                                                  
                                                  });
var textureMaterial = new THREE.ShaderMaterial({
                                               
                                               uniforms:{
 texture1: { type: "t", value: rocksTexture }
                                               
                                               },
                                               
                                               


});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gouraud.fs.glsl','glsl/gouraud.vs.glsl',
  'glsl/phong.vs.glsl','glsl/phong.fs.glsl',
  'glsl/blinnPhong.vs.glsl','glsl/blinnPhong.fs.glsl',
  'glsl/texture.fs.glsl','glsl/texture.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
 gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
 gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
 phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
 phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
 blinnPhongMaterial.vertexShader = shaders['glsl/blinnPhong.vs.glsl'];
 blinnPhongMaterial.fragmentShader = shaders['glsl/blinnPhong.fs.glsl'];
 textureMaterial.fragmentShader = shaders['glsl/texture.fs.glsl'];
 textureMaterial.vertexShader = shaders['glsl/texture.vs.glsl'];
})

// CREATE SPHERES
var sphereRadius = 2.0;
var sphere = new THREE.SphereGeometry(sphereRadius, 16, 16);

var gouraudSphere = new THREE.Mesh(sphere, gouraudMaterial); 
gouraudSphere.position.set(-7.5, sphereRadius, 0);
scene.add(gouraudSphere);

var phongSphere = new THREE.Mesh(sphere, phongMaterial); 
phongSphere.position.set(-2.5, sphereRadius, 0);
scene.add(phongSphere);

var blinnPhongSphere = new THREE.Mesh(sphere, blinnPhongMaterial); 
blinnPhongSphere.position.set(2.5, sphereRadius, 0);
scene.add(blinnPhongSphere);

var textureSphere = new THREE.Mesh(sphere, textureMaterial); 
textureSphere.position.set(7.5, sphereRadius, 0);
scene.add(textureSphere);

var keyboard = new THREEx.KeyboardState();
function checkKeyBoard(){
    if (keyboard.pressed("l")){
        lightColor.value.r=Math.random();
        lightColor.value.g=Math.random();
        lightColor.value.b=1.0;
    }
    if (keyboard.pressed("m")){
        changeColor.value.r=Math.random();
        changeColor.value.g=Math.random();
        changeColor.value.b=Math.random();
    }
    if (keyboard.pressed("b")){
        lightColor.value.r=1.0;
        lightColor.value.g=1.0;
        lightColor.value.b=1.0;
        
        changeColor.value.r=1.0;
        changeColor.value.g=1.0;
        changeColor.value.b=1.0;
        
        angle.value=0.5;
        
    }
    
    if (keyboard.pressed("a")){
        angle.value=angle.value-0.005;
    }
    if (keyboard.pressed("x")){
        lightDirection2.value.x=lightDirection2.value.x+0.1;
        spotLightLocation.value.x=spotLightLocation.value.x+0.1;
    }
  
    for (var i=1; i<4; i++)
    {
        if (keyboard.pressed(i.toString()))
        {
            lightState.value = i;
            break;
        }
    }
    
}

// SETUP UPDATE CALL-BACK
var render = function() {
    checkKeyBoard();
	textureMaterial.needsUpdate = true;
	phongMaterial.needsUpdate = true;
	blinnPhongMaterial.needsUpdate = true;
	gouraudMaterial.needsUpdate = true;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
