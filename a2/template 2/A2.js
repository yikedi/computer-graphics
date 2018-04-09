/*
 * UBC CPSC 314 (2016_W1)
 * Assignment 2
 */


// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
    this.matrix=a;
    this.matrix.decompose(this.position,this.quaternion,this.scale);
}


// SETUP RENDERER AND SCENE
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);


// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(-28,10,28);
camera.lookAt(scene.position);
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


// FLOOR WITH CHECKERBOARD
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0;
floor.rotation.x = Math.PI / 2;
scene.add(floor);




// MATERIALS
var normalMaterial = new THREE.MeshNormalMaterial();

// OCTOPUS MATERIAL
//You must change this matrix in updateBody() if you want to animate the octopus head.
var octopusMatrix = {type: 'm4', value: new THREE.Matrix4().set(
                                                                1.0,0.0,0.0,0.0,
                                                                0.0,1.0,0.0,3.0,
                                                                0.0,0.0,1.0,0.0,
                                                                0.0,0.0,0.0,1.0
                                                                )};
var octopusMaterial = new THREE.ShaderMaterial({
                                               uniforms:{
                                               octopusMatrix: octopusMatrix,
                                               },
                                               });

var shaderFiles = [
                   'glsl/octopus.vs.glsl',
                   'glsl/octopus.fs.glsl'
                   ];
new THREE.SourceLoader().load(shaderFiles, function(shaders) {
                              octopusMaterial.vertexShader = shaders['glsl/octopus.vs.glsl'];
                              octopusMaterial.fragmentShader = shaders['glsl/octopus.fs.glsl'];
                              })


// GEOMETRY

//Here we load the octopus geometry from a .obj file, just like the dragon
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var onProgress = function(query) {
        if ( query.lengthComputable ) {
            var percentComplete = query.loaded / query.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    
    var onError = function() {
        console.log('Failed to load ' + file);
    };
    
    var loader = new THREE.OBJLoader();
    loader.load(file, function(object) {
                object.traverse(function(child) {
                                if (child instanceof THREE.Mesh) {
                                child.material = material;
                                }
                                });
                object.position.set(xOff,yOff,zOff);
                object.rotation.x= xRot;
                object.rotation.y = yRot;
                object.rotation.z = zRot;
                object.scale.set(scale,scale,scale);
                scene.add(object);
                scene.add(object);4
                }, onProgress, onError);
    
}

//We keep the octopus at (0,0,0) and without any offset or scale factor, so we can change these values with transformation matrices.
loadOBJ('obj/Octopus_08_A.obj',octopusMaterial,1.0,0,0,0,0,0,0);

//Eyes

//We create a sphereGeometry for the eyes and the pupils
var eyeGeometry = new THREE.SphereGeometry(1.0,64,64);

var eye_R = new THREE.Mesh(eyeGeometry,normalMaterial);
//This Matrix for the right eye includes translation and scale
var eyeTSMatrix_R = new THREE.Matrix4().set(
                                            0.5,0.0,0.0,-0.2,
                                            0.0,0.5,0.0,4.1,
                                            0.0,0.0,0.5,-0.92,
                                            0.0,0.0,0.0,1.0
                                            );
//Here we relate the eye with the octopus by multiplying their matrices
var octopusEye_RMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_R); //? why it is octopusMatrix.value and eyeTSmatrix_R(without value)?
eye_R.setMatrix(octopusEye_RMatrix);
scene.add(eye_R);
//Right eye pupil translation and scale matrix
var pupilMatrix_R = new THREE.Matrix4().set(
                                            0.35,0.0,0.0,0.0,
                                            0.0,0.35,0.0,0.0,
                                            0.0,0.0,0.15,-0.9,
                                            0.0,0.0,0.0,1.0
                                            );
var cosTheta = Math.cos(Math.PI * (-50 /180.0));
var sinTheta = Math.sin(Math.PI * (-50 /180.0));
//This is a rotation matrix for the right pupil
var pupilRotMatrix_R = new THREE.Matrix4().set(
                                               cosTheta,0.0,-sinTheta,0.0,
                                               0.0,1.0,0.0,0.0,
                                               sinTheta,0.0,cosTheta,0.0,
                                               0.0,0.0,0.0,1.0
                                               );
var pupilTSRMatrix_R = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_R, pupilMatrix_R);
var eyePupilMatrix_R = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R);
var pupil_R = new THREE.Mesh(eyeGeometry,normalMaterial);
pupil_R.setMatrix(eyePupilMatrix_R);
scene.add(pupil_R);

var eye_L = new THREE.Mesh(eyeGeometry,normalMaterial);
//Left eye translation and scale matrix
var eyeTSMatrix_L = new THREE.Matrix4().set(
                                            0.5,0.0,0.0,-0.2,
                                            0.0,0.5,0.0,4.1,
                                            0.0,0.0,0.5,0.92,
                                            0.0,0.0,0.0,1.0
                                            );
var octopusEye_LMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_L);
eye_L.setMatrix(octopusEye_LMatrix);
scene.add(eye_L);
//Left eye pupil translation and scale matrix
var pupilMatrix_L = new THREE.Matrix4().set(
                                            0.35,0.0,0.0,0.0,
                                            0.0,0.35,0.0,0.0,
                                            0.0,0.0,0.15,-0.9,
                                            0.0,0.0,0.0,1.0
                                            );
cosTheta = Math.cos(Math.PI * (-130 /180.0));
sinTheta = Math.sin(Math.PI * (-130 /180.0));
var pupilRotMatrix_L = new THREE.Matrix4().set(
                                               cosTheta,0.0,-sinTheta,0.0,
                                               0.0,1.0,0.0,0.0,
                                               sinTheta,0.0,cosTheta,0.0,
                                               0.0,0.0,0.0,1.0
                                               );
var pupilTSRMatrix_L = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_L, pupilMatrix_L);
var eyePupilMatrix_L = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L);
var pupil_L = new THREE.Mesh(eyeGeometry,normalMaterial);
pupil_L.setMatrix(eyePupilMatrix_L);
scene.add(pupil_L);


//Tentacle socket
//This point indicates the position for the first tentacle socket, you must figure out the other positions, (you get extra points if it is algorithmically)
var tentacleSocketMatrix = new THREE.Matrix4().set(
                                                   1.0,0.0,0.0,-2.4,
                                                   0.0,1.0,0.0,-0.35,
                                                   0.0,0.0,1.0,2.4,
                                                   0.0,0.0,0.0,1.0
                                                   );

cos22=Math.cos(Math.PI * (-22.5 /180.0));
sin22=Math.sin(Math.PI * (-22.5 /180.0));

var rotateY22Matrix=new THREE.Matrix4().set(
                                            cos22,0.0,-sin22,0.0,
                                            0.0,1.0,0.0,0.0,
                                            sin22,0.0,cos22,0.0,
                                            0.0,0.0,0.0,1.0
                                            );

tentacleSocketMatrix=new THREE.Matrix4().multiplyMatrices(tentacleSocketMatrix, rotateY22Matrix);
var octopusSocketMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, tentacleSocketMatrix);
var tentacleSocketGeometry = new THREE.Geometry();
tentacleSocketGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
var tentacleSocketMaterial = new THREE.PointCloudMaterial( { size: 10, sizeAttenuation: false, color:0xff0000} );
var tentacleSocket = new THREE.PointCloud( tentacleSocketGeometry, tentacleSocketMaterial );
tentacleSocket.setMatrix(octopusSocketMatrix);
//scene.add(tentacleSocket);

//create tentacles and add them to the scene here (at least two cylinders per tentacle):


//Example of tentacle's links


var rotateY90Matrix=new THREE.Matrix4().set(
                                            0.0,0.0,-1.0,0.0,
                                            0.0,1.0,0.0,0.0,
                                            1.0,0.0,0.0,0.0,
                                            0.0,0.0,0.0,1.0
                                            );

var rotateZ90Matrix=new THREE.Matrix4().set(
                                            0.0,-1.0,0.0,0.0,
                                            1.0,0.0,0.0,0.0,
                                            0.0,0.0,1.0,0.0,
                                            0.0,0.0,0.0,1.0
                                            );

cos45=Math.cos(Math.PI * (-45 /180.0));
sin45=Math.sin(Math.PI * (-45 /180.0));

var rotateY45Matrix=new THREE.Matrix4().set(
                                            cos45,0.0,-sin45,0.0,
                                            0.0,1.0,0.0,0.0,
                                            sin45,0.0,cos45,0.0,
                                            0.0,0.0,0.0,1.0
                                            );

var rotateZ45Matrix=new THREE.Matrix4().set(
                                            cos45,-sin45,0.0,0.0,
                                            sin45,cos45,0.0,0.0,
                                            0.0,0.0,1.0,0.0,
                                            0.0,0.0,0.0,1.0
                                            );



var tentacle01G = new THREE.CylinderGeometry(0.35,0.45,3,64);
var tentacle01Matrix = new THREE.Matrix4().set(
                                               1.0,0.0,0.0,0.0,
                                               0.0,1.0,0.0,1.5,
                                               0.0,0.0,1.0,0.0,
                                               0.0,0.0,0.0,1.0
                                               );



var tentacle01List=[];
var tentacle02List=[];
var tentacle03List=[];

var socket1List=[];
var socket2List=[];
var socket3List=[];

var tentacle01SocketList=[];
var tentacle02SocketList=[];
var tentacle03SocketList=[];

var tentacle01SList=[];
var tentacle02SList=[];
var tentacle03SList=[];


var tentacle01FList=[];
var tentacle02FList=[];
var tentacle03FList=[];

var tentacle01Position=[];
var tentacle02Position=[];
var tentacle03Position=[];





for (i=0; i<8;i++){
    
    
    var tentacleSocketMatrix = new THREE.Matrix4().set(
                                                       1.0,0.0,0.0,-2.4,
                                                       0.0,1.0,0.0,-0.35,
                                                       0.0,0.0,1.0,2.4,
                                                       0.0,0.0,0.0,1.0
                                                       );
    
    
    cos22=Math.cos(Math.PI * (-22.5 /180.0));
    sin22=Math.sin(Math.PI * (-22.5 /180.0));
    
    var rotateY22Matrix=new THREE.Matrix4().set(
                                                cos22,0.0,-sin22,0.0,
                                                0.0,1.0,0.0,0.0,
                                                sin22,0.0,cos22,0.0,
                                                0.0,0.0,0.0,1.0
                                                );
    
    tentacleSocketMatrix=new THREE.Matrix4().multiplyMatrices(rotateY22Matrix, tentacleSocketMatrix);
    
    
    cosA=Math.cos(Math.PI * (45.0*i /180.0));
    sinA=Math.sin(Math.PI * (45.0*i /180.0));
    
    var rotateYMatrix=new THREE.Matrix4().set(
                                              cosA,0.0,-sinA,0.0,
                                              0.0,1.0,0.0,0.0,
                                              sinA,0.0,cosA,0.0,
                                              0.0,0.0,0.0,1.0
                                              );
    
    
    tentacleSocketMatrix=new THREE.Matrix4().multiplyMatrices(rotateYMatrix, tentacleSocketMatrix);
    
    
    var octopusSocketMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, tentacleSocketMatrix);
    var tentacleSocketGeometry = new THREE.Geometry();
    tentacleSocketGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    var tentacleSocketMaterial = new THREE.PointCloudMaterial( { size: 10, sizeAttenuation: false, color:0xff0000} );
    var tentacleSocket = new THREE.PointCloud( tentacleSocketGeometry, tentacleSocketMaterial );
    tentacleSocket.setMatrix(octopusSocketMatrix);
    
    
    
    //scene.add(tentacleSocket);
    tentacle01SList.push(tentacleSocketMatrix);
    
    
    
    var tentacle01G = new THREE.CylinderGeometry(0.35,0.45,3,64);
    var tentacle01SMatrix = new THREE.Matrix4().set(
                                                    1.0,0.0,0.0,0.0,
                                                    0.0,1.0,0.0,1.5,
                                                    0.0,0.0,1.0,0.0,
                                                    0.0,0.0,0.0,1.0
                                                    );
    
    var invShift=new THREE.Matrix4().set(
                                         1.0,0.0,0.0,0.0,
                                         0.0,1.0,0.0,-1.5,
                                         0.0,0.0,1.0,0.0,
                                         0.0,0.0,0.0,1.0
                                         );
    
    
    
    
    
    var tentacle01 = new THREE.Mesh(tentacle01G,normalMaterial);
    tentacle01.setMatrix(tentacle01Matrix);
    
    var rotateMatrix=new THREE.Matrix4().multiplyMatrices(rotateY45Matrix,rotateZ90Matrix);
    
    var f1=new THREE.Matrix4().multiplyMatrices(rotateMatrix,tentacle01SMatrix);
    
    var tentacle01Matrix=new THREE.Matrix4().multiplyMatrices(octopusSocketMatrix,f1);
    
    tentacle01.setMatrix(tentacle01Matrix);
    
    
    var socketGeometry = new THREE.SphereGeometry(0.5,64,64);
    var socket = new THREE.Mesh(socketGeometry,normalMaterial);
    socket.setMatrix(octopusSocketMatrix);
    scene.add(socket);
    scene.add(tentacle01);
    
    tentacle01List.push(tentacle01);
    tentacle01FList.push(f1);
    tentacle01SocketList.push(octopusSocketMatrix);
    tentacle01Position.push(tentacle01Matrix);
    socket1List.push(socket);
    
    
    
    var tentacle02G = new THREE.CylinderGeometry(0.15,0.30,3,64);
    var tentacle02SMatrix = new THREE.Matrix4().set(
                                                    1.0,0.0,0.0,0.0,
                                                    0.0,1.0,0.0,3.0,
                                                    0.0,0.0,1.0,0.0,
                                                    0.0,0.0,0.0,1.0
                                                    );
    
    var shiftCentreMatrix=new THREE.Matrix4().set(
                                                  1.0,0.0,0.0,0.0,
                                                  0.0,1.0,0.0,1.5,
                                                  0.0,0.0,1.0,0.0,
                                                  0.0,0.0,0.0,1.0
                                                  );
    
    
    var tentacle02 = new THREE.Mesh(tentacle02G,normalMaterial);
    
    var tentacleSocket2Matrix=new THREE.Matrix4().multiplyMatrices(tentacle01Matrix,shiftCentreMatrix);
    
    var f2=new THREE.Matrix4().multiplyMatrices(rotateZ45Matrix,shiftCentreMatrix);
    var tentacle02Matrix=new THREE.Matrix4().multiplyMatrices(tentacleSocket2Matrix,f2);
    tentacle02.setMatrix(tentacle02Matrix);
    
    var socketGeometry = new THREE.SphereGeometry(0.4,64,64);
    var socket = new THREE.Mesh(socketGeometry,normalMaterial);
    socket.setMatrix(tentacleSocket2Matrix);
    scene.add(socket);
    socket2List.push(socket);
    
    scene.add(tentacle02);
    tentacle02SList.push(shiftCentreMatrix);
    tentacle02List.push(tentacle02);
    tentacle02SocketList.push(tentacleSocket2Matrix);
    tentacle02Position.push(tentacle02Matrix);
    tentacle02FList.push(f2);
    
    
    
    var tentacle03G=new THREE.CylinderGeometry(0.1,0.15,2,64);
    var tentacle03SMatrix = new THREE.Matrix4().set(
                                                    1.0,0.0,0.0,0.0,
                                                    0.0,1.0,0.0,3.0,
                                                    0.0,0.0,1.0,0.0,
                                                    0.0,0.0,0.0,1.0
                                                    );
    
    var tentacle03 = new THREE.Mesh(tentacle03G,normalMaterial);
    
    var tentacleSocket3Matrix=new THREE.Matrix4().multiplyMatrices(tentacle02Matrix,shiftCentreMatrix);
    tentacle03SList.push(shiftCentreMatrix);
    
    shiftCentreMatrix=new THREE.Matrix4().set(
                                              1.0,0.0,0.0,0.0,
                                              0.0,1.0,0.0,1.0,
                                              0.0,0.0,1.0,0.0,
                                              0.0,0.0,0.0,1.0
                                              );
    
    
    cos30=Math.cos(Math.PI * (-30 /180.0));
    sin30=Math.sin(Math.PI * (-30 /180.0));
    
    var rotateZ30Matrix=new THREE.Matrix4().set(
                                                cos30,-sin30,0.0,0.0,
                                                sin30,cos30,0.0,0.0,
                                                0.0,0.0,1.0,0.0,
                                                0.0,0.0,0.0,1.0
                                                );
    
    var f3=new THREE.Matrix4().multiplyMatrices(rotateZ30Matrix,shiftCentreMatrix);
    var tentacle03Matrix=new THREE.Matrix4().multiplyMatrices(tentacleSocket3Matrix,f3);
    
    tentacle03.setMatrix(tentacle03Matrix);
    
    var socketGeometry = new THREE.SphereGeometry(0.2,64,64);
    var socket = new THREE.Mesh(socketGeometry,normalMaterial);
    socket.setMatrix(tentacleSocket3Matrix);
    scene.add(socket);
    socket3List.push(socket);
    
    
    scene.add(tentacle03);
    
    tentacle03List.push(tentacle03);
    tentacle03SocketList.push(tentacleSocket3Matrix);
    tentacle03Position.push(tentacle03Matrix);
    tentacle03FList.push(f3);
    
}


function resetOctopus(){
    var original=new THREE.Matrix4().set(
                                         1.0,0.0,0.0,0.0,
                                         0.0,1.0,0.0,3.0,
                                         0.0,0.0,1.0,0.0,
                                         0.0,0.0,0.0,1.0
                                         )
    
    octopusMatrix.value=original;
    octopusEye_RMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_R);
    eye_R.setMatrix(octopusEye_RMatrix);
    
    octopusEye_LMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_L);
    eye_L.setMatrix(octopusEye_LMatrix);
    
    eyePupilMatrix_R = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R);
    pupil_R.setMatrix(eyePupilMatrix_R);
    
    eyePupilMatrix_L = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L);
    pupil_L.setMatrix(eyePupilMatrix_L);
    
    for(i=0;i<8;i++){
        tentacle01List[i].setMatrix(tentacle01Position[i]);
        tentacle02List[i].setMatrix(tentacle02Position[i]);
        tentacle03List[i].setMatrix(tentacle03Position[i]);
        socket1List[i].setMatrix(tentacle01SocketList[i]);
        socket2List[i].setMatrix(tentacle02SocketList[i]);
        socket3List[i].setMatrix(tentacle03SocketList[i]);
    }
}


var rOctopus=new THREE.Matrix4().multiplyMatrices(octopusMatrix.value,rotateY45Matrix);
//APPLY DIFFERENT EFFECTS TO DIFFERNET CHANNELS

var clock = new THREE.Clock(true);
function updateBody() {
    
    switch(channel)
    {
            //add poses here:
        case 0:
            
            
            break;
            
        case 1:
        {
            var t = clock.getElapsedTime();
            var shift=Math.sin(t);
            
            var cosTheta = Math.cos(Math.PI * 30.0 *shift /180.0);
            var sinTheta = Math.sin(Math.PI * 30.0 *shift /180.0);
            var pupilRotMatrix_R2 = new THREE.Matrix4().set(
                                                            cosTheta,0.0,-sinTheta,0.0,
                                                            0.0,1.0,0.0,0.0,
                                                            sinTheta,0.0,cosTheta,0.0,
                                                            0.0,0.0,0.0,1.0
                                                            );
            var pupilTSRMatrix_R2 = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_R2, pupilMatrix_R);
            var eyePupilMatrix_R2 = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R2);
            pupil_R.setMatrix(eyePupilMatrix_R2);
            
            
            var cosTheta = Math.cos(Math.PI * (30.0 *shift-160.0) /180.0);
            var sinTheta = Math.sin(Math.PI * (30.0 *shift-160.0) /180.0);
            
            var pupilRotMatrix_L2 = new THREE.Matrix4().set(
                                                            cosTheta,0.0,-sinTheta,0.0,
                                                            0.0,1.0,0.0,0.0,
                                                            sinTheta,0.0,cosTheta,0.0,
                                                            0.0,0.0,0.0,1.0
                                                            );
            var pupilTSRMatrix_L2 = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_L2, pupilMatrix_L);
            var eyePupilMatrix_L2 = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L2);
            pupil_L.setMatrix(eyePupilMatrix_L2);
        }
            break;
            
        case 2:
            
            resetOctopus();
            
            break;
            
            //animation
        case 3:
        {
            var t = clock.getElapsedTime();
            
            //animate octopus here:
            
            var shift=Math.sin(t);
            var upward=new THREE.Matrix4().set(
                                               1.0,0.0,0.0,0.0,
                                               0.0,1.0,0.0,shift/50,
                                               0.0,0.0,1.0,0.0,
                                               0.0,0.0,0.0,1.0
                                               );
            
            octopusMatrix.value=new THREE.Matrix4().multiplyMatrices(octopusMatrix.value,upward);
            
            octopusEye_RMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_R);
            eye_R.setMatrix(octopusEye_RMatrix);
            
            octopusEye_LMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_L);
            eye_L.setMatrix(octopusEye_LMatrix);
            
            eyePupilMatrix_R = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R);
            pupil_R.setMatrix(eyePupilMatrix_R);
            
            eyePupilMatrix_L = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L);
            pupil_L.setMatrix(eyePupilMatrix_L);
            
            
            
            var cosM=Math.cos(Math.PI*60*shift/180.0);
            var sinM=Math.sin(Math.PI*60*shift/180.0);
            
            var invShift=new THREE.Matrix4().set(
                                                 1.0,0.0,0.0,0.0,
                                                 0.0,1.0,0.0,-1.5,
                                                 0.0,0.0,1.0,0.0,
                                                 0.0,0.0,0.0,1.0
                                                 );
            
            var tMove=new THREE.Matrix4().set(
                                              cosM,-sinM,0.0,0.0,
                                              sinM,cosM,0.0,0.0,
                                              0.0,0.0,1.0,0.0,
                                              0.0,0.0,0.0,1.0
                                              );
            
            for (i=0;i<8;i++){
                
                var newS1=new THREE.Matrix4().multiplyMatrices(octopusMatrix.value,tentacle01SList[i]);
                
                socket1List[i].setMatrix(newS1);
                
                var temp=new THREE.Matrix4().multiplyMatrices(tentacle01FList[i],invShift);
                temp=new THREE.Matrix4().multiplyMatrices(temp,tMove);
                temp=new THREE.Matrix4().multiplyMatrices(temp,tentacle01SMatrix);
               
                var newF1=new THREE.Matrix4().multiplyMatrices(newS1,temp);
                
                tentacle01List[i].setMatrix(newF1);
                
                var newS2=new THREE.Matrix4().multiplyMatrices(newF1,tentacle02SList[i]);
                socket2List[i].setMatrix(newS2);
                temp=new THREE.Matrix4().multiplyMatrices(tMove,tentacle02FList[i]);
                var newF2=new THREE.Matrix4().multiplyMatrices(newS2,temp);
                
                tentacle02List[i].setMatrix(newF2);
             
                
                var newS3=new THREE.Matrix4().multiplyMatrices(newF2,tentacle03SList[i]);
                socket3List[i].setMatrix(newS3);
                temp=new THREE.Matrix4().multiplyMatrices(tMove,tentacle03FList[i]);
                var newF3=new THREE.Matrix4().multiplyMatrices(newS3,temp);
                tentacle03List[i].setMatrix(newF3);
         
            }
            
        }
            
            break;
            
            
        case 4:{
            var t = clock.getElapsedTime();
            var shift=Math.sin(t);
            var cosM=Math.cos(Math.random()*2*shift);
            var sinM=Math.sin(Math.random()*2*shift);
            
            var rMove= new THREE.Matrix4().set(
                                                 cosM,0.0,-sinM,0.0,
                                                 0.0,1.0,0.0,0.0,
                                                 sinM,0.0,cosM,0.0,
                                                 0.0,0.0,0.0,1.0
                                                 );

            
            for (i=0;i<8;i++){
                
                var temp=new THREE.Matrix4().multiplyMatrices(rMove,tentacle01FList[i]);
                var newF1=new THREE.Matrix4().multiplyMatrices(tentacle01SocketList[i],temp);
                
                tentacle01List[i].setMatrix(newF1);
                
                var newS2=new THREE.Matrix4().multiplyMatrices(newF1,tentacle02SList[i]);
                socket2List[i].setMatrix(newS2);
                temp=new THREE.Matrix4().multiplyMatrices(rMove,tentacle02FList[i]);
                var newF2=new THREE.Matrix4().multiplyMatrices(newS2,temp);
                
                tentacle02List[i].setMatrix(newF2);
                
                
                var newS3=new THREE.Matrix4().multiplyMatrices(newF2,tentacle03SList[i]);
                socket3List[i].setMatrix(newS3);
                temp=new THREE.Matrix4().multiplyMatrices(rMove,tentacle03FList[i]);
                var newF3=new THREE.Matrix4().multiplyMatrices(newS3,temp);
                tentacle03List[i].setMatrix(newF3);
                
            }
            
        
        }
            break;
            
        case 5:{
            var temp=new THREE.Matrix4().multiplyMatrices(tentacle01FList[0],rotateY45Matrix);
        
            var newF1=new THREE.Matrix4().multiplyMatrices(tentacle01SocketList[0],temp);
            
            tentacle01List[0].setMatrix(newF1);
            
            var newS2=new THREE.Matrix4().multiplyMatrices(newF1,tentacle02SList[0]);
            socket2List[0].setMatrix(newS2);
            var newF2=new THREE.Matrix4().multiplyMatrices(newS2,tentacle02FList[0]);
            
            tentacle02List[0].setMatrix(newF2);
            
            var newS3=new THREE.Matrix4().multiplyMatrices(newF2,tentacle03SList[0]);
            socket3List[0].setMatrix(newS3);
            var newF3=new THREE.Matrix4().multiplyMatrices(newS3,tentacle03FList[0]);
            tentacle03List[0].setMatrix(newF3);
            
        }
            break;
        
        case 6:{
            
            var cosTheta = Math.cos(Math.PI * 30.0 /180.0);
            var sinTheta = Math.sin(Math.PI * 30.0 /180.0);
            var pupilRotMatrix_R2 = new THREE.Matrix4().set(
                                                            cosTheta,0.0,-sinTheta,0.0,
                                                            0.0,1.0,0.0,0.0,
                                                            sinTheta,0.0,cosTheta,0.0,
                                                            0.0,0.0,0.0,1.0
                                                            );
            var pupilTSRMatrix_R2 = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_R2, pupilMatrix_R);
            var eyePupilMatrix_R2 = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R2);
            pupil_R.setMatrix(eyePupilMatrix_R2);
            
            
            var cosTheta = Math.cos(Math.PI * (-150) /180.0);
            var sinTheta = Math.sin(Math.PI * (-150) /180.0);
            
            var pupilRotMatrix_L2 = new THREE.Matrix4().set(
                                                            cosTheta,0.0,-sinTheta,0.0,
                                                            0.0,1.0,0.0,0.0,
                                                            sinTheta,0.0,cosTheta,0.0,
                                                            0.0,0.0,0.0,1.0
                                                            );
            var pupilTSRMatrix_L2 = new THREE.Matrix4().multiplyMatrices(pupilRotMatrix_L2, pupilMatrix_L);
            var eyePupilMatrix_L2 = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L2);
            pupil_L.setMatrix(eyePupilMatrix_L2);
            
        }
            break;
            
        case 7:{
            
            octopusMatrix.value=rOctopus;
            octopusEye_RMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_R);
            eye_R.setMatrix(octopusEye_RMatrix);
            
            octopusEye_LMatrix = new THREE.Matrix4().multiplyMatrices(octopusMatrix.value, eyeTSMatrix_L);
            eye_L.setMatrix(octopusEye_LMatrix);
            
            eyePupilMatrix_R = new THREE.Matrix4().multiplyMatrices(octopusEye_RMatrix, pupilTSRMatrix_R);
            pupil_R.setMatrix(eyePupilMatrix_R);
            
            eyePupilMatrix_L = new THREE.Matrix4().multiplyMatrices(octopusEye_LMatrix, pupilTSRMatrix_L);
            pupil_L.setMatrix(eyePupilMatrix_L);
            
        }
            break;
        default:
            break;
    }
    

}


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var channel = 0;
function checkKeyboard() {
    for (var i=0; i<10; i++)
    {
        if (keyboard.pressed(i.toString()))
        {
            channel = i;
            break;
        }
    }
}


// SETUP UPDATE CALL-BACK
function update() {
    checkKeyboard();
    updateBody();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();

