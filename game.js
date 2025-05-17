// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create skybox
const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyboxMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // right
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // left
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // top
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // bottom
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // front
    new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // back
];
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
scene.add(skybox);

// Create cloud system
class Cloud {
    constructor() {
        const cloudGeometry = new THREE.SphereGeometry(Math.random() * 3 + 2, 8, 8);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
        this.mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        
        // Random position
        this.mesh.position.set(
            Math.random() * 200 - 100,
            Math.random() * 20 + 30,
            Math.random() * 200 - 100
        );
        
        // Random scale for variety
        const scale = Math.random() * 1.5 + 0.5;
        this.mesh.scale.set(scale, scale * 0.6, scale);
        
        // Movement properties
        this.speed = Math.random() * 2 + 1;
        scene.add(this.mesh);
    }

    update(delta) {
        this.mesh.position.x += this.speed * delta;
        if (this.mesh.position.x > 100) {
            this.mesh.position.x = -100;
            this.mesh.position.z = Math.random() * 200 - 100;
        }
    }
}

// Create cloud instances
const clouds = [];
for (let i = 0; i < 20; i++) {
    clouds.push(new Cloud());
}

// Create water
const waterGeometry = new THREE.PlaneGeometry(400, 400);
const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    transparent: true,
    opacity: 0.8,
    shininess: 100
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.3;
scene.add(water);

// Create island
const islandGeometry = new THREE.CircleGeometry(50, 32);
const islandMaterial = new THREE.MeshPhongMaterial({
    color: 0x567d46,  // grass green
    shininess: 0
});
const island = new THREE.Mesh(islandGeometry, islandMaterial);
island.rotation.x = -Math.PI / 2;
scene.add(island);

// Create beach (ring around the island)
const beachOuterRadius = 60;
const beachInnerRadius = 48;
const beachGeometry = new THREE.RingGeometry(beachInnerRadius, beachOuterRadius, 32);
const beachMaterial = new THREE.MeshPhongMaterial({
    color: 0xf2d16b,  // sand color
    shininess: 0
});
const beach = new THREE.Mesh(beachGeometry, beachMaterial);
beach.rotation.x = -Math.PI / 2;
beach.position.y = -0.1;
scene.add(beach);

// Add some palm trees
function createPalmTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 8, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 4, z);
    trunk.rotation.y = Math.random() * Math.PI;
    scene.add(trunk);

    // Create palm leaves in a more natural downward arc
    for (let i = 0; i < 7; i++) {
        const leafGeometry = new THREE.ConeGeometry(2, 4, 4);
        const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5a27 });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.y = 7;
        // Angle leaves downward and outward
        leaf.rotation.x = Math.PI / 6; // Tilt downward
        leaf.rotation.y = (i * Math.PI * 2) / 7;
        leaf.rotation.z = Math.PI / 6; // Additional tilt for natural look
        trunk.add(leaf);
    }
}

// Add several palm trees around the island
for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const radius = 40;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    createPalmTree(x, z);
}

// Create helicopter
class Helicopter {
    constructor() {
        this.group = new THREE.Group();
        scene.add(this.group);
        this.group.position.y = 5;

        const bodyGeometry = new THREE.Group();
        
        // Main fuselage - rotated to face forward
        const fuselageGeometry = new THREE.CylinderGeometry(0.8, 0.8, 4, 8);
        const fuselageMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        this.body = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        this.body.rotation.z = 0;
        this.body.rotation.y = Math.PI / 2; // Rotate to face forward
        bodyGeometry.add(this.body);

        // Adjust all other components to match new orientation
        // Nose cone
        const noseGeometry = new THREE.ConeGeometry(0.8, 1.5, 8);
        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.rotation.y = Math.PI / 2;
        nose.position.z = -2.75;
        bodyGeometry.add(nose);

        // Tail boom
        const tailBoomGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
        const tailBoomMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
        tailBoom.rotation.y = Math.PI / 2;
        tailBoom.position.z = 2.5;
        bodyGeometry.add(tailBoom);

        // Tail fin (vertical)
        const tailFinGeometry = new THREE.BoxGeometry(1.2, 0.1, 1);
        const tailFinMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        const tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial);
        tailFin.position.z = 3.8;
        tailFin.position.y = 0.6;
        bodyGeometry.add(tailFin);

        // Tail rotor
        const tailRotorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
        const tailRotorMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        this.tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
        this.tailRotor.position.z = 4;
        bodyGeometry.add(this.tailRotor);

        // Skids
        const skidGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const skidMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
        
        // Left skid
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.rotation.z = Math.PI / 2;
        leftSkid.position.y = -0.8;
        leftSkid.position.z = 0.5;
        bodyGeometry.add(leftSkid);

        // Right skid
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.rotation.z = Math.PI / 2;
        rightSkid.position.y = -0.8;
        rightSkid.position.z = -0.5;
        bodyGeometry.add(rightSkid);

        // Skid supports
        const supportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
        
        // Front supports
        const frontLeftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        frontLeftSupport.position.set(0.5, -0.3, 0.5);
        bodyGeometry.add(frontLeftSupport);
        
        const frontRightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        frontRightSupport.position.set(0.5, -0.3, -0.5);
        bodyGeometry.add(frontRightSupport);

        // Rear supports
        const rearLeftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        rearLeftSupport.position.set(-0.5, -0.3, 0.5);
        bodyGeometry.add(rearLeftSupport);
        
        const rearRightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        rearRightSupport.position.set(-0.5, -0.3, -0.5);
        bodyGeometry.add(rearRightSupport);

        // Main rotor adjusted
        const rotorGeometry = new THREE.BoxGeometry(6, 0.1, 0.2);
        const rotorMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        this.rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
        this.rotor.position.y = 1;
        bodyGeometry.add(this.rotor);

        // Cockpit windows adjusted
        const windowGeometry = new THREE.SphereGeometry(0.7, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x84c1ff,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        const cockpitWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        cockpitWindow.rotation.y = Math.PI / 2;
        cockpitWindow.position.set(0, 0.4, -1);
        bodyGeometry.add(cockpitWindow);

        this.group.add(bodyGeometry);

        // Movement properties
        this.velocity = new THREE.Vector3();
        this.rotationVelocity = 0;
        this.verticalVelocity = 0;
        this.position = this.group.position;
    }

    update(delta) {
        // Update rotor rotation
        this.rotor.rotation.y += 15 * delta;
        this.tailRotor.rotation.x += 20 * delta;

        // Apply movement
        this.group.position.add(this.velocity.multiplyScalar(delta));
        this.group.position.y += this.verticalVelocity * delta;
        this.group.rotation.y += this.rotationVelocity * delta;

        // Keep helicopter above ground
        if (this.group.position.y < 1) {
            this.group.position.y = 1;
            this.verticalVelocity = 0;
        }

        // Apply drag
        this.velocity.multiplyScalar(0.95);
        this.rotationVelocity *= 0.95;
        this.verticalVelocity *= 0.95;
    }

    shoot() {
        const missile = new Missile(this.group.position.clone(), this.group.rotation.y);
        missiles.push(missile);
    }
}

// Create missile class
class Missile {
    constructor(position, rotation) {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.copy(position);
        this.mesh.rotation.y = rotation;
        this.mesh.position.y += 0.2;
        
        // Offset missile starting position to helicopter's front
        const offset = new THREE.Vector3(0, 0, -1);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        this.mesh.position.add(offset);

        this.velocity = new THREE.Vector3(0, 0, -30);
        this.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        
        scene.add(this.mesh);
    }

    update(delta) {
        this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));
    }

    checkCollision(target) {
        const distance = this.mesh.position.distanceTo(target.position);
        return distance < 2;
    }
}

// Replace DestructibleObject with Crate
class Crate {
    constructor(position) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x8b4513,
            map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif')
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }
}

// Add new Turret class
class Turret {
    constructor(position) {
        this.group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 1, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.group.add(base);

        // Turret body
        const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 2);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 1.25;
        this.group.add(this.body);

        // Gun barrel
        const barrelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const barrelMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        this.barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        this.barrel.rotation.z = Math.PI / 2;
        this.barrel.position.set(1, 1.25, 0);
        this.body.add(this.barrel);

        this.group.position.copy(position);
        this.position = this.group.position;
        scene.add(this.group);
    }

    update(delta, targetPosition) {
        // Make turret track the helicopter
        const direction = new THREE.Vector3()
            .subVectors(targetPosition, this.group.position)
            .normalize();
        const angle = Math.atan2(direction.x, direction.z);
        this.body.rotation.y = angle;
    }
}

// Setup lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased ambient light intensity
scene.add(ambientLight);

// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased intensity
directionalLight.position.set(50, 100, 50); // Positioned like sun
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Additional fill light for better object definition
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-50, 50, -50);
scene.add(fillLight);

// Create game objects
const helicopter = new Helicopter();
const missiles = [];
const destructibles = [];
const turrets = [];

// Create random destructible crates
for (let i = 0; i < 5; i++) {
    const position = new THREE.Vector3(
        Math.random() * 80 - 40,
        2,
        Math.random() * 80 - 40
    );
    destructibles.push(new Crate(position));
}

// Create turrets at strategic positions
for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const radius = 30;
    const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        2,
        Math.sin(angle) * radius
    );
    turrets.push(new Turret(position));
}

// Camera properties
const cameraRotation = {
    current: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(0, 0, 0)
};

// Setup camera
camera.position.set(0, 5, 10);

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);
window.addEventListener('keypress', (e) => {
    if (e.key === ' ') {
        helicopter.shoot();
    }
});

// Game loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Update clouds
    clouds.forEach(cloud => cloud.update(delta));

    // Animate water
    water.material.opacity = 0.6 + Math.sin(Date.now() * 0.001) * 0.1;

    // Handle helicopter controls (W and S swapped)
    if (keys['w']) helicopter.velocity.z = 10; // Backward
    if (keys['s']) helicopter.velocity.z = -10; // Forward
    if (keys['a']) {
        helicopter.rotationVelocity = 2;
        cameraRotation.target.z = THREE.MathUtils.degToRad(-25);
    } else if (keys['d']) {
        helicopter.rotationVelocity = -2;
        cameraRotation.target.z = THREE.MathUtils.degToRad(25);
    } else {
        // Reset both rotation velocity and camera rotation
        helicopter.rotationVelocity *= 0.8;
        cameraRotation.target.z = 0;
    }

    // Vertical movement
    if (keys['q']) helicopter.verticalVelocity = 5;
    if (keys['e']) helicopter.verticalVelocity = -5;

    // Update helicopter
    helicopter.update(delta);

    // Update camera rotation with smoother reset
    cameraRotation.current.z = THREE.MathUtils.lerp(
        cameraRotation.current.z,
        cameraRotation.target.z,
        0.15 // Increased from 0.1 for faster reset
    );

    // Update camera position to follow helicopter with rotation
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), helicopter.group.rotation.y);
    camera.position.copy(helicopter.position).add(cameraOffset);
    camera.lookAt(helicopter.position);
    
    // Apply camera tilt
    camera.rotation.z = cameraRotation.current.z;

    // Update missiles and check collisions
    for (let i = missiles.length - 1; i >= 0; i--) {
        missiles[i].update(delta);

        // Check collisions with destructible objects
        for (let j = destructibles.length - 1; j >= 0; j--) {
            if (missiles[i].checkCollision(destructibles[j].mesh)) {
                scene.remove(destructibles[j].mesh);
                destructibles.splice(j, 1);
                scene.remove(missiles[i].mesh);
                missiles.splice(i, 1);
                break;
            }
        }

        // Remove missiles that have traveled too far
        if (missiles[i] && missiles[i].mesh.position.length() > 100) {
            scene.remove(missiles[i].mesh);
            missiles.splice(i, 1);
        }
    }

    // Update turrets to track helicopter
    turrets.forEach(turret => {
        turret.update(delta, helicopter.position);
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
animate(); 