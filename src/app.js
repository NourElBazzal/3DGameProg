// Create the Babylon.js scene
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

//setup camera
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

//Lighting
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

scene.enablePhysics();

//create ground
function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", '/images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("/images/back.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;

        // for physic engine
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, scene);    
    }
    return ground;
}


//create the obtsacles
function createObstacles(scene) {
    const obstacles = [];

    const obstacle1 = BABYLON.MeshBuilder.CreateBox("obstacle1", { size: 1 }, scene);
    obstacle1.position.set(2, 0.5, 2);
    const mat1 = new BABYLON.StandardMaterial("mat1", scene);
    mat1.diffuseColor = new BABYLON.Color3(1, 0, 0);
    obstacle1.material = mat1;
    obstacle1.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2, friction: 0.8 }, scene);
    obstacles.push(obstacle1);

    const obstacle2 = BABYLON.MeshBuilder.CreateCylinder("obstacle2", { diameter: 1, height: 2 }, scene);
    obstacle2.position.set(-2, 1, -2);
    const mat2 = new BABYLON.StandardMaterial("mat2", scene);
    mat2.diffuseColor = new BABYLON.Color3(0, 0, 1);
    obstacle2.material = mat2;
    obstacle2.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.6, friction: 1}, scene);
    obstacles.push(obstacle2);


    const obstacle3 = BABYLON.MeshBuilder.CreateCylinder("obstacle3", { diameterTop: 0, diameterBottom: 1, height: 2 }, scene);
    obstacle3.position.set(0, 1, 3);
    const mat3 = new BABYLON.StandardMaterial("mat3", scene);
    mat3.diffuseColor = new BABYLON.Color3(0, 1, 0);
    obstacle3.material = mat3;
    obstacle3.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2, friction: 0.8 }, scene);
    obstacles.push(obstacle3);

    return obstacles;
}


function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("marbleFollowCamera", target.position, scene, target);

    camera.radius = 10; // how far from the object to follow
	camera.heightOffset = 5; // how high above the object to place the camera
	camera.rotationOffset = 200; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}


// Define the ball materials
const sphereMaterials = [];
sphereMaterials[0] = new BABYLON.StandardMaterial("sphereMaterial0", scene);
sphereMaterials[0].ambientColor = new BABYLON.Color3(0, 0.5, 0);
sphereMaterials[0].diffuseColor = new BABYLON.Color3(5, 0, 0);
sphereMaterials[0].specularColor = new BABYLON.Color3(0, 0, 0);

sphereMaterials[1] = new BABYLON.StandardMaterial("sphereMaterial1", scene);
sphereMaterials[1].ambientColor = new BABYLON.Color3(0, 0.5, 0);
sphereMaterials[1].diffuseColor = new BABYLON.Color3(5, 0, 1);
sphereMaterials[1].specularColor = new BABYLON.Color3(0, 0, 3);
sphereMaterials[1].specularPower = 256;

sphereMaterials[2] = new BABYLON.StandardMaterial("sphereMaterial3", scene);
sphereMaterials[2].diffuseTexture = new BABYLON.Texture("/images/rainbow.jpg", scene);
sphereMaterials[2].emissiveColor = new BABYLON.Color3.Green;

sphereMaterials[3] = new BABYLON.StandardMaterial("sphereMaterial6", scene);
sphereMaterials[3].ambientColor = new BABYLON.Color3(0, 0.8, 0);
sphereMaterials[3].diffuseColor = new BABYLON.Color3(1, 0, 0);
sphereMaterials[3].alpha = 0.5;

sphereMaterials[4] = new BABYLON.StandardMaterial("sphereMaterial7", scene);
sphereMaterials[4].diffuseTexture = new BABYLON.Texture("/images/world-map.jpg", scene);
sphereMaterials[4].diffuseTexture.hasAlpha = true;
sphereMaterials[4].emissiveColor = new BABYLON.Color3.Red;

sphereMaterials[5] = new BABYLON.StandardMaterial("sphereMaterial8", scene);
sphereMaterials[5].ambientColor = new BABYLON.Color3(0, 0.3, 0);
sphereMaterials[5].bumpTexture = new BABYLON.Texture("/images/world-map.jpg", scene);
sphereMaterials[5].bumpTexture.level = 15.0;

// Create ball options for selection
const ballOptionsContainer = document.getElementById('ballOptions');
//const ballOption = BABYLON.MeshBuilder.CreateSphere(`ballOption${index}`, { diameter: 1 }, scene);
sphereMaterials.forEach((material, index) => {
    const ballOption = document.createElement("div");
    ballOption.style.width = "50px";
    ballOption.style.height = "50px";
    ballOption.style.borderRadius = "50%";
    ballOption.style.cursor = "pointer";
    ballOption.style.border = "none";

    // If the material has a texture, set it as the background
    if (material.diffuseTexture) {
        ballOption.style.backgroundImage = `url(${material.diffuseTexture.url})`;
        ballOption.style.backgroundSize = "cover";
    } else {
        // Otherwise, use the material color
        ballOption.style.backgroundColor = `rgb(
            ${material.diffuseColor.r * 255}, 
            ${material.diffuseColor.g * 255}, 
            ${material.diffuseColor.b * 255}
        )`;
    }

    ballOption.addEventListener("click", () => selectBall(index));

    document.getElementById("ballOptions").appendChild(ballOption);
});


let selectedBallMaterial;
function selectBall(index) {
    selectedBallMaterial = sphereMaterials[index];
    console.log("Selected Material:", selectedBallMaterial);
}

document.getElementById('startGame').onclick = startGame;

function startGame() {
    if (!selectedBallMaterial) {
        alert('Please select a ball first!');
        return;
    }

    createGround(scene);

    // Clear the ball selection UI
    document.getElementById('ballSelection').style.display = 'none';

     // Create the player's marble
     const marble = BABYLON.MeshBuilder.CreateSphere("marble", { diameter: 1 }, scene);
     marble.material = selectedBallMaterial;
     marble.position.y = 0.5; // Adjust position so it doesn't sink
 
     marble.physicsImpostor = new BABYLON.PhysicsImpostor(
         marble,
         BABYLON.PhysicsImpostor.SphereImpostor,
         { mass: 1, restitution: 0.2, friction: 0.8, damping: 0.5 },
         scene
     );

    // Create obstacles
    const obstacles = createObstacles(scene);

   let freeCamera = createFreeCamera(scene);

    // second parameter is the target to follow
    let followCamera = createFollowCamera(scene, marble);
    scene.activeCamera = followCamera;

    // Prevent sinking by adjusting collision handling
    marble.physicsImpostor.registerOnPhysicsCollide(obstacles.map(obs => obs.physicsImpostor), (collider, collidedWith) => {
        console.log("Collision detected!");
        collider.setLinearVelocity(collider.getLinearVelocity().scale(0.5)); // Reduce velocity by half
        collider.setAngularVelocity(collider.getAngularVelocity().scale(0.3)); // Reduce rotation
    });
    
    // Add movement controls for the marble
    window.addEventListener("keydown", (event) => {
        let force = new BABYLON.Vector3(0, 0, 0);
        const moveSpeed = 0.2; // Adjust speed as needed

        switch (event.key) {
            case "ArrowUp":
                marble.position.z += moveSpeed;
                break;
            case "ArrowDown":
                marble.position.z -= moveSpeed;
                break;
            case "ArrowLeft":
                marble.position.x -= moveSpeed;
                break;
            case "ArrowRight":
                marble.position.x += moveSpeed;
                break;
        }

        marble.physicsImpostor.applyImpulse(force, marble.getAbsolutePosition());
    });


}

// Render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize the engine on window resize
window.addEventListener('resize', () => {
    engine.resize();
});
