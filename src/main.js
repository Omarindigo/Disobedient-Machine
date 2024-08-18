import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

// Video and audio elements for the first sphere
const videoPlaylist1 = ['./assets/videos/1.mp4', './assets/videos/2.mp4', './assets/videos/3.mp4', './assets/videos/4.mp4'];
let currentVideoIndex1 = 0;
const video1 = document.createElement('video');
video1.src = videoPlaylist1[currentVideoIndex1];
video1.loop = true;
video1.muted = true;
video1.play();

const audio1 = new Audio('./assets/sounds/9.mp3');
const audio2 = new Audio('./assets/sounds/31.mp3');
const audio3 = new Audio('./assets/sounds/31.mp3');
const audio4 = new Audio('./assets/sounds/0.m4a');
const popupSound = new Audio('./assets/sounds/popup.wav');

// Three.js scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;
document.getElementById('container').appendChild(renderer.domElement);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;  // Initially disable the controls
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

function toggleOrbitControls(enabled) {
    controls.enabled = enabled;
}

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 32);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 20);
spotLight.position.set(0, 5, 5);
spotLight.angle = 0.15;
spotLight.penumbra = 0.43;
spotLight.decay = 1.4;
spotLight.distance = 200;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 500;
spotLight.color.setRGB(1, 1, 1);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// Initially hide the spotlight helper
spotLightHelper.visible = false;
scene.add(spotLightHelper);

const targetObject = new THREE.Object3D();
scene.add(targetObject);
spotLight.target = targetObject;

// Function to compute the center of the scene objects
function computeCenter(objects) {
    const center = new THREE.Vector3();
    const box = new THREE.Box3();
    objects.forEach((obj) => box.expandByObject(obj));
    box.getCenter(center);
    return center;
}

// Spheres setup
const loader = new THREE.TextureLoader();
const colorMap = loader.load('./assets/images/Plastic007_4K_Color.jpg');
const roughnessMap = loader.load('./assets/images/Plastic007_4K_Roughness.jpg');
const displacementMap = loader.load('./assets/images/Plastic007_4K_Displacement.jpg');
const normalMapDX = loader.load('./assets/images/bnormal.png'); // Only use the normalMapDX

const plasticMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    roughnessMap: roughnessMap,
    normalMap: normalMapDX, // Ensure this is used
    displacementMap: displacementMap,
    displacementScale: 0.05, // Slight adjustment
    displacementBias: -0.5
});

const createSphere = (geometry, material, position) => {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...position);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    sphere.userData.originalPosition = sphere.position.clone(); // Add this line
    return sphere;
};

const geometry1 = new THREE.SphereGeometry(0.7, 32, 32);
const texture1 = new THREE.VideoTexture(video1);
const material1 = new THREE.MeshPhongMaterial({ map: texture1, side: THREE.BackSide });
const mesh1 = createSphere(geometry1, material1, [0, 0.2, 0]);
mesh1.rotation.set(0, Math.PI / 2, 0);

const geometry2 = new THREE.SphereGeometry(0.25, 32, 32);
const mesh2 = createSphere(geometry2, plasticMaterial, [0, -0.94, 0]);

const geometry3 = new THREE.SphereGeometry(0.25, 32, 32);
const mesh3 = createSphere(geometry3, plasticMaterial, [0.52, -0.724, 0]);

const geometry4 = new THREE.SphereGeometry(0.3, 32, 32);
const mesh4 = createSphere(geometry4, plasticMaterial, [0.77, -0.37, 0]);

// Frame setup
const frameTexture = loader.load('./assets/images/Cyberdeck_template.png', (texture) => {
    texture.minFilter = THREE.LinearFilter;
});
const frameNormalMap = loader.load('./assets/images/normal.png');
const frameMaterial = new THREE.MeshStandardMaterial({
    map: frameTexture,
    normalMap: frameNormalMap,
    transparent: true,
    side: THREE.DoubleSide
});
const frameGeometry = new THREE.PlaneGeometry(2.8, 2.8);
const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
frameMesh.position.z = 0.1;
frameMesh.castShadow = true;
frameMesh.receiveShadow = true;
scene.add(frameMesh);

// Add pipe.png to the scene with transparency
const pipeTexture = loader.load('./assets/images/pipe.png');
const pipeNormalMap = loader.load('./assets/images/pipe_normal.png');
const pipeMaterialPNG = new THREE.MeshStandardMaterial({
    map: pipeTexture,
    normalMap: pipeNormalMap,
    transparent: true
});
const pipeGeometry = new THREE.PlaneGeometry(4.5, 4.5);
const pipeMesh = new THREE.Mesh(pipeGeometry, pipeMaterialPNG);
pipeMesh.position.set(-2.0, 0, -1);
pipeMesh.castShadow = true;
pipeMesh.receiveShadow = true;
scene.add(pipeMesh);

// Add pipe2.png to the scene with transparency
const pipe2Texture = loader.load('./assets/images/pipe2.png');
const pipe2NormalMap = loader.load('./assets/images/pipe2_normal.png');
const pipe2MaterialPNG = new THREE.MeshStandardMaterial({
    map: pipe2Texture,
    normalMap: pipe2NormalMap,
    transparent: true
});
const pipe2Geometry = new THREE.PlaneGeometry(3.5, 3.5);
const pipe2Mesh = new THREE.Mesh(pipe2Geometry, pipe2MaterialPNG);
pipe2Mesh.position.set(2.0, 0.3, -1);
pipe2Mesh.castShadow = true;
pipe2Mesh.receiveShadow = true;
scene.add(pipe2Mesh);

// Background material setup
const clock = new THREE.Clock();
const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            float x = vUv.x * -2.0 - 1.0;
            float y = vUv.y * 222.0 - 1.0;
            float sinWave = sin(10.0 * x + time) * 0.95 + 0.95;
            float cosWave = sin(100.0 * y + time) * 0.5 + 0.5;
            gl_FragColor = vec4(sinWave * cosWave, sinWave, cosWave, 18.0);
        }
    `
});
const backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(21, 21, 1, 1), backgroundMaterial);
backgroundMesh.position.z = -3;
scene.add(backgroundMesh);

// Compute the center of all objects
const objectsToTarget = [mesh1, mesh2, mesh3, mesh4, frameMesh, pipeMesh, pipe2Mesh];
const center = computeCenter(objectsToTarget);

// Animation function
const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    backgroundMaterial.uniforms.time.value = clock.getElapsedTime();
    updateSpotLight();
    renderer.render(scene, camera);
};
animate();

// Interaction and animation
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isAnimating = false;
let isDisplayingSubtitles = false;
let subtitleInterval;

const animatePressDown = (mesh) => {
    const originalZ = mesh.userData.originalPosition.z;
    if (mesh.position.z > originalZ - 0.09) {
        mesh.position.z -= 0.08;
        requestAnimationFrame(() => animatePressDown(mesh));
    } else {
        animatePopUp(mesh);
    }
};

const animatePopUp = (mesh) => {
    const originalZ = mesh.userData.originalPosition.z;
    if (mesh.position.z < originalZ) {
        mesh.position.z += 0.08;
        requestAnimationFrame(() => animatePopUp(mesh));
    } else {
        mesh.position.z = originalZ;
        isAnimating = false;
    }
};

const onMouseClick = (event) => {
    event.preventDefault();
    if (isAnimating) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3, mesh4]);
    if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object;
        let video, audio;

        if (intersectedMesh === mesh2) {
            currentVideoIndex1 = (currentVideoIndex1 + 1) % videoPlaylist1.length;
            video = video1;
            audio = audio1;
            video.src = videoPlaylist1[currentVideoIndex1];
            video.load();
            video.play();
        } else if (intersectedMesh === mesh3) {
            audio = audio3;
            if (isDisplayingSubtitles) {
                clearInterval(subtitleInterval);
                isDisplayingSubtitles = false;
            } else {
                isDisplayingSubtitles = true;
                fetchAndDisplaySubtitles();
            }
        } else if (intersectedMesh === mesh4) {
            audio = audio4;
        }

        if (intersectedMesh !== mesh1) {
            audio.currentTime = 0;
            audio.play();
            isAnimating = true;
            animatePressDown(intersectedMesh);
        }
    }
};

window.addEventListener('click', onMouseClick, false);
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Function to play popup sound
const playPopupSound = () => {
    popupSound.play();
};

// Fetch and display subtitles randomly
const fetchAndDisplaySubtitles = () => {
    fetch('./assets/dialogue.json')
        .then(response => response.json())
        .then(data => {
            const dialogueLines = data.dialogue;

            const displayRandomLine = () => {
                const randomIndex = Math.floor(Math.random() * dialogueLines.length);
                const randomX = Math.random() * (window.innerWidth - 200);
                const randomY = Math.random() * (window.innerHeight - 100);

                const newPopup = document.createElement('div');
                newPopup.className = 'popup custom-popup';
                newPopup.style.position = 'absolute';
                newPopup.style.left = `${randomX}px`;
                newPopup.style.top = `${randomY}px`;

                const newPopupText = document.createElement('span');
                newPopupText.className = 'popuptext show silkscreen-regular';
                newPopupText.textContent = dialogueLines[randomIndex];

                newPopup.appendChild(newPopupText);
                document.body.appendChild(newPopup);

                playPopupSound();
                makePopupDraggable(newPopup);
            };

            subtitleInterval = setInterval(displayRandomLine, 3000);
        })
        .catch(error => console.error('Error loading subtitles:', error));
};

// Make popups draggable
const makePopupDraggable = (popup) => {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    const startDragging = (event) => {
        isDragging = true;
        startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        startY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        initialX = popup.offsetLeft;
        initialY = popup.offsetTop;
    };

    const dragPopup = (event) => {
        if (isDragging) {
            const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
            const currentY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
            const dx = currentX - startX;
            const dy = currentY - startY;
            popup.style.left = `${initialX + dx}px`;
            popup.style.top = `${initialY + dy}px`;
        }
    };

    const stopDragging = () => {
        isDragging = false;
    };

    popup.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', dragPopup);
    window.addEventListener('mouseup', stopDragging);
    popup.addEventListener('touchstart', startDragging, { passive: true });
    window.addEventListener('touchmove', dragPopup, { passive: true });
    window.addEventListener('touchend', stopDragging);
};

// dat.GUI setup
const gui = new GUI();
gui.hide(); // Hide the GUI initially

const controlsFolder = gui.addFolder('Controls');
controlsFolder.add({ orbitControls: false }, 'orbitControls')
    .name('Orbit Controls')
    .onChange(toggleOrbitControls);

const spotLightFolder = gui.addFolder('SpotLight');

spotLightFolder.add(spotLight.position, 'x', -20, 20).name('Position X').setValue(0).onChange(updateSpotLight);
spotLightFolder.add(spotLight.position, 'y', 0, 20).name('Position Y').setValue(5).onChange(updateSpotLight);
spotLightFolder.add(spotLight.position, 'z', -20, 20).name('Position Z').setValue(5).onChange(updateSpotLight);

const targetFolder = spotLightFolder.addFolder('Target');
targetFolder.add(targetObject.position, 'x', -10, 10).name('Target X').onChange(updateSpotLight);
targetFolder.add(targetObject.position, 'y', -10, 10).name('Target Y').onChange(updateSpotLight);
targetFolder.add(targetObject.position, 'z', -10, 10).name('Target Z').onChange(updateSpotLight);

spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2).name('Angle').setValue(0.15).onChange(updateSpotLight);
spotLightFolder.add(spotLight, 'penumbra', 0, 1).name('Penumbra').setValue(0.43).onChange(updateSpotLight);
spotLightFolder.add(spotLight, 'decay', 0, 20).name('Decay').setValue(1.2).onChange(updateSpotLight);
spotLightFolder.add(spotLight, 'distance', 0, 1000).name('Distance').onChange(updateSpotLight);
spotLightFolder.add(spotLight, 'intensity', 0, 50).name('Intensity').setValue(50).onChange(updateSpotLight);

// Update color control
spotLightFolder.addColor({ color: spotLight.color.getHex() }, 'color').name('Color').setValue(0xffffff).onChange((value) => {
    spotLight.color.setHex(value);
    updateSpotLight();
});

spotLightFolder.add({ helperVisible: false }, 'helperVisible')
    .name('SpotLight Helper')
    .onChange((value) => {
        spotLightHelper.visible = value;
    });

spotLightFolder.open();

const ambientLightFolder = gui.addFolder('AmbientLight');
ambientLightFolder.add(ambientLight, 'intensity', 0, 50).name('Intensity').setValue(50);
ambientLightFolder.open();

function updateSpotLight() {
    spotLight.updateMatrixWorld();
    spotLightHelper.update();
}

function toggleGUI() {
    if (gui.domElement.style.display === 'none') {
        gui.show();
    } else {
        gui.hide();
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'g' || event.key === 'G') {
        toggleGUI();
    }
});
