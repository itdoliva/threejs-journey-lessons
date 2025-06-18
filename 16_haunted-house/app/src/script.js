import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorDiffusionTexture = textureLoader.load('./floor/rocky_terrain_02_1k/diffusion.jpg')
const floorARMTexture = textureLoader.load('./floor/rocky_terrain_02_1k/arm.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/rocky_terrain_02_1k/displacement.jpg')
const floorNormalTexture = textureLoader.load('./floor/rocky_terrain_02_1k/normal.jpg')

floorDiffusionTexture.repeat.set(4, 4)
floorARMTexture.repeat.set(4, 4)
floorDisplacementTexture.repeat.set(4, 4)
floorNormalTexture.repeat.set(4, 4)

floorDiffusionTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorDiffusionTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDiffusionTexture.colorSpace = THREE.SRGBColorSpace

// Walls
const wallsDiffusionTexture = textureLoader.load('./walls/castle_brick_07_1k/diffusion.jpg')
const wallsARMTexture = textureLoader.load('./walls/castle_brick_07_1k/arm.jpg')
const wallsNormalTexture = textureLoader.load('./walls/castle_brick_07_1k/normal.jpg')

wallsDiffusionTexture.colorSpace = THREE.SRGBColorSpace


// Roof
const roofDiffusionTexture = textureLoader.load('./roof/roof_slates_02_1k/diffusion.jpg')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/arm.jpg')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/normal.jpg')

roofDiffusionTexture.colorSpace = THREE.SRGBColorSpace

roofDiffusionTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofDiffusionTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushDiffusionTexture = textureLoader.load('./bush/leaves_fores_ground_1k/diffusion.jpg')
const bushARMTexture = textureLoader.load('./bush/leaves_fores_ground_1k/arm.jpg')
const bushNormalTexture = textureLoader.load('./bush/leaves_fores_ground_1k/normal.jpg')

bushDiffusionTexture.colorSpace = THREE.SRGBColorSpace

// Grave
const graveDiffusionTexture = textureLoader.load('./grave/plastered_stone_wall_1k/diffusion.jpg')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/arm.jpg')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/normal.jpg')

graveDiffusionTexture.colorSpace = THREE.SRGBColorSpace

graveDiffusionTexture.repeat.set(.3, .4)
graveARMTexture.repeat.set(.3, .4)
graveNormalTexture.repeat.set(.3, .4)

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({ 
        alphaMap: floorAlphaTexture, 
        transparent: true,
        map: floorDiffusionTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        displacementMap: floorDisplacementTexture,
        normalMap: floorNormalTexture,
        displacementScale: .3,
        displacementBias: -.2
    })
)
floor.rotation.x = -Math.PI * .5
scene.add(floor)

/**
 * House
 */
const houseParams = {
    width: 4,
    depth: 4,
    height: 2.5,
    roofSize: 3.5,
    roofHeight: 1.5,
    doorSize: 2,
}

const houseGroup = new THREE.Group()
houseGroup.position.y = houseParams.height/2
scene.add(houseGroup)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseParams.width, houseParams.height, houseParams.depth),
    new THREE.MeshStandardMaterial({ 
        map: wallsDiffusionTexture,
        aoMap: wallsARMTexture,
        roughnessMap: wallsARMTexture,
        metalnessMap: wallsARMTexture,
        normalMap: wallsNormalTexture,
    })
)


houseGroup.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseParams.roofSize, houseParams.roofHeight, 4, 1),
    new THREE.MeshStandardMaterial({ 
        map: roofDiffusionTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = houseParams.height/2 + houseParams.roofHeight/2
roof.rotation.y = Math.PI/4
houseGroup.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseParams.doorSize, houseParams.doorSize),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        normalMap: doorNormalTexture,
        aoMap: doorAmbientOcclusionTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
    })
)
door.position.y = -.325
door.position.z = houseParams.width/2 + .01
houseGroup.add(door)


// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0xccffcc,
    map: bushDiffusionTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})

const bushes = [
    { position: new THREE.Vector3(.8, .2, 2.2), scaleK: .5 },
    { position: new THREE.Vector3(1.4, .1, 2.1), scaleK: .25 },
    { position: new THREE.Vector3(-.8, .1, 2.2), scaleK: .4 },
    { position: new THREE.Vector3(-1, .05, 2.6), scaleK: .15 },
]

bushes.forEach(({ position, scaleK }) => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.position.set(position.x, position.y, position.z)
    bush.scale.set(scaleK, scaleK, scaleK)
    scene.add(bush)
})

// Graves
const graveGroup = new THREE.Group()
scene.add(graveGroup)

const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveDiffusionTexture,
    normalMap: graveNormalTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture
})


for (let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const radius = 3 + Math.random() * 4
    const degree = Math.random() * 2 * Math.PI

    grave.position.x = Math.cos(degree) * radius
    grave.position.y = Math.random() * .4
    grave.position.z = Math.sin(degree) * radius

    grave.rotation.x = (-.5 + Math.random()) * .4
    grave.rotation.y = (-.5 + Math.random()) * .4
    grave.rotation.z = (-.5 + Math.random()) * .4

    graveGroup.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0x86cdff, 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0x86cdff, 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 5)
doorLight.position.set(0, houseParams.doorSize - 1, houseParams.width/2 + .2)
houseGroup.add(doorLight)

/**
 Ghosts
 */
const ghost1 = new THREE.PointLight(0x0F6CA6, 6)
const ghost2 = new THREE.PointLight(0x158FBF, 8)
const ghost3 = new THREE.PointLight(0x29B9D9, 12, 24, 3)
ghost1.position.y = .15
ghost2.position.y = .15
ghost3.position.y = .15
scene.add(ghost1, ghost2, ghost3)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for (const grave of graveGroup.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 10
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 10
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 10


/**
 Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = .1
sky.material.uniforms['mieDirectionalG'].value = .95
sky.material.uniforms['sunPosition'].value.set(.3, -.038, -.95)

/**
 Fog
 */

// scene.fog = new THREE.Fog(0xff0000, 2, 13)
scene.fog = new THREE.FogExp2(0x04343f, .1)


/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    const ghost1Radius = 6
    ghost1.position.x = Math.cos(elapsedTime*.2) * ghost1Radius
    ghost1.position.z = Math.sin(elapsedTime*.2) * Math.sin(elapsedTime*.3) * ghost1Radius

    const ghost2Radius = 5
    ghost2.position.x = Math.cos(elapsedTime*-.15) * Math.cos(elapsedTime*-.07) * ghost2Radius
    ghost2.position.z = Math.sin(elapsedTime*-.15) * ghost2Radius

    const ghost3Radius = 8
    ghost3.position.x = Math.cos(elapsedTime*-.15) * Math.cos(elapsedTime*-.07) * ghost3Radius
    ghost3.position.z = Math.sin(elapsedTime*-.15) * ghost3Radius

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()