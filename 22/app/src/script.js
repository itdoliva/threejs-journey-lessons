import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, .9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

const objectsToTest = [ object1, object2, object3 ]


// Three.js updates the objects’ coordinates (called matrices) right 
// before rendering them. Since we do the ray casting immediately,
// none of the objects have been rendered.
// So, we force the update manually before the ray casting.
// object1.updateMatrixWorld()
// object2.updateMatrixWorld()
// object3.updateMatrixWorld()

// Model
let duck = null
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
    duck = gltf.scene

    duck.position.y = -1.2
    scene.add(duck)

})

// // Raycaster
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0).normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersects = raycaster.intersectObjects([object1, object2, object3])

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

// Mouse
const pointer = new THREE.Vector2()

window.addEventListener('mousemove', _event => {
    pointer.x = (_event.clientX / sizes.width) * 2 - 1
    pointer.y = - (_event.clientY / sizes.height) * 2 + 1
})

let currentIntersect = null

window.addEventListener('click', () => {
    if (currentIntersect) {
        console.log('click')
        console.log(currentIntersect.object)
        // currentIntersect.object.material.color.set('#0000ff')

        if (currentIntersect.object.scale.x < 1.5) {
            gsap.to(currentIntersect.object.scale, { overwrite: true, x: 1.5, y: 1.5, z: 1.5 })
        }
        else if (currentIntersect.object.scale.x > 1) {
            gsap.to(currentIntersect.object.scale, { overwrite: true, x: 1, y: 1, z: 1 })
        }

    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0).normalize()
    // raycaster.set(rayOrigin, rayDirection)

    // const intersects = raycaster.intersectObjects(objectsToTest)

    // // Reset colors
    // for (const object of objectsToTest) {
    //     object.material.color.set('#ff0000')
    // }

    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if (intersects.length) {
        if (currentIntersect === null) {
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    } 
    else {
        if (currentIntersect) {
            console.log('mouse leave')
        }

        currentIntersect = null
    }

    if (duck) {
        const duckIntersects = raycaster.intersectObject(duck)

        if (duckIntersects.length) {
            gsap.to(duck.scale, { x: 1.5, y: 1.5, z: 1.5 })
        } else {
            gsap.to(duck.scale, { x: 1, y: 1, z: 1 })
        }
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()