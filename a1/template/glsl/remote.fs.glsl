
uniform int rcState;

void main() {
	// HINT: WORK WITH rcState HERE

	//Paint it red
	if (rcState==1){
	gl_FragColor = vec4(1, 0, 0, 1);
	}
	else if (rcState==2){
	gl_FragColor = vec4(0, 1, 0, 1);
	}
	else if (rcState==3){
	gl_FragColor=vec4(0, 0, 1, 1);
	}

}