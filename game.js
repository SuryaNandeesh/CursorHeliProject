// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create ground platform
const groundGeometry = new THREE.BoxGeometry(200, 1, 200);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.5;
scene.add(ground);

// Create helicopter
class Helicopter {
    constructor() {
        // Create helicopter body
        const geometry = new THREE.BoxGeometry(2, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
        this.body = new THREE.Mesh(geometry, material);
        this.body.position.y = 5; // Start above ground
        scene.add(this.body);

        // Create rotor
        const rotorGeometry = new THREE.BoxGeometry(0.1, 0.1, 4);
        const rotorMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        this.rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
        this.rotor.position.y = 0.6;
        this.body.add(this.rotor);

        // Movement properties
        this.velocity = new THREE.Vector3();
        this.rotationVelocity = 0;
        this.verticalVelocity = 0;
        this.position = this.body.position;
    }

    update(delta) {
        // Update rotor rotation
        this.rotor.rotation.y += 10 * delta;

        // Apply movement
        this.body.position.add(this.velocity.multiplyScalar(delta));
        this.body.position.y += this.verticalVelocity * delta;
        this.body.rotation.y += this.rotationVelocity * delta;

        // Keep helicopter above ground
        if (this.body.position.y < 1) {
            this.body.position.y = 1;
            this.verticalVelocity = 0;
        }

        // Apply drag
        this.velocity.multiplyScalar(0.95);
        this.rotationVelocity *= 0.95;
        this.verticalVelocity *= 0.95;
    }

    shoot() {
        const missile = new Missile(this.body.position.clone(), this.body.rotation.y);
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

// Create destructible object class
class DestructibleObject {
    constructor(position) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }
}

// Setup lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create game objects
const helicopter = new Helicopter();
const missiles = [];
const destructibles = [];

// Create random destructible objects
for (let i = 0; i < 10; i++) {
    const position = new THREE.Vector3(
        Math.random() * 100 - 50,
        2, // Place above ground
        Math.random() * 100 - 50
    );
    destructibles.push(new DestructibleObject(position));
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
        cameraRotation.target.z = 0;
    }

    // Vertical movement
    if (keys['q']) helicopter.verticalVelocity = 5;
    if (keys['e']) helicopter.verticalVelocity = -5;

    // Update helicopter
    helicopter.update(delta);

    // Update camera rotation with lerp
    cameraRotation.current.z = THREE.MathUtils.lerp(
        cameraRotation.current.z,
        cameraRotation.target.z,
        0.1
    );

    // Update camera position to follow helicopter with rotation
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), helicopter.body.rotation.y);
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