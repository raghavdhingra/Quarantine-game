
function Chaser( logicCube, needHelper ) {


	// const SPEED = 0.031 ;
	const SPEED = 0.028;
	const STARTVEC = new THREE.Vector3( 2.5, 2, 1.5); // was ( 5, 2, 1)

	var group = new THREE.Group();
	group.position.copy( STARTVEC );
	scene.add( group );

	var pharaohFollows;
	var pharaohVecTarget = new THREE.Vector3();

	var params = {
		isRunning: false,
		startVec: STARTVEC
	};


	if ( needHelper ) {
		var geometry = new THREE.BoxBufferGeometry( 40, 50, 2.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = -20 ;
		group.add( cube );
	};



	function update() {

		if ( params.isRunning ) {

			// Update the monster

			group.position.x += SPEED ;
			group.position.y = getTrackInterpol( group.position.x )

			// check for collision with the player
			if ( logicCube.position.x < group.position.x ) {
				game.fail();
			};

			sprControler.tentaclesSprites[0].position.y = Math.sin( Date.now() / 350 ) / 10 ;
			sprControler.tentaclesSprites[1].position.y = Math.sin( Date.now() / 300 ) / 10;
			sprControler.tentaclesSprites[2].position.y = Math.sin( Date.now() / 250 ) / 10 ;

			// Update the pharaoh

			if ( pharaohFollows ) {
				pharaohVecTarget.set( 
					THREE.Math.lerp( group.position.x, logicCube.position.x, 0.7 ),
					getTrackInterpol( THREE.Math.lerp( group.position.x, logicCube.position.x, 0.7 ) ),
					logicCube.position.z
				);
				pharaohVecTarget.y += Math.sin( Date.now() / 300 ) / 3 ;
				pharaohVecTarget.z += 0.5 ;
				sprControler.getPharaoh().position.lerp( pharaohVecTarget, 0.05 );
			};

		};

	};




	// This function return a linear interpolation between two points
	// in the chaser track, so we get a Y position varying smoothly
	function getTrackInterpol( xValue ) {
		return THREE.Math.lerp(
					atlas.chaserTrack[ Math.floor( xValue ) ],
					atlas.chaserTrack[ Math.ceil( xValue ) ],
					xValue - Math.floor( xValue ) );
	};




	function start() {
		params.isRunning = true;
		group.add( sprControler.tentaclesGroup );
		sprControler.enablePharaoh();

		// Make the pharaoh head levitate for a second or two,
		// then follow the player
		let token = setInterval( ()=> {
			sprControler.getPharaoh().position.y += 0.01 ;
			if ( sprControler.getPharaoh().position.y > 4.2 ) {
				clearInterval( token );
				// follow player
				setTimeout( ()=> {
					pharaohFollows = true ;
				}, 500);
			};
		}, 20);

	};

	function stop() {
		params.isRunning = false;
		pharaohFollows = false ;
		group.remove( sprControler.tentaclesGroup );
		group.position.copy( chaser.params.startVec );
		sprControler.disablePharaoh();
		sprControler.getPharaoh().position.set( 7.5, 3.8, 1.5 );
	};



	return {
		update,
		start,
		stop,
		group,
		params
	};

};